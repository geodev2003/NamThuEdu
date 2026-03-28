# Authentication Features

Organized authentication components by role for better maintainability and clarity.

## Folder Structure

```
auth/
├── student/              # Student authentication
│   ├── StudentLogin.tsx
│   ├── StudentRegister.tsx
│   └── index.ts
├── teacher/              # Teacher authentication
│   ├── TeacherLogin.tsx
│   └── index.ts
├── shared/               # Shared auth components
│   ├── ForgotPassword.tsx
│   └── index.ts
├── Login.tsx            # Legacy - Generic login (for admin)
├── Register.tsx         # Legacy - Generic register
└── index.ts             # Main exports
```

## Usage

### Student Authentication

```tsx
import { StudentLogin, StudentRegister } from '@/app/features/auth/student';
```

**Routes:**
- `/dang-nhap` - Student login
- `/dang-ky` - Student registration

**Features:**
- Age-based theme integration
- Date of birth collection
- Age group preview
- Auto-login after registration

### Teacher Authentication

```tsx
import { TeacherLogin } from '@/app/features/auth/teacher';
```

**Routes:**
- `/giao-vien/dang-nhap` - Teacher login

**Features:**
- Professional UI
- Email-based login
- Social login options (Google, GitHub)

### Shared Components

```tsx
import { ForgotPassword } from '@/app/features/auth/shared';
```

**Routes:**
- `/forgot-password` - Password reset
- `/quen-mat-khau` - Password reset (Vietnamese)

## Design Principles

1. **Role-Based Organization**: Each role has its own folder
2. **Clear Naming**: Component names include role prefix (Student*, Teacher*)
3. **Shared Components**: Common functionality in `/shared`
4. **Backward Compatibility**: Legacy components maintained for existing routes
5. **Index Exports**: Clean imports via index files

## Adding New Auth Components

1. Determine the role (student/teacher/admin)
2. Create component in appropriate folder
3. Export from folder's index.ts
4. Add route in authRoutes.tsx
5. Update this README

## Migration Notes

- Old `StudentLogin.tsx` → `student/StudentLogin.tsx`
- Old `RegisterEnhanced.tsx` → `student/StudentRegister.tsx`
- Old `TeacherLogin.tsx` → `teacher/TeacherLogin.tsx`
- Old `ForgotPassword.tsx` → `shared/ForgotPassword.tsx`
- `Login.tsx` and `Register.tsx` kept for backward compatibility
