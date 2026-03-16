#!/bin/bash

# Airsynca Deployment Script
# This script deploys Airsynca on Ubuntu with nginx

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
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

# Get user input
echo -e "${BLUE}=== Airsynca Deployment Configuration ===${NC}"

# Domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
if [[ -z "$DOMAIN_NAME" ]]; then
    log_error "Domain name is required"
    exit 1
fi

# Service names
read -p "Backend service name (default: airsynca-backend): " BACKEND_SERVICE
BACKEND_SERVICE=${BACKEND_SERVICE:-"airsynca-backend"}

read -p "Frontend service name (default: airsynca-frontend): " FRONTEND_SERVICE
FRONTEND_SERVICE=${FRONTEND_SERVICE:-"airsynca-frontend"}

# Ports
read -p "Backend port (default: 8000): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-"8000"}

read -p "Frontend port (default: 3000): " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-"3000"}

# Database configuration
echo -e "\n${YELLOW}Database Configuration${NC}"
read -p "Database type (sqlite/postgresql) [default: sqlite]: " DB_TYPE
DB_TYPE=${DB_TYPE:-"sqlite"}

if [[ "$DB_TYPE" == "postgresql" ]]; then
    read -p "PostgreSQL host (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-"localhost"}
    
    read -p "PostgreSQL port (default: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-"5432"}
    
    read -p "Database name: " DB_NAME
    if [[ -z "$DB_NAME" ]]; then
        log_error "Database name is required for PostgreSQL"
        exit 1
    fi
    
    read -p "Database user: " DB_USER
    if [[ -z "$DB_USER" ]]; then
        log_error "Database user is required for PostgreSQL"
        exit 1
    fi
    
    read -s -p "Database password: " DB_PASSWORD
    echo
    if [[ -z "$DB_PASSWORD" ]]; then
        log_error "Database password is required for PostgreSQL"
        exit 1
    fi
fi

# Redis configuration
read -p "Redis host (default: localhost): " REDIS_HOST
REDIS_HOST=${REDIS_HOST:-"localhost"}

read -p "Redis port (default: 6379): " REDIS_PORT
REDIS_PORT=${REDIS_PORT:-"6379"}

# Deployment path
read -p "Deployment path (default: /opt/airsynca): " DEPLOY_PATH
DEPLOY_PATH=${DEPLOY_PATH:-"/opt/airsynca"}

# Environment
read -p "Environment (development/staging/production) [default: production]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Email configuration (for Django)
read -p "Email host (optional): " EMAIL_HOST
read -p "Email port (default: 587): " EMAIL_PORT
EMAIL_PORT=${EMAIL_PORT:-"587"}
read -p "Email user (optional): " EMAIL_USER
read -s -p "Email password (optional): " EMAIL_PASSWORD
echo

# Generate secret key
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')

# Display configuration
echo -e "\n${BLUE}=== Deployment Configuration Summary ===${NC}"
echo "Domain: $DOMAIN_NAME"
echo "Backend Service: $BACKEND_SERVICE"
echo "Frontend Service: $FRONTEND_SERVICE"
echo "Backend Port: $BACKEND_PORT"
echo "Frontend Port: $FRONTEND_PORT"
echo "Database Type: $DB_TYPE"
if [[ "$DB_TYPE" == "postgresql" ]]; then
    echo "Database Host: $DB_HOST:$DB_PORT"
    echo "Database Name: $DB_NAME"
    echo "Database User: $DB_USER"
fi
echo "Redis: $REDIS_HOST:$REDIS_PORT"
echo "Deployment Path: $DEPLOY_PATH"
echo "Environment: $ENVIRONMENT"

read -p $'\nProceed with deployment? (y/n): ' -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Deployment cancelled"
    exit 0
fi

# Start deployment
log_info "Starting Airsynca deployment..."

# Update system packages
log_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
log_info "Installing required packages..."
sudo apt install -y nginx python3 python3-pip python3-venv nodejs npm redis-server postgresql postgresql-contrib curl wget git

# Create deployment directory
log_info "Creating deployment directory..."
sudo mkdir -p $DEPLOY_PATH
sudo chown $USER:$USER $DEPLOY_PATH

# Setup PostgreSQL if needed
if [[ "$DB_TYPE" == "postgresql" ]]; then
    log_info "Setting up PostgreSQL..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
fi

# Start Redis
log_info "Starting Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Copy project files
log_info "Copying project files..."
cp -r $(pwd) $DEPLOY_PATH/

# Setup backend
log_info "Setting up backend..."
cd $DEPLOY_PATH/moveit_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Create environment file
cat > .env << EOF
# Environment
DEBUG=False
ENVIRONMENT=$ENVIRONMENT
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=$DOMAIN_NAME,localhost,127.0.0.1

# Database
DB_TYPE=$DB_TYPE
EOF

if [[ "$DB_TYPE" == "postgresql" ]]; then
    cat >> .env << EOF
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
EOF
else
    cat >> .env << EOF
DATABASE_URL=sqlite://$(pwd)/db.sqlite3
EOF
fi

