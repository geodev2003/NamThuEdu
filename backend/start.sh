#!/bin/bash

# NamThuEdu Backend Startup Script
# Author: Development Team
# Version: 1.0.0

echo "========================================"
echo "🚀 NamThuEdu Backend Startup"
echo "========================================"
echo ""

# Check if we're in backend directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found!"
    echo "Please run this script from backend directory:"
    echo "  cd backend && ./start.sh"
    exit 1
fi

# Check PHP installation
if ! command -v php &> /dev/null; then
    echo "❌ Error: PHP is not installed!"
    echo "Please install PHP 7.3 or higher"
    exit 1
fi

# Check vendor folder
if [ ! -d "vendor" ]; then
    echo "⚠️  Warning: vendor/ not found"
    echo "📦 Running composer install..."
    composer install
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "📝 Copying from .env.example..."
    cp .env.example .env
    php artisan key:generate
fi

# Display info
PHP_VERSION=$(php -v | head -n 1 | cut -d ' ' -f 2)
LARAVEL_VERSION=$(php artisan --version | cut -d ' ' -f 3)

echo "✅ PHP Version: $PHP_VERSION"
echo "✅ Laravel Version: $LARAVEL_VERSION"
echo ""
echo "📍 Endpoints:"
echo "   - API Server: http://localhost:8000"
echo "   - Health Check: http://localhost:8000/api/health"
echo "   - API Test: http://localhost:8000/api/test"
echo "   - API Docs: http://localhost:8000/api/documentation"
echo ""
echo "📚 Documentation:"
echo "   - BACKEND-API-DOCUMENTATION.md"
echo "   - BACKEND-API-INDEX.md"
echo "   - BACKEND-QUICK-START.md"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000
