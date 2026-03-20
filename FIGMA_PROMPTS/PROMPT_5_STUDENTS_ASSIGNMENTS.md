# 🎨 FIGMA PROMPT 5/6 - STUDENTS, ASSIGNMENTS & GRADING

## 👥 STUDENTS PAGE

### Header
```
┌─────────────────────────────────────────────────┐
│ Students Management                             │
│ [+ Add Student] [📥 Import CSV] [📤 Export]    │
│                                                 │
│ [All] [Active] [Inactive] [By Class]          │
│ [🔍 Search students...]                        │
└─────────────────────────────────────────────────┘

Title: Inter Bold, 32px
Buttons: 40px height, inline
Filters: Tabs style
Search: Full width, 44px height
```

---

## 📋 STUDENTS TABLE

```
┌────────────────────────────────────────────────────────────────────┐
│ Name           │ Email          │ Class      │ Progress │ Actions │
├────────────────────────────────────────────────────────────────────┤
│ 👤 Nguyễn Văn A│ vana@email.com │ IELTS 6.5  │ ████░ 75%│ [⋮]    │
│ 👤 Trần Thị B  │ thib@email.com │ Morning    │ ███░░ 60%│ [⋮]    │
│ 👤 Lê Văn C    │ vanc@email.com │ TOEIC 700  │ █████ 90%│ [⋮]    │
│ 👤 Phạm Thị D  │ thid@email.com │ Starters   │ ██░░░ 45%│ [⋮]    │
└────────────────────────────────────────────────────────────────────┘

Table Style:
- Header: Gray 50 background, Inter Medium, 14px
- Rows: 64px height, hover Gray 50
- Avatar: 40px circular
- Progress bar: 100px width, 8px height
- Colors: Green (>80%), Blue (60-80%), Orange (<60%)
```

### Actions Menu (⋮)
```
┌─────────────────────┐
│ 👁️ View Profile     │
│ ✏️ Edit Info        │
│ 📊 View Progress    │
│ 📤 Assign Test      │
│ 🔄 Reset Password   │
│ 🗑️ Remove          │
└─────────────────────┘

Width: 200px
Padding: 8px
Item height: 40px
Hover: Gray 100
Icons: 16px
```

---

## 📄 STUDENT DETAIL VIEW

```
┌─────────────────────────────────────────────┐
│ ← Back to Students                          │
│                                             │
│ 👤 Nguyễn Văn A                             │
│ vana@email.com • Student ID: ST2026001     │
│                                             │
│ [Overview] [Performance] [Assignments]      │
│ ─────────                                   │
│                                             │
│ Personal Information:                       │
│ ┌─────────────────────────────────────┐   │
│ │ Full Name: Nguyễn Văn A             │   │
│ │ Email: vana@email.com               │   │
│ │ Phone: +84 123 456 789              │   │
│ │ Date of Birth: 15/05/2005           │   │
│ │ Enrolled: March 1, 2026             │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Classes Enrolled:                           │
│ • IELTS 6.5 - Morning Class                │
│ • TOEIC 700 - Evening Class                │
│                                             │
│ Overall Progress: ████████░░ 75%            │
│                                             │
│ [Edit Student] [Assign Test] [Remove]      │
└─────────────────────────────────────────────┘

Info card: White, border, 24px padding
Progress bar: 12px height, Blue fill
Buttons: Bottom right, inline
```

### Performance Tab
```
┌─────────────────────────────────────────────┐
│ Performance Overview                        │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ Average Score: 78%                  │   │
│ │ Tests Completed: 24/30              │   │
│ │ Attendance: 92%                     │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Score Trend:                                │
│ [Line Chart - Score over time]             │
│                                             │
│ Skills Breakdown:                           │
│ Listening:  ████████░░ 80%                 │
│ Reading:    ███████░░░ 75%                 │
│ Writing:    ██████░░░░ 65%                 │
│ Speaking:   ████████░░ 82%                 │
│                                             │
│ Recent Tests:                               │
│ • IELTS Reading - 85% (March 15)          │
│ • IELTS Listening - 78% (March 10)        │
│ • IELTS Writing - 72% (March 5)           │
└─────────────────────────────────────────────┘

Stats cards: 3 columns, 120px height
Chart: 300px height, Blue line
Skill bars: 12px height, gradient colors
```

