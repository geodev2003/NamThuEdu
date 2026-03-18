# 🎓 NamThu Education Backend - Laravel API

**Version**: 2.0  
**Framework**: Laravel 9.x  
**Database**: MySQL  
**Authentication**: Laravel Sanctum  

---

## 🚀 **FEATURES**

### **✅ Core System**
- **Authentication**: Login, Logout, Password Reset with OTP
- **User Management**: Teacher, Student roles with permissions
- **Course Management**: CRUD operations for courses
- **Class Management**: Class creation, enrollment, student management
- **Blog/Content**: Content management system

### **🎯 Test System**
- **Exam Management**: Create, edit, delete exams
- **Question Bank**: 15+ question types support
- **Test Assignment**: Assign tests to classes/students
- **Auto Grading**: Automatic scoring for objective questions
- **Submission Tracking**: View and grade student submissions

### **🎓 Cambridge Templates (NEW)**
- **9 Cambridge Formats**: Starters, Movers, Flyers, KET, PET, FCE, CAE, IELTS, VSTEP
- **Auto-Generation**: Create exams with 50+ questions from templates
- **15+ Question Types**: Multiple choice, fill blanks, matching, speaking, etc.
- **Age-Appropriate**: Young Learners (6-12) to Adult levels
- **Cambridge-Compliant**: Authentic structure and format

---

## 📊 **API ENDPOINTS**

### **Authentication**
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/users/accept` - Accept OTP
- `POST /api/users/reset-password` - Reset password

### **Teacher APIs**
- **Courses**: `/api/teacher/courses` (GET, POST, PUT, DELETE)
- **Classes**: `/api/teacher/classes` (GET, POST, PUT, DELETE)
- **Students**: `/api/teacher/students` (GET, POST, PUT, DELETE)
- **Exams**: `/api/teacher/exams` (GET, POST, PUT, DELETE)
- **Cambridge Templates**: `/api/teacher/exam-templates` (GET)
- **Create from Template**: `/api/teacher/exams/from-template/{id}` (POST)
- **Assignments**: `/api/teacher/exams/{id}/assign` (POST)
- **Grading**: `/api/teacher/submissions` (GET, POST)

### **Student APIs**
- **Tests**: `/api/student/tests` (GET)
- **Take Test**: `/api/student/tests/{id}/start` (POST)
- **Submit**: `/api/student/tests/{id}/submit` (POST)
- **Results**: `/api/student/submissions` (GET)

### **📚 Full API Documentation**
- Swagger UI: `http://localhost:8000/docs`
- API Docs: See `API_DOCUMENTATION_BY_ROLE.md`

---

## 🛠️ **INSTALLATION**

### **Prerequisites**
- PHP 8.0+
- Composer
- MySQL 5.7+
- Node.js (optional, for frontend)

### **Setup Steps**

1. **Install Dependencies**
```bash
composer install
```

2. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Configuration**
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=namthuedu
DB_USERNAME=root
DB_PASSWORD=
```

4. **Run Migrations**
```bash
php artisan migrate
```

5. **Seed Database**
```bash
php artisan db:seed
```

This will create:
- 6 users (3 teachers, 3 students)
- 3 classes
- 1 VSTEP exam with 20 real questions
- 9 Cambridge templates

6. **Start Server**
```bash
php artisan serve
```

Server runs at: `http://127.0.0.1:8000`

---

## 👥 **DEFAULT USERS**

### **Teachers**
- Phone: `0336695863` | Password: `password123`
- Phone: `0987654321` | Password: `password123`
- Phone: `0123456789` | Password: `password123`

### **Students**
- Phone: `0912345678` | Password: `password123`
- Phone: `0923456789` | Password: `password123`
- Phone: `0934567890` | Password: `password123`

---

## 🎓 **CAMBRIDGE TEMPLATES**

### **Available Templates**

#### **Young Learners (Ages 6-12)**
1. **Starters (Pre A1)** - 45 min, 54 questions
2. **Movers (A1)** - 62 min, 64 questions
3. **Flyers (A2)** - 72 min, 73 questions

#### **Main Suite (Adult)**
4. **KET (A2)** - 110 min, 83 questions
5. **PET (B1)** - 140 min, 67 questions
6. **FCE (B2)** - 209 min, 88 questions
7. **CAE (C1)** - 235 min, 102 questions

#### **International**
8. **IELTS** - 165 min, 4 skills
9. **VSTEP** - 150 min, Vietnamese standard

