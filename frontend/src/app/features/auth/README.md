# NamThu Education - Authentication Pages

## 🎨 Design Highlights

### Visual Features
- **Dark gradient backgrounds**: Slate → Blue → Purple/Pink gradients
- **Glassmorphism**: Backdrop blur effects with semi-transparent panels
- **Animated backgrounds**: Floating orbs, particles, and geometric shapes
- **Custom animations**: Float, pulse, and fade-in effects
- **Responsive design**: Mobile-first approach with elegant tablet/desktop layouts

### Pages

#### 1. Login (`/login`)
- Split-screen layout (desktop)
- Left side: Product branding, features, stats, testimonial
- Right side: Login form with email/password
- Social login: Google, GitHub
- Remember me checkbox
- Forgot password link
- Security badge (SSL 256-bit)

#### 2. Register (`/register`)
- Split-screen layout (desktop)
- Left side: Benefits list, testimonial
- Right side: Registration form
- Fields: Full name, Email, Phone, School, Password, Confirm Password
- Terms & conditions checkbox
- 30-day free trial badge

#### 3. Forgot Password (`/forgot-password`)
- Centered layout
- Single email input
- Success state with instructions
- Resend email option
- Back to login link

## 🚀 Routes

```
/login          → Login page
/register       → Registration page
/forgot-password → Password reset page
```

## 🎯 Navigation Flow

```
Login ←→ Register
  ↓
Forgot Password → Email Sent → Back to Login
  ↓
Dashboard (after successful login)
```

## 🎨 Brand Colors

- **Primary**: Blue (#2563EB) → Purple (#8B5CF6)
- **Secondary**: Pink (#EC4899) → Rose (#F43F5E)
- **Background**: Dark gradients (Slate/Blue/Purple/Pink)
- **Glass panels**: White/10 with backdrop blur

## ✨ Animations

All animations defined in `/src/styles/theme.css`:
- `animate-float`: Floating shapes (6s)
- `animate-float-slow`: Slow particle movement (10s)
- `animate-pulse`: Gradient orbs
- Animation delays: 300ms, 500ms, 700ms, 1000ms

## 📱 Responsive Breakpoints

- Mobile: Single column, stacked layout
- Tablet (lg): Two-column split layout appears
- Desktop: Full split-screen with side branding

## 🔐 Security Features

- Password visibility toggle
- SSL encryption badge
- Terms & privacy policy links
- Email validation
- Password strength indicator (Register page)

## 💡 Usage

Navigate to `/login` to see the login page. The form will redirect to `/` (Dashboard) after successful login simulation (1.5s delay).

For development, you can access:
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`
- Forgot: `http://localhost:5173/forgot-password`