---

## 📋 ASSIGNMENTS PAGE

### Header
```
┌─────────────────────────────────────────────────┐
│ Test Assignments                                │
│ [+ New Assignment]                              │
│                                                 │
│ [All] [Active] [Completed] [Overdue]          │
│ [🔍 Search assignments...]                     │
└─────────────────────────────────────────────────┘
```

---

## 📊 ASSIGNMENTS GRID (2 columns)

```
┌─────────────────────────────────────┐
│ 📝 IELTS Reading Practice           │
│                                     │
│ Class: Morning IELTS Class          │
│ Deadline: March 25, 2026 23:59     │
│                                     │
│ Submissions:                        │
│ ████████████████░░░░ 18/24 (75%)   │
│                                     │
│ Status: 🟢 Active                   │
│                                     │
│ [View Submissions] [Edit] [Delete] │
└─────────────────────────────────────┘

Width: 50% (2 columns)
Height: 240px
Padding: 24px
Background: White
Border: 1px solid Gray 200
Border Radius: 12px

Progress bar: 12px height
Status badge: 24px height, colored
Buttons: Full width, stacked
```

### Assignment Detail Modal
```
┌─────────────────────────────────────────────┐
│ ✕ Close                                     │
│                                             │
│ 📝 IELTS Reading Practice                   │
│ Morning IELTS Class • 24 students          │
│                                             │
│ Exam: IELTS Reading Test                   │
│ Deadline: March 25, 2026 23:59            │
│ Attempts Allowed: 1                         │
│                                             │
│ Submissions (18/24):                        │
│ ┌─────────────────────────────────────┐   │
│ │ ✅ Nguyễn Văn A - 85% (Graded)      │   │
│ │ ✅ Trần Thị B - 78% (Graded)        │   │
│ │ ⏳ Lê Văn C - Submitted (Pending)   │   │
│ │ ❌ Phạm Thị D - Not submitted       │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ [View All Submissions] [Send Reminder]     │
└─────────────────────────────────────────────┘

Width: 600px
Max Height: 80vh (scrollable)
Padding: 32px
Submission items: 48px height
Icons: 20px, colored by status
```

---

## 📈 GRADING PAGE

### Header
```
┌─────────────────────────────────────────────────┐
│ Grading Queue                                   │
│ 12 submissions pending review                   │
│                                                 │
│ [All] [Pending] [Graded] [Needs Review]       │
│ [🔍 Search submissions...]                     │
└─────────────────────────────────────────────────┘
```

---

## 📝 SUBMISSIONS LIST

```
┌─────────────────────────────────────────────────────────────────┐
│ Student        │ Test           │ Submitted    │ Status │ Action│
├─────────────────────────────────────────────────────────────────┤
│ 👤 Nguyễn Văn A│ IELTS Reading  │ 2 hours ago  │ ⏳ Pend│ [Grade]│
│ 👤 Trần Thị B  │ IELTS Writing  │ 5 hours ago  │ ⏳ Pend│ [Grade]│
│ 👤 Lê Văn C    │ TOEIC Test     │ Yesterday    │ ✅ Done│ [View] │
│ 👤 Phạm Thị D  │ Starters Test  │ 2 days ago   │ ⏳ Pend│ [Grade]│
└─────────────────────────────────────────────────────────────────┘

Table Style:
- Rows: 64px height
- Status badges: Colored (Pending=Orange, Done=Green)
- Grade button: Primary blue
- View button: Secondary gray
```

---

## 📊 GRADING INTERFACE

