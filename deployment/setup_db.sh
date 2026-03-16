#!/bin/bash

# Airsynca PostgreSQL Database Setup Script
# Creates database, user, permissions, and optional backups

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Prevent running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root. Run as a regular user with sudo privileges."
   exit 1
fi

echo -e "${BLUE}=== PostgreSQL Database Setup ===${NC}"

read -p "Database name [default: airsynca]: " DB_NAME
DB_NAME=${DB_NAME:-airsynca}

read -p "Database user [default: airsynca_user]: " DB_USER
DB_USER=${DB_USER:-airsynca_user}

read -s -p "Database password: " DB_PASSWORD
echo
if [[ -z "$DB_PASSWORD" ]]; then
    log_error "Database password is required"
    exit 1
fi

read -p "Database host [default: localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port [default: 5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

echo
echo -e "${BLUE}=== Database Configuration ===${NC}"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Host: $DB_HOST"
echo "Database Port: $DB_PORT"

read -p $'\nProceed with database setup? (y/n): ' -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Database setup cancelled"
    exit 0
fi

# Install PostgreSQL if missing
log_info "Checking PostgreSQL installation..."

if ! command -v psql &> /dev/null; then
    log_info "Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
else
    log_success "PostgreSQL already installed"
fi

# Create DB and user safely
log_info "Creating database and user if they do not exist..."

sudo -u postgres psql <<EOF

DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
   END IF;
END
\$do\$;

DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
      CREATE DATABASE $DB_NAME OWNER $DB_USER;
   END IF;
END
\$do\$;

GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

EOF

# Fix schema permissions (important for Django migrations)
log_info "Configuring schema permissions..."

sudo -u postgres psql -d $DB_NAME <<EOF

GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER SCHEMA public OWNER TO $DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO $DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO $DB_USER;

EOF

# Test connection
log_info "Testing database connection..."

if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    log_success "Database connection successful"
else
    log_error "Database connection failed"
    exit 1
fi

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Save configuration
CONFIG_FILE="/tmp/airsynca_db_config"

cat > $CONFIG_FILE <<EOF
# Airsynca Database Configuration
DB_TYPE=postgresql
DATABASE_URL=$DATABASE_URL
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
EOF

log_success "Database setup completed!"

echo
echo -e "${GREEN}=== Database Information ===${NC}"
echo "Database URL: $DATABASE_URL"
echo "Config file: $CONFIG_FILE"

echo
echo "Add these to your .env file:"
echo "DB_TYPE=postgresql"
echo "DATABASE_URL=$DATABASE_URL"
echo "DB_NAME=$DB_NAME"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"

# Optional backup script
read -p $'\nCreate automatic backup script? (y/n): ' -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then

BACKUP_SCRIPT="/usr/local/bin/airsynca-backup"

sudo tee $BACKUP_SCRIPT > /dev/null <<EOF
#!/bin/bash

BACKUP_DIR="/var/backups/airsynca"
DATE=\$(date +%Y%m%d_%H%M%S)
FILE="\$BACKUP_DIR/airsynca_\$DATE.sql"

mkdir -p \$BACKUP_DIR

PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > \$FILE

gzip \$FILE

find \$BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup saved to \$FILE.gz"
EOF

sudo chmod +x $BACKUP_SCRIPT

(crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT") | crontab -

log_success "Backup script installed"
log_info "Daily backup scheduled at 2:00 AM"

fi

echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add database config to your .env"
echo "2. Run: python manage.py migrate"
echo "3. Run: python manage.py createsuperuser"