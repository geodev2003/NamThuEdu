#!/bin/bash

echo "🚀 Setting up WebSocket for Nam Thu Edu Test System"
echo "=================================================="

# Install dependencies
echo "📦 Installing dependencies..."
composer install --no-dev --optimize-autoloader

# Install Redis (if not installed)
echo "🔧 Checking Redis installation..."
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis not found. Please install Redis first:"
    echo "   - Windows: Download from https://redis.io/download"
    echo "   - Ubuntu: sudo apt install redis-server"
    echo "   - macOS: brew install redis"
    exit 1
fi

# Start Redis
echo "🔴 Starting Redis server..."
redis-server --daemonize yes

# Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Generate app key if needed
if grep -q "APP_KEY=$" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate
fi

# Publish WebSocket assets
echo "📡 Publishing WebSocket configuration..."
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"

# Run WebSocket migrations
echo "🗄️ Running WebSocket migrations..."
php artisan migrate

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the system:"
echo "   1. Start Laravel server: php artisan serve"
echo "   2. Start WebSocket server: php artisan websocket:serve"
echo "   3. Start queue worker: php artisan queue:work"
echo ""
echo "📊 WebSocket Dashboard: http://localhost:8000/laravel-websockets"
echo "🔧 Test the system with 100+ concurrent users!"
echo ""
echo "⚠️  Make sure Redis is running: redis-server"