### **Usage Example**
```bash
# Get all templates
GET /api/teacher/exam-templates

# Get Young Learners templates
GET /api/teacher/exam-templates/cambridge_young

# Create exam from Starters template
POST /api/teacher/exams/from-template/1
{
  "eTitle": "Starters Practice Test",
  "eDescription": "Practice for young learners",
  "eIs_private": true
}
```

---

## 📁 **PROJECT STRUCTURE**

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ExamController.php
│   │   │   ├── ExamTemplateController.php ⭐ NEW
│   │   │   ├── ClassController.php
│   │   │   ├── StudentTestController.php
│   │   │   └── ...
│   │   └── Middleware/
│   └── Models/
│       ├── User.php
│       ├── Exam.php
│       ├── ExamTemplate.php ⭐ NEW
│       ├── TemplateSection.php ⭐ NEW
│       ├── Question.php
│       └── ...
├── database/
│   ├── migrations/
│   │   ├── 2026_03_18_120000_create_exam_templates_table.php ⭐
│   │   ├── 2026_03_18_120100_create_template_sections_table.php ⭐
│   │   └── ...
│   └── seeders/
│       ├── CambridgeTemplateSeeder.php ⭐ NEW
│       ├── TestSystemSeeder.php
│       └── DatabaseSeeder.php
├── routes/
│   ├── api.php
│   └── web.php
└── storage/
    └── api-docs/
        └── api-docs.json (Swagger)
```

---

## 🧪 **TESTING**

### **API Testing**
Access Swagger UI: `http://localhost:8000/docs`

### **Manual Testing**
```bash
# Login as teacher
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0336695863","password":"password123"}'

# Get Cambridge templates
curl -X GET http://localhost:8000/api/teacher/exam-templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 **DOCUMENTATION**

- **API Documentation**: `API_DOCUMENTATION_BY_ROLE.md`
- **User Roles**: `USER_ROLES_UPDATED_WITH_CAMBRIDGE.md`
- **Cambridge Implementation**: `CAMBRIDGE_IMPLEMENTATION_COMPLETE.md`
- **Client Requirements**: `CLIENT_REQUIREMENTS_ANALYSIS.md`
- **Database Analysis**: `DATABASE_ANALYSIS.md`

---

## 🔧 **DEVELOPMENT**

### **Add New Migration**
```bash
php artisan make:migration create_table_name
php artisan migrate
```

### **Add New Controller**
```bash
php artisan make:controller ControllerName
```

### **Add New Model**
```bash
php artisan make:model ModelName -m
```

### **Generate Swagger Docs**
```bash
php artisan l5-swagger:generate
```

---

## 🚀 **DEPLOYMENT**

### **Production Setup**
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure production database
4. Run migrations: `php artisan migrate --force`
5. Optimize: `php artisan optimize`
6. Cache config: `php artisan config:cache`

---

## 📊 **DATABASE SCHEMA**

### **Core Tables**
- `users` - User accounts (teachers, students)
- `courses` - Course information
- `classes` - Class management
- `class_enrollments` - Student enrollments

### **Test System Tables**
- `exams` - Exam definitions
- `questions` - Question bank (15+ types)
- `answers` - Answer options
- `test_assignments` - Assigned tests
- `submissions` - Student submissions
- `submission_answers` - Student answers

### **Cambridge Templates Tables** ⭐
- `exam_templates` - Cambridge template definitions
- `template_sections` - Template structure (sections/parts)

---

## 🎯 **ROADMAP**

### **Phase 1: Core System** ✅ DONE
- Authentication & Authorization
- User Management
- Course & Class Management
- Basic Test System

### **Phase 2: Cambridge Templates** ✅ DONE
- 9 Cambridge Templates
- 15+ Question Types
- Auto-Generation System
- Template-based Exam Creation

### **Phase 3: Enhanced Features** 🔄 IN PROGRESS
- Speaking Test Recording
- Writing Assessment AI
- Progress Analytics
- Question Bank Management

### **Phase 4: Advanced Features** 📋 PLANNED
- Mobile App Integration
- Offline Mode
- Certificate Generation
- Multi-Center Support

---

## 🤝 **CONTRIBUTING**

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

---

## 📝 **LICENSE**

Proprietary - NamThu Education © 2026

---

## 📞 **SUPPORT**

For issues or questions, contact the development team.

**🎉 Happy Coding!**