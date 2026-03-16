# Airsynca Deployment Guide

This folder contains all the necessary files and scripts to deploy Airsynca on Ubuntu using nginx.

## 📁 Files Overview

- `deploy.sh` - Main deployment script with interactive prompts
- `nginx.conf.template` - Nginx configuration template
- `env.template` - Environment variables template
- `setup_db.sh` - PostgreSQL database setup script
- `airsynca-backend.service` - Systemd service file for backend
- `README.md` - This documentation

## 🚀 Quick Deployment

### Prerequisites

- Ubuntu 20.04 or later
- User with sudo privileges
- Domain name pointing to your server
- At least 2GB RAM and 20GB storage

### Step 1: Make Scripts Executable

```bash
chmod +x deployment/deploy.sh
chmod +x deployment/setup_db.sh
```

### Step 2: Run Deployment Script

```bash
./deployment/deploy.sh
```

The script will prompt you for:

- **Domain name** (e.g., example.com)
- **Service names** (backend/frontend service names)
- **Ports** (backend: 8000, frontend: 3000)
- **Database setup** (SQLite or PostgreSQL)
- **Redis configuration**
- **Deployment path** (default: /opt/airsynca)
- **Environment** (development/staging/production)
- **Email configuration** (optional)

### Step 3: Configure SSL (Optional)

The deployment script offers Let's Encrypt SSL setup. If you choose to set it up later:

```bash
sudo certbot --nginx -d yourdomain.com
```

## 🔧 Manual Configuration

### Environment Variables

Copy the environment template and customize it:

```bash
cp deployment/env.template /opt/airsynca/moveit_backend/.env
```

Edit the file with your specific configuration:

```bash
nano /opt/airsynca/moveit_backend/.env
```

### Database Setup

For PostgreSQL setup (if not using the deployment script):

```bash
./deployment/setup_db.sh
```

### Nginx Configuration

The nginx configuration is automatically generated from the template. To manually configure:

```bash
sudo cp deployment/nginx.conf.template /etc/nginx/sites-available/airsynca
# Edit the file to replace placeholders
sudo nano /etc/nginx/sites-available/airsynca
sudo ln -s /etc/nginx/sites-available/airsynca /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Systemd Services

Backend service:

```bash
sudo cp deployment/airsynca-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable airsynca-backend
sudo systemctl start airsynca-backend
```

## 📊 Service Management

### Check Service Status

```bash
# Backend
sudo systemctl status airsynca-backend

# Nginx
sudo systemctl status nginx

# Redis
sudo systemctl status redis-server
```

### View Logs

```bash
# Backend logs
sudo journalctl -u airsynca-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Application logs
sudo tail -f /var/log/airsynca/app.log
```

### Restart Services

```bash
sudo systemctl restart airsynca-backend
sudo systemctl restart nginx
```

## 🔄 Updates and Maintenance

### Update Application

```bash
cd /opt/airsynca
git pull

# Update backend
cd moveit_backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart airsynca-backend

# Update frontend
cd /opt/airsynca
npm install
npm run build
sudo systemctl restart nginx
```

### Database Backups

If you created the backup script during setup:

```bash
# Manual backup
/usr/local/bin/airsynca-backup

# View backup schedule
crontab -l
```

Manual backup:

```bash
pg_dump -h localhost -U airsynca_user -d airsynca > backup.sql
```

### Database Restore

```bash
psql -h localhost -U airsynca_user -d airsynca < backup.sql
```

## 🔒 Security Considerations

### Firewall Setup

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### SSL Certificate Renewal

Let's Encrypt certificates auto-renew, but you can test renewal:

```bash
sudo certbot renew --dry-run
```

### Regular Maintenance

1. **Update system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitor disk space**:
   ```bash
   df -h
   ```

3. **Check service health**:
   ```bash
   sudo systemctl status airsynca-backend nginx redis-server
   ```

## 🐛 Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Backend service not running
   ```bash
   sudo systemctl restart airsynca-backend
   ```

2. **Database connection errors**: Check database credentials in .env
3. **Permission errors**: Ensure correct file ownership
   ```bash
   sudo chown -R www-data:www-data /opt/airsynca
   ```

4. **Static files not loading**: Run collectstatic
   ```bash
   cd /opt/airsynca/moveit_backend
   source venv/bin/activate
   python manage.py collectstatic --noinput
   ```

### Performance Optimization

1. **Enable Gzip compression** in nginx
2. **Configure caching headers** for static assets
3. **Use Redis for session storage**
4. **Monitor resource usage** with `htop`

## 📞 Support

For deployment issues:

1. Check the logs mentioned above
2. Verify all services are running
3. Ensure domain DNS points correctly
4. Check firewall settings

## 📋 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable Django debug mode | `False` |
| `SECRET_KEY` | Django secret key | Auto-generated |
| `ALLOWED_HOSTS` | Allowed hostnames | Your domain |
| `DATABASE_URL` | Database connection string | SQLite |
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | Your domain |
| `EMAIL_HOST` | SMTP server (optional) | - |
| `MAX_UPLOAD_SIZE` | Max file upload size | `10MB` |

## 🔄 Development vs Production

### Development Setup
- SQLite database
- Development server
- Debug mode enabled
- Hot reload enabled

### Production Setup
- PostgreSQL database
- Gunicorn + Nginx
- Debug mode disabled
- SSL encryption
- Optimized static files

## 📈 Scaling

For larger deployments:

1. **Load balancing** with multiple nginx instances
2. **Database clustering** with PostgreSQL replication
3. **Redis clustering** for session storage
4. **CDN** for static assets
5. **Monitoring** with Prometheus/Grafana
