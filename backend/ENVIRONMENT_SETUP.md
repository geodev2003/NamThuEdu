# 🚀 Environment Management - NamThuEdu

## 📋 Tổng quan

Hệ thống environment management đơn giản - chỉ cần thay đổi biến `APP_ENV` trong file `.env` là Laravel tự động detect và apply config tương ứng.

## 🔧 Cách sử dụng

### Method 1: Thay đổi trực tiếp trong .env file

```bash
# Chỉnh sửa file .env
APP_ENV=development    # Cho development
APP_ENV=staging       # Cho staging  
APP_ENV=production    # Cho production
```

### Method 2: Sử dụng Artisan Command

```bash
# Switch environment bằng command
php artisan env:switch development
php artisan env:switch staging
php artisan env:switch production
```

## 🌍 Các Environment

### 1. **Development** (`APP_ENV=development`)
- **Debug:** ON
- **Cache:** File-based
- **SMS:** Mock service (log only)
- **Database:** `namthuedu_dev`
- **URL:** `http://localhost:8000`
- **Rate Limits:** Relaxed (10 login attempts)
- **Tools:** Telescope + Debugbar enabled

### 2. **Staging** (`APP_ENV=staging`)
- **Debug:** OFF
- **Cache:** Redis
- **SMS:** Real ESMS service
- **Database:** `namthuedu_staging`
- **URL:** `https://staging-api.namthuedu.com`
- **Rate Limits:** Moderate (8 login attempts)
- **Tools:** Telescope enabled, Debugbar disabled

### 3. **Production** (`APP_ENV=production`)
- **Debug:** OFF
- **Cache:** Redis + Optimizations
- **SMS:** Real ESMS service
- **Database:** `namthuedu_prod`
- **URL:** `https://api.namthuedu.com`
- **Rate Limits:** Strict (5 login attempts)
- **Tools:** All disabled
- **Security:** HTTPS enforced, strict CORS

## ⚙️ Auto-Configuration

Các config sau sẽ tự động thay đổi theo environment:

### 🔒 Security & CORS
```php
// Development
'cors_allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000']

// Staging  
'cors_allowed_origins' => ['https://staging.namthuedu.com']

// Production
'cors_allowed_origins' => ['https://namthuedu.com', 'https://www.namthuedu.com']
```

### 📱 SMS Provider
```php
// Development: Mock SMS (chỉ log, không gửi thật)
'sms.provider' => 'mock'

// Staging/Production: Real ESMS
'sms.provider' => 'esms'
```

### 🚦 Rate Limiting
```php
// Development: Relaxed
'rate_limits.login' => 10
'rate_limits.otp' => 5

// Production: Strict
'rate_limits.login' => 5
'rate_limits.otp' => 3
```

### 💾 Cache & Database
```php
// Development: File cache, query logging ON
'cache.default_driver' => 'file'
'database.query_log' => true

// Production: Redis cache, query logging OFF
'cache.default_driver' => 'redis'  
'database.query_log' => false
```

## 🛠️ Development Tools

### Telescope (Laravel Debugger)
- **Development:** ✅ Enabled
- **Staging:** ✅ Enabled  
- **Production:** ❌ Disabled

### Debugbar
- **Development:** ✅ Enabled
- **Staging:** ❌ Disabled
- **Production:** ❌ Disabled

## 📝 Logging

### Log Levels
- **Development:** `debug` (all logs)
- **Staging:** `info` (info + warnings + errors)
- **Production:** `error` (errors only)

### Log Channels
- **Development:** `single` file
- **Staging/Production:** `daily` rotation

## 🚀 Deployment Workflow

### 1. Development → Staging
```bash
# Switch to staging
php artisan env:switch staging

# Run migrations
php artisan migrate

# Clear caches
php artisan optimize:clear
```

### 2. Staging → Production
```bash
# Switch to production
php artisan env:switch production

# Run optimizations
php artisan optimize

# Backup database first!
mysqldump namthuedu_prod > backup_$(date +%Y%m%d).sql
```

## 🔍 Kiểm tra Environment hiện tại

```bash
# Check current environment
php artisan env

# Or check in code
app()->environment()           // Returns: 'development', 'staging', 'production'
app()->environment('staging')  // Returns: true/false
```

## 📋 Environment Variables cần thiết

### Development
```env
APP_ENV=development
DB_DATABASE=namthuedu_dev
ESMS_API_KEY=          # Để trống (dùng mock)
ESMS_SECRET_KEY=       # Để trống (dùng mock)
```

### Staging
```env
APP_ENV=staging
DB_DATABASE=namthuedu_staging
ESMS_API_KEY=your_staging_key
ESMS_SECRET_KEY=your_staging_secret
```

### Production
```env
APP_ENV=production
DB_DATABASE=namthuedu_prod
ESMS_API_KEY=your_production_key
ESMS_SECRET_KEY=your_production_secret
```

## 🎯 Best Practices

1. **Always test in staging** trước khi deploy production
2. **Backup database** trước khi switch environment
3. **Clear caches** sau khi switch environment
4. **Check logs** sau khi deploy
5. **Monitor performance** trong production

## 🆘 Troubleshooting

### Config không update?
```bash
php artisan config:clear
php artisan config:cache
```

### Cache issues?
```bash
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Database connection error?
- Kiểm tra `DB_DATABASE` trong `.env`
- Đảm bảo database tồn tại
- Check database credentials

---

**🎉 Xong! Giờ chỉ cần thay đổi `APP_ENV` là mọi thứ tự động config theo environment!**