cat >> .env << EOF

# Redis
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
CHANNEL_LAYERS=default

# CORS
CORS_ALLOWED_ORIGINS=https://$DOMAIN_NAME,http://localhost:$FRONTEND_PORT

# Email (optional)
EOF

if [[ -n "$EMAIL_HOST" ]]; then
    cat >> .env << EOF
EMAIL_HOST=$EMAIL_HOST
EMAIL_PORT=$EMAIL_PORT
EMAIL_HOST_USER=$EMAIL_USER
EMAIL_HOST_PASSWORD=$EMAIL_PASSWORD
DEFAULT_FROM_EMAIL=noreply@$DOMAIN_NAME
EOF
fi

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser (optional)
read -p "Create Django superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Setup frontend
log_info "Setting up frontend..."
cd $DEPLOY_PATH

# Install Node.js dependencies
npm install

# Build frontend
npm run build

# Create systemd service for backend
log_info "Creating systemd service for backend..."
sudo tee /etc/systemd/system/$BACKEND_SERVICE.service > /dev/null << EOF
[Unit]
Description=Airsynca Backend
After=network.target

[Service]
Type=exec
User=$USER
Group=$USER
WorkingDirectory=$DEPLOY_PATH/moveit_backend
Environment=PATH=$DEPLOY_PATH/moveit_backend/venv/bin
ExecStart=$DEPLOY_PATH/moveit_backend/venv/bin/gunicorn moveit.asgi:application --bind 127.0.0.1:$BACKEND_PORT --workers 3
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for frontend (optional, for development)
if [[ "$ENVIRONMENT" == "development" ]]; then
    log_info "Creating systemd service for frontend..."
    sudo tee /etc/systemd/system/$FRONTEND_SERVICE.service > /dev/null << EOF
[Unit]
Description=Airsynca Frontend
After=network.target

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=$DEPLOY_PATH
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start -- --port $FRONTEND_PORT --host 0.0.0.0
Restart=always

[Install]
WantedBy=multi-user.target
EOF
fi

# Setup nginx
log_info "Setting up nginx..."
# Replace placeholders in nginx template
sed -e "s/{{DOMAIN_NAME}}/$DOMAIN_NAME/g" \
    -e "s/{{DEPLOY_PATH}}/$DEPLOY_PATH/g" \
    -e "s/{{BACKEND_PORT}}/$BACKEND_PORT/g" \
    $DEPLOY_PATH/deployment/nginx.conf.template > /tmp/airsynca_nginx.conf

sudo cp /tmp/airsynca_nginx.conf /etc/nginx/sites-available/airsynca
sudo ln -sf /etc/nginx/sites-available/airsynca /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Enable and start services
log_info "Enabling and starting services..."
sudo systemctl daemon-reload
sudo systemctl enable $BACKEND_SERVICE
sudo systemctl start $BACKEND_SERVICE

if [[ "$ENVIRONMENT" == "development" ]]; then
    sudo systemctl enable $FRONTEND_SERVICE
    sudo systemctl start $FRONTEND_SERVICE
fi

sudo systemctl enable nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt (optional)
read -p $'\nSetup SSL with Let\\'s Encrypt? (y/n): ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Setting up SSL..."
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email $EMAIL_USER
    sudo systemctl enable certbot.timer
fi

# Final setup
log_info "Running final setup..."
cd $DEPLOY_PATH/moveit_backend
source venv/bin/activate
python manage.py create_default_plans

# Display success message
log_success "Deployment completed successfully!"
echo -e "\n${GREEN}=== Next Steps ===${NC}"
echo "1. Your application is now deployed at: https://$DOMAIN_NAME"
echo "2. Backend API is available at: https://$DOMAIN_NAME/api/"
echo "3. WebSocket endpoint: wss://$DOMAIN_NAME/ws/"
echo "4. Check service status:"
echo "   sudo systemctl status $BACKEND_SERVICE"
echo "   sudo systemctl status nginx"
echo "5. View logs:"
echo "   sudo journalctl -u $BACKEND_SERVICE -f"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "6. To update the application:"
echo "   cd $DEPLOY_PATH && git pull"
echo "   # Update backend"
echo "   cd moveit_backend && source venv/bin/activate && pip install -r requirements.txt"
echo "   python manage.py migrate && python manage.py collectstatic --noinput"
echo "   sudo systemctl restart $BACKEND_SERVICE"
echo "   # Update frontend"
echo "   cd $DEPLOY_PATH && npm install && npm run build"
echo "   sudo systemctl restart nginx"

if [[ "$ENVIRONMENT" == "development" ]]; then
    echo "7. Frontend development server: http://localhost:$FRONTEND_PORT"
fi

echo -e "\n${YELLOW}Important:${NC} Make sure your domain DNS points to this server's IP address."
echo -e "${YELLOW}Important:${NC} Configure your firewall to allow HTTP (80) and HTTPS (443) traffic:"
echo "   sudo ufw allow 'Nginx Full'"
echo "   sudo ufw enable"
