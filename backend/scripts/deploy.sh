#!/bin/bash

# ===========================================
# NamThuEdu Deployment Script
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
SKIP_BACKUP=false
SKIP_MIGRATION=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT    Set environment (staging|production) [default: production]"
    echo "  -s, --skip-backup       Skip database backup"
    echo "  -m, --skip-migration    Skip database migration"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env staging"
    echo "  $0 --env production --skip-backup"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        -m|--skip-migration)
            SKIP_MIGRATION=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Allowed environments: staging, production"
    exit 1
fi

print_status "Starting deployment to $ENVIRONMENT environment..."

# Check if we're in the correct directory
if [[ ! -f "artisan" ]]; then
    print_error "artisan file not found. Please run this script from the Laravel root directory."
    exit 1
fi

# 1. Switch to maintenance mode
print_status "Enabling maintenance mode..."
php artisan down --retry=60 --secret="namthuedu-deploy-$(date +%s)"

# Function to cleanup on exit
cleanup() {
    print_status "Bringing application back online..."
    php artisan up
}
trap cleanup EXIT

# 2. Pull latest code (if in git repository)
if [[ -d ".git" ]]; then
    print_status "Pulling latest code from repository..."
    git pull origin main
else
    print_warning "Not a git repository, skipping code pull"
fi

# 3. Switch environment
print_status "Switching to $ENVIRONMENT environment..."
php scripts/switch-env.php $ENVIRONMENT

# 4. Install/Update dependencies
print_status "Installing/updating Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# 5. Database backup (if not skipped)
if [[ "$SKIP_BACKUP" == false ]]; then
    print_status "Creating database backup..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Get database credentials from .env
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2)
    DB_DATABASE=$(grep DB_DATABASE .env | cut -d '=' -f2)
    DB_USERNAME=$(grep DB_USERNAME .env | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
    
    if [[ -n "$DB_PASSWORD" ]]; then
        mysqldump -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" > "storage/backups/$BACKUP_FILE"
    else
        mysqldump -h"$DB_HOST" -u"$DB_USERNAME" "$DB_DATABASE" > "storage/backups/$BACKUP_FILE"
    fi
    
    print_success "Database backup created: storage/backups/$BACKUP_FILE"
else
    print_warning "Skipping database backup"
fi

# 6. Run database migrations (if not skipped)
if [[ "$SKIP_MIGRATION" == false ]]; then
    print_status "Running database migrations..."
    php artisan migrate --force
else
    print_warning "Skipping database migrations"
fi

# 7. Seed database (only for staging)
if [[ "$ENVIRONMENT" == "staging" ]]; then
    print_status "Seeding database with test data..."
    php artisan db:seed --force
fi

# 8. Clear and cache configurations
print_status "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 9. Generate API documentation (if L5-Swagger is installed)
if php artisan list | grep -q "l5-swagger"; then
    print_status "Generating API documentation..."
    php artisan l5-swagger:generate
fi

# 10. Set proper permissions
print_status "Setting file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# 11. Restart services (if applicable)
if command -v supervisorctl &> /dev/null; then
    print_status "Restarting queue workers..."
    supervisorctl restart all
fi

if command -v systemctl &> /dev/null; then
    if systemctl is-active --quiet php8.1-fpm; then
        print_status "Restarting PHP-FPM..."
        systemctl reload php8.1-fpm
    fi
fi

# 12. Health check
print_status "Running health check..."
HEALTH_URL="https://api.namthuedu.com/health"
if [[ "$ENVIRONMENT" == "staging" ]]; then
    HEALTH_URL="https://staging-api.namthuedu.com/health"
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
if [[ "$HTTP_STATUS" == "200" ]]; then
    print_success "Health check passed (HTTP $HTTP_STATUS)"
else
    print_warning "Health check failed (HTTP $HTTP_STATUS)"
fi

print_success "Deployment to $ENVIRONMENT completed successfully!"
print_status "Application is now online and ready to serve requests."

# Show deployment summary
echo ""
echo "=== Deployment Summary ==="
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $(date)"
echo "Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
echo "=========================="