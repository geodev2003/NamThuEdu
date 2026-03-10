```
backend/
│
├── public/
│   └── index.php          // Front Controller
│
├── app/
│   ├── controllers/
│   │   ├── AuthController.php
│   │   ├── UserController.php
│   │   ├── TestController.php
│   │
│   ├── models/
│   │   ├── User.php
│   │   ├── Test.php
│   │
│   ├── services/
│   │   ├── AuthService.php
│   │   ├── UserService.php
│   │
│   ├── middlewares/
│   │   ├── AuthMiddleware.php
│   │   ├── RoleMiddleware.php
│   │
│   ├── core/
│   │   ├── Router.php
│   │   ├── Controller.php
│   │   ├── Database.php
│   │   └── Response.php
│   │
│   └── config/
│       ├── database.php
│       └── app.php
│
├── vendor/                // nếu dùng composer
└── .htaccess

```