```
┌─────────────────────────────────────────────┐
│ ← Back to Queue                             │
│                                             │
│ Grading: IELTS Reading Practice             │
│ Student: Nguyễn Văn A                       │
│ Submitted: March 18, 2026 14:30           │
│                                             │
│ [Questions] [Answers] [Scoring]             │
│ ─────────                                   │
│                                             │
│ Auto-Graded Questions (30/40):              │
│ ┌─────────────────────────────────────┐   │
│ │ Q1. Multiple Choice - ✅ Correct    │   │
│ │ Q2. Fill Blank - ✅ Correct         │   │
│ │ Q3. Matching - ❌ Incorrect         │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Manual Grading Required (10/40):            │
│ ┌─────────────────────────────────────┐   │
│ │ Q31. Essay Writing                  │   │
│ │ [Student's essay text...]           │   │
│ │                                     │   │
│ │ Score: [__/10] points               │   │
│ │ Feedback:                           │   │
│ │ [Good vocabulary usage...]          │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Total Score: 75/100 (75%)                  │
│                                             │
│ Overall Feedback:                           │
│ [Great performance overall. Focus on...]   │
│                                             │
│ [Save Draft] [Submit Grade] 🔵             │
└─────────────────────────────────────────────┘

Question cards: White, border, 16px padding
Score input: 60px width, 44px height
Feedback textarea: 120px min height
Total score: Inter Bold, 24px, Blue
```

### Scoring Panel (Right Sidebar)
```
┌─────────────────────────┐
│ Scoring Summary         │
│                         │
│ Auto-Graded:            │
│ 30/40 questions         │
│ Score: 68/80 (85%)      │
│                         │
│ Manual Grading:         │
│ 10/40 questions         │
│ Score: [__/20]          │
│                         │
│ ─────────────────       │
│ Total: [__/100]         │
│                         │
│ Grade: [A/B/C/D/F]      │
│                         │
│ [Calculate Total]       │
└─────────────────────────┘

Width: 280px
Fixed position
Background: Gray 50
Padding: 24px
```

---

## 📱 RESPONSIVE BEHAVIOR

### Desktop (1440px+)
```
- Students table: Full width, all columns
- Assignments: 2 columns grid
- Grading: Main content + sidebar
```

### Laptop (1024-1439px)
```
- Students table: Horizontal scroll
- Assignments: 2 columns
- Grading: Full width, sidebar below
```

### Tablet (768-1023px)
```
- Students table: Card view
- Assignments: 1 column
- Grading: Stack vertically
```

### Mobile (<768px)
```
- Students: List view with avatars
- Assignments: Full width cards
- Grading: Single column, simplified
- Bottom navigation
```

---

## 🎯 INTERACTION STATES

### Hover States
```
Table rows: Gray 50 background
Cards: Lift 2px, add shadow
Buttons: Darken 10%
```

### Active States
```
Selected row: Blue 50 background
Active tab: Blue underline
Focused input: Blue border + shadow
```

### Loading States
```
Skeleton screens for tables
Shimmer animation on cards
Progress spinner for grading
```

---

## 🎨 SPECIAL COMPONENTS

### Progress Bar Component
```
Container: 100% width, 12px height
Background: Gray 200
Fill: Gradient (Green→Blue→Orange based on %)
Border Radius: 6px
Label: Inter Medium, 12px, right aligned
```

### Status Badge Component
```
Pending: Orange background, white text
Graded: Green background, white text
Overdue: Red background, white text
Draft: Gray background, white text

Height: 24px
Padding: 4px 12px
Border Radius: 12px
Font: Inter Medium, 12px
```

### Score Display Component
```
Large: Inter Bold, 32px, Blue
Medium: Inter SemiBold, 24px, Gray 900
Small: Inter Medium, 16px, Gray 700

With percentage: Add % symbol
With grade: Add letter grade (A/B/C/D/F)
Color coding: Green (>80%), Blue (60-80%), Orange (<60%)
```

---

**Next**: PROMPT 6 - Settings, Mobile Navigation & Final Checklist
