#!/bin/bash

# Backend Deployment Script for Age-Based UI/UX System
# Usage: ./scripts/deploy-backend.sh [environment]
# Example: ./scripts/deploy-backend.sh production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BACKEND_DIR="backend"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backend Deployment - Age-Based UI/UX${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Check if we're in the right directory
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found!${NC}"
    exit 1
fi

cd $BACKEND_DIR

# Step 2: Backup database
echo -e "\n${YELLOW}Step 1: Backing up database...${NC}"
php artisan db:backup || echo -e "${YELLOW}Warning: Backup failed or not configured${NC}"

# Step 3: Pull latest code
echo -e "\n${YELLOW}Step 2: Pulling latest code...${NC}"
git pull origin main

# Step 4: Install dependencies
echo -e "\n${YELLOW}Step 3: Installing dependencies...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    composer install --no-dev --optimize-autoloader
else
    composer install
fi

# Step 5: Run migrations
echo -e "\n${YELLOW}Step 4: Running database migrations...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    php artisan migrate --force
else
    php artisan migrate
fi

# Step 6: Clear and cache
echo -e "\n${YELLOW}Step 5: Clearing and caching...${NC}"
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 7: Optimize
echo -e "\n${YELLOW}Step 6: Optimizing...${NC}"
php artisan optimize

# Step 8: Restart services (if applicable)
echo -e "\n${YELLOW}Step 7: Restarting services...${NC}"
if command -v systemctl &> /dev/null; then
    sudo systemctl restart php8.1-fpm || echo -e "${YELLOW}Warning: Could not restart PHP-FPM${NC}"
    sudo systemctl reload nginx || echo -e "${YELLOW}Warning: Could not reload Nginx${NC}"
fi

# Step 9: Verify deployment
echo -e "\n${YELLOW}Step 8: Verifying deployment...${NC}"
php artisan --version
php artisan migrate:status | grep "2026_03_25_100000_add_age_group_to_users"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Age group migration verified!${NC}"
else
    echo -e "\n${RED}✗ Age group migration not found!${NC}"
    exit 1
fi

# Step 10: Test API endpoints
echo -e "\n${YELLOW}Step 9: Testing API endpoints...${NC}"
php artisan route:list | grep "age-group"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Backend Deployment Complete! ✓${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Test age group API: curl http://localhost:8000/api/user/age-group"
echo "2. Verify theme switching works"
echo "3. Check error logs: tail -f storage/logs/laravel.log"
echo "4. Monitor performance"

cd ..
