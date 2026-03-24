# Test Assignment Management System

## 📋 Overview

Modern, comprehensive Test Assignment Management System for teachers in NamThu Education platform. Built with React, TypeScript, and Tailwind CSS following the design document specifications.

## 🎨 Pages

### 1. **AssignmentList.tsx** - Main Dashboard (`/bai-tap`)

**Features:**
- ✅ 4 Statistics cards (Total, Class assignments, Individual, Overdue)
- ✅ Filter bar (Search, Exam dropdown, Target type dropdown)
- ✅ Data table with columns:
  - Exam title
  - Target type badge (class/student)
  - Target name
  - Deadline with countdown & overdue indicator
  - Max attempts
  - Completion rate with progress bar
  - Action buttons (View Progress, Send Reminder, Delete)
- ✅ Empty state with illustration
- ✅ "Giao bài mới" and "Giao hàng loạt" buttons

**Color Scheme:**
- Blue (#2563EB): Primary actions
- Green (#10B981): Class assignments & success
- Purple (#8B5CF6): Individual assignments
- Red (#EF4444): Overdue warnings
- Orange (#F59E0B): Reminders

---

### 2. **AssignmentProgress.tsx** - Progress Tracking (`/bai-tap/:assignmentId/tien-do`)

**Features:**
- ✅ Breadcrumb navigation
- ✅ Assignment info card with gradient background showing:
  - Exam title & type
  - Target (class/student)
  - Deadline with countdown
  - Max attempts
- ✅ Overdue warning banner (conditional)
- ✅ 4 Statistics cards (Total students, Completed, Not completed, Completion %)
- ✅ Two-column layout:
  - **LEFT**: Completed students
    - Student cards with name, phone, score badge, submission time, attempt number, "Xem chi tiết" link
  - **RIGHT**: Not completed students
    - Student cards with "Gửi nhắc nhở" button
- ✅ Floating action button: "Gửi nhắc nhở hàng loạt"

**Design Elements:**
- Gradient header card (Blue → Purple)
- Trophy icons for completed students
- Clock icons for not completed
- Circular progress indicators
- Action buttons with icons

---

### 3. **AssignmentStats.tsx** - Statistics Dashboard (`/bai-tap/thong-ke`)

**Features:**
- ✅ 4 Overview cards with trend indicators (+/- percentages):
  - Total assignments
  - Assignments with deadlines
  - Recent assignments (7 days)
  - Overdue assignments
- ✅ Charts section using Recharts:
  - **Bar Chart**: "Assignments by Exam" - Distribution across exam types
  - **Line Chart**: "Assignment trends over time" - 7-day trend
- ✅ Quick actions panel:
  - "Xem tất cả assignments" → `/bai-tap`
  - "Giao bài mới" → `/bai-tap/giao-moi`
  - "Xem báo cáo chi tiết" → `/bao-cao`
- ✅ Recent assignments list with:
  - Target type badges
  - Completion metrics
  - Circular progress indicators

**Charts:**
- Modern gradients for bars and lines
- Custom tooltips with glassmorphism
- Responsive containers
- Grid patterns

---

## 🎯 Routes

```typescript
/bai-tap                           → AssignmentList (Main dashboard)
/bai-tap/danh-sach                 → AssignmentList (Alias)
/bai-tap/:assignmentId/tien-do     → AssignmentProgress (Dynamic route)
/bai-tap/thong-ke                  → AssignmentStats (Statistics)
/bai-tap/giao-moi                  → CreateAssignment (To be implemented)
/bai-tap/giao-hang-loat            → BulkAssignment (To be implemented)
```

---

## 🎨 Design System

### Color Palette
```css
Primary:    #2563EB (Blue)
Success:    #10B981 (Green)
Warning:    #F59E0B (Orange)
Danger:     #EF4444 (Red)
Purple:     #8B5CF6 (Individual assignments)
Gray-50:    #F9FAFB
Gray-200:   #E5E7EB
Gray-600:   #4B5563
Gray-900:   #1F2937
```

### Components Used
- **Icons**: Lucide React
- **Charts**: Recharts
- **Gradients**: Tailwind CSS gradients
- **Cards**: Glassmorphism with `backdrop-blur`
- **Badges**: Rounded with type-based colors
- **Progress Bars**: Gradient fills based on completion %

---

## 📊 Mock Data Structure

### Assignment Interface
```typescript
interface Assignment {
  id: string;
  examTitle: string;
  targetType: "class" | "student";
  targetName: string;
  deadline: Date;
  maxAttempts: number;
  completionRate: number;
  isOverdue: boolean;
  totalStudents: number;
  completedStudents: number;
}
```

### Student Interface
```typescript
interface Student {
  id: string;
  name: string;
  phone: string;
  status: "completed" | "not-started";
  score?: number;
  submittedAt?: Date;
  attemptNumber?: number;
  isGraded?: boolean;
}
```

---

## ✨ Key Features

### Smart Filtering
- Real-time search across exam title and target name
- Dropdown filters for exam type and target type
- Combined filter logic

### Visual Indicators
- **Progress bars**: Color-coded by completion rate
  - Green: ≥75%
  - Blue: 50-74%
  - Orange: <50%
- **Countdown timers**: Dynamic deadline calculations
- **Overdue badges**: Red with alert icon
- **Type badges**: Green for class, Purple for student

### Interactive Elements
- Hover effects on all cards and buttons
- Scale animations on icons
- Smooth transitions (200-300ms)
- Glassmorphism backgrounds
- Shadow effects on hover

### Responsive Design
- Mobile-first approach
- Grid layouts: 1 → 2 → 4 columns
- Responsive tables
- Stacked layouts on mobile

---

## 🚀 Future Enhancements (To be implemented)

1. **CreateAssignment Modal**
   - 3-step wizard
   - Exam selection
   - Target type (class/student)
   - Settings (deadline, max attempts, public toggle)

2. **BulkAssignment Modal**
   - Multi-select with tabs
   - Class and student checkboxes
   - Selected targets chips
   - Bulk settings

3. **ReminderModal Component**
   - Confirmation dialog
   - Assignment summary
   - Send reminder action

4. **EmptyState Component**
   - Reusable empty state
   - Custom illustrations
   - Call-to-action buttons

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px  (1 column)
Tablet:  768px+   (2 columns)
Desktop: 1024px+  (4 columns, full layout)
```

---

## 🎯 User Flows

### Create Assignment Flow
1. Click "Giao bài mới"
2. Select exam from dropdown
3. Choose target type (class/student)
4. Select target from list
5. Set deadline and max attempts
6. Submit → Shows in main list

### Track Progress Flow
1. Click "Xem tiến độ" on assignment
2. View completion stats
3. See completed vs not-completed students
4. Send individual or bulk reminders
5. Click "Xem chi tiết" to see student submission

### View Statistics Flow
1. Navigate to "Thống kê"
2. View overview cards with trends
3. Analyze charts
4. Check recent assignments
5. Use quick actions to navigate

---

## 💡 Best Practices

✅ **Performance:**
- Mock data for development
- Efficient filtering algorithms
- Memoized calculations where needed

✅ **UX:**
- Clear visual hierarchy
- Consistent spacing (8px grid)
- Meaningful icons
- Helpful tooltips
- Empty states

✅ **Accessibility:**
- Semantic HTML
- ARIA labels on buttons
- Keyboard navigation support
- Color contrast compliance

✅ **Code Quality:**
- TypeScript for type safety
- Reusable components
- Clean component structure
- Consistent naming conventions

---

## 🔧 Dependencies

```json
{
  "react-router": "^7.x",
  "lucide-react": "latest",
  "recharts": "^2.x",
  "tailwindcss": "^4.x"
}
```

---

## 📝 Notes

- All times are formatted using Vietnamese locale (`vi-VN`)
- Dates use `toLocaleDateString()` and `toLocaleString()`
- Progress percentages are rounded to whole numbers
- Countdown timers calculate remaining days/hours dynamically
- Mock data includes 4 sample assignments with varied states

---

**Built with ❤️ for NamThu Education Platform**
