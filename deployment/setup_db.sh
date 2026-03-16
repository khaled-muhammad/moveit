#!/bin/bash

# Database Setup Script for Airsynca
# This script sets up PostgreSQL database for Airsynca

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root. Run as a regular user with sudo privileges."
   exit 1
fi

# Get database configuration
echo -e "${BLUE}=== PostgreSQL Database Setup ===${NC}"

read -p "Database name [default: airsynca]: " DB_NAME
DB_NAME=${DB_NAME:-"airsynca"}

read -p "Database user [default: airsynca_user]: " DB_USER
DB_USER=${DB_USER:-"airsynca_user"}

read -s -p "Database password: " DB_PASSWORD
echo
if [[ -z "$DB_PASSWORD" ]]; then
    log_error "Database password is required"
    exit 1
fi

read -p "Database host [default: localhost]: " DB_HOST
DB_HOST=${DB_HOST:-"localhost"}

read -p "Database port [default: 5432]: " DB_PORT
DB_PORT=${DB_PORT:-"5432"}

# Confirm database setup
echo -e "\n${BLUE}=== Database Configuration ===${NC}"
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

# Install PostgreSQL if not already installed
log_info "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    log_info "Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Create database and user
log_info "Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || log_warning "Database $DB_NAME might already exist"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || log_warning "User $DB_USER might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Test database connection
log_info "Testing database connection..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    log_success "Database connection successful"
else
    log_error "Database connection failed"
    exit 1
fi

# Create database connection string
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Save configuration to file
cat > /tmp/airsynca_db_config << EOF
# Database Configuration
DB_TYPE=postgresql
DATABASE_URL=$DATABASE_URL
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
EOF

log_success "Database setup completed!"
echo -e "\n${GREEN}=== Database Information ===${NC}"
echo "Database URL: $DATABASE_URL"
echo "Configuration saved to: /tmp/airsynca_db_config"
echo ""
echo "Add these environment variables to your .env file:"
echo "DB_TYPE=postgresql"
echo "DATABASE_URL=$DATABASE_URL"
echo "DB_NAME=$DB_NAME"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"

# Optional: Create backup script
read -p $'\nCreate database backup script? (y/n): ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    BACKUP_SCRIPT="/usr/local/bin/airsynca-backup"
    
    sudo tee $BACKUP_SCRIPT > /dev/null << EOF
#!/bin/bash

# Airsynca Database Backup Script
BACKUP_DIR="/var/backups/airsynca"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\$BACKUP_DIR/airsynca_backup_\$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p \$BACKUP_DIR

# Create database backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > \$BACKUP_FILE

# Compress backup
gzip \$BACKUP_FILE

# Remove backups older than 7 days
find \$BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: \$BACKUP_FILE.gz"
EOF

    sudo chmod +x $BACKUP_SCRIPT
    
    # Add to crontab for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT") | crontab -
    
    log_success "Backup script created at $BACKUP_SCRIPT"
    log_info "Daily backups scheduled at 2:00 AM"
fi

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update your .env file with the database configuration"
echo "2. Run Django migrations: python manage.py migrate"
echo "3. Create a superuser: python manage.py createsuperuser"
