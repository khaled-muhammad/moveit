#!/bin/bash

# Airsynca Deployment Script (Updated)
# Deploys Django + Node + Redis + PostgreSQL + Nginx

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Prevent root execution
if [[ $EUID -eq 0 ]]; then
    log_error "Do not run as root. Use a sudo user."
    exit 1
fi

echo -e "${BLUE}=== Airsynca Deployment ===${NC}"

read -p "Domain name: " DOMAIN_NAME
if [[ -z "$DOMAIN_NAME" ]]; then
    log_error "Domain is required"
    exit 1
fi

read -p "Backend port [8000]: " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-8000}

read -p "Frontend port [3000]: " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-3000}

read -p "Deployment path [/opt/airsynca]: " DEPLOY_PATH
DEPLOY_PATH=${DEPLOY_PATH:-/opt/airsynca}

read -p "Environment (development/staging/production) [production]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-production}

echo
log_info "Starting deployment..."

# Update packages
log_info "Updating package index..."
sudo apt update

# Install dependencies
log_info "Installing required packages..."
sudo apt install -y \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    redis-server \
    postgresql \
    postgresql-contrib \
    curl \
    wget \
    git \
    rsync

# Create deploy directory
log_info "Preparing deployment directory..."
sudo mkdir -p $DEPLOY_PATH
sudo chown $USER:$USER $DEPLOY_PATH

# Copy project files
log_info "Syncing project files..."
rsync -av \
    --exclude venv \
    --exclude node_modules \
    --exclude .git \
    ./ $DEPLOY_PATH/

#################################
# PostgreSQL setup
#################################

read -p "Use PostgreSQL? (y/n): " USE_PG

if [[ $USE_PG =~ ^[Yy]$ ]]; then

    read -p "DB name: " DB_NAME
    read -p "DB user: " DB_USER
    read -s -p "DB password: " DB_PASSWORD
    echo

    log_info "Setting up PostgreSQL..."

    sudo -u postgres psql <<EOF
DO
\$do\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$do\$;

DO
\$do\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname='$DB_NAME') THEN
        CREATE DATABASE $DB_NAME OWNER $DB_USER;
    END IF;
END
\$do\$;

GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

    sudo -u postgres psql -d $DB_NAME <<EOF
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER SCHEMA public OWNER TO $DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO $DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

fi

#################################
# Redis
#################################

log_info "Starting Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

#################################
# Backend setup
#################################

log_info "Setting up backend..."

cd $DEPLOY_PATH/moveit_backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn uvicorn[standard] psycopg2-binary

#################################
# Environment file
#################################

SECRET_KEY=$(python3 -c "import secrets;print(secrets.token_urlsafe(50))")

cat > .env <<EOF
DEBUG=False
ENVIRONMENT=$ENVIRONMENT
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=$DOMAIN_NAME,localhost,127.0.0.1
EOF

#################################
# Django setup
#################################

log_info "Running migrations..."

python manage.py migrate
python manage.py collectstatic --noinput

#################################
# Systemd service
#################################

log_info "Creating backend service..."

sudo tee /etc/systemd/system/airsynca-backend.service > /dev/null <<EOF
[Unit]
Description=Airsynca Backend
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=$DEPLOY_PATH/moveit_backend
Environment=PATH=$DEPLOY_PATH/moveit_backend/venv/bin
ExecStart=$DEPLOY_PATH/moveit_backend/venv/bin/gunicorn moveit.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --workers 3 \
    --bind 127.0.0.1:$BACKEND_PORT
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable airsynca-backend
sudo systemctl restart airsynca-backend

#################################
# Frontend build
#################################

log_info "Building frontend..."

cd $DEPLOY_PATH

npm install
npm run build

#################################
# Nginx setup
#################################

log_info "Configuring nginx..."

sudo tee /etc/nginx/sites-available/airsynca > /dev/null <<EOF
server {
    server_name $DOMAIN_NAME;

    location /static/ {
        alias $DEPLOY_PATH/moveit_backend/static/;
    }

    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/airsynca /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx

#################################
# SSL setup
#################################

read -p "Enable SSL (Let's Encrypt)? (y/n): " SSL

if [[ $SSL =~ ^[Yy]$ ]]; then

    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email

fi

#################################
# Firewall
#################################

log_info "Configuring firewall..."

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

#################################

log_success "Deployment complete!"

echo
echo "App URL:"
echo "https://$DOMAIN_NAME"

echo
echo "Check service:"
echo "sudo systemctl status airsynca-backend"

echo
echo "View logs:"
echo "sudo journalctl -u airsynca-backend -f"