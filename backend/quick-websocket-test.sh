#!/bin/bash

echo "⚡ Quick WebSocket Test for Nam Thu Edu"
echo "====================================="

# Quick setup check
echo "🔍 Quick system check..."

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "🔴 Starting Redis..."
    redis-server --daemonize yes
    sleep 2
fi

# Check if Laravel is running
if ! curl -s http://localhost:8000/api/users > /dev/null 2>&1; then
    echo "🚀 Starting Laravel..."
    cd backend
    php artisan serve --host=0.0.0.0 --port=8000 &
    LARAVEL_PID=$!
    sleep 5
    cd ..
fi

# Check WebSocket
if ! nc -z localhost 6001 2>/dev/null; then
    echo "📡 Starting WebSocket server..."
    cd backend
    php artisan websockets:serve --host=0.0.0.0 --port=6001 &
    WEBSOCKET_PID=$!
    sleep 3
    cd ..
fi

echo "✅ Services ready!"
echo ""

# Run quick test
echo "🧪 Running Quick Test (20 users, 60 seconds)..."
echo ""

cd backend && php artisan websocket:test-load --users=20 --duration=60 --answers=5

echo ""
echo "🎯 Quick test completed!"
echo ""
echo "💡 For more comprehensive testing, run: ./run-websocket-tests.sh"

# Cleanup
if [ ! -z "$WEBSOCKET_PID" ]; then
    kill $WEBSOCKET_PID 2>/dev/null
fi

if [ ! -z "$LARAVEL_PID" ]; then
    kill $LARAVEL_PID 2>/dev/null
fi