# 🎨 FIGMA PROMPT 4/6 - EXAMS & CLASSES PAGES

## 📝 EXAMS PAGE

### Header
```
┌─────────────────────────────────────────────────┐
│ My Exams                                        │
│ [+ Create New] [📥 Import] [🎓 Use Template]   │
│                                                 │
│ [All] [VSTEP] [IELTS] [Cambridge] [Custom]    │
│ [🔍 Search exams...]                           │
└─────────────────────────────────────────────────┘

Title: Inter Bold, 32px
Buttons: 40px height, inline
Filters: Tabs style
Search: Full width
```

---

## 📋 EXAMS TABLE

```
┌──────────────────────────────────────────────────────────────┐
│ Title              │ Type    │ Questions │ Duration │ Actions│
├──────────────────────────────────────────────────────────────┤
│ 🎓 Starters Test   │ STARTERS│    54     │ 45 min   │ [⋮]   │
│ 📝 IELTS Reading   │ IELTS   │    40     │ 60 min   │ [⋮]   │
│ 🎯 VSTEP Listening │ VSTEP   │    35     │ 40 min   │ [⋮]   │
│ 📚 TOEIC Practice  │ TOEIC   │    100    │ 120 min  │ [⋮]   │
└──────────────────────────────────────────────────────────────┘

Table Style:
- Header: Gray 50 background, Inter Medium, 14px
- Rows: 56px height, hover Gray 50
- Borders: 1px solid Gray 200
- Icons: 20px
- Type badges: Colored (Cambridge colors)
```

### Actions Menu (⋮)
```
┌─────────────────────┐
│ 👁️ View Details     │
│ ✏️ Edit             │
│ 📋 Duplicate        │
│ 📤 Assign to Class  │
│ 🗑️ Delete          │
└─────────────────────┘

Width: 200px
Padding: 8px
Item height: 40px
Hover: Gray 100
Icons: 16px
```

---

## 📄 EXAM DETAIL VIEW

```
┌─────────────────────────────────────────────┐
│ ← Back to Exams                             │
│                                             │
│ 🎓 Cambridge Starters Practice Test         │
│ STARTERS • 54 questions • 45 minutes        │
│                                             │
│ [Overview] [Questions] [Statistics]         │
│ ─────────                                   │
│                                             │
│ Description:                                │
│ Practice test for young learners based on   │
│ Cambridge Starters format...                │
│                                             │
│ Test Structure:                             │
│ ├─ Listening (20 min) - 20 questions       │
│ ├─ Reading & Writing (20 min) - 25 qs     │
│ └─ Speaking (5 min) - 9 questions          │
│                                             │
│ Created: March 18, 2026                     │
│ Last Modified: March 18, 2026               │
│                                             │
│ [Edit Exam] [Assign to Class] [Delete]     │
└─────────────────────────────────────────────┘

Tabs: 44px height, underline active
Content: Padding 32px
Buttons: Bottom right, inline
```

### Questions Tab
```
┌─────────────────────────────────────────────┐
│ Section: Listening - Part 1                 │
│ [+ Add Question]                            │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ Q1. Listen and draw lines           │   │
│ │ [🔊 Audio player]                   │   │
│ │                                     │   │
│ │ Type: Matching Lines                │   │
│ │ Points: 1                           │   │
│ │                                     │   │
│ │ [Edit] [Delete]                     │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ Q2. Listen and draw lines           │   │
│ │ ...                                 │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ [Save Changes]                              │
└─────────────────────────────────────────────┘

Question cards: White, border, 16px padding
Audio player: Custom design, Blue accent
```

---

## 🏫 CLASSES PAGE

### Class Cards Grid (3 columns)
```
┌─────────────────────────────────┐
│ 🏫 Morning IELTS Class          │
│                                 │
│ 👥 24 students                  │
│ 📚 Course: IELTS 6.5            │
│ 📅 Mon, Wed, Fri                │
│ 🕐 8:00-10:00 AM                │
│                                 │
│ Progress:                       │
│ ████████░░ 80%                  │
│                                 │
│ [View Details] [Manage]         │
└─────────────────────────────────┘

Width: 33.33%
Height: 280px
Padding: 24px
Background: White
Border: 1px solid Gray 200
Border Radius: 12px

Progress bar: 8px height, Blue fill
Icons: 20px with text
Buttons: Full width, stacked
```

---

## 📊 CLASS DETAIL VIEW

```
┌─────────────────────────────────────────────┐
│ ← Back to Classes                           │
│                                             │
│ 🏫 Morning IELTS Class                      │
│ 24 students • IELTS 6.5 • Mon, Wed, Fri    │
│                                             │
│ [+ Add Student] [📤 Assign Test] [✏️ Edit] │
│                                             │
│ [Students] [Assignments] [Performance]      │
│ ─────────                                   │
│                                             │
│ Students List:                              │
│ ┌─────────────────────────────────────┐   │
│ │ 👤 Nguyễn Văn A                     │   │
│ │ Progress: ████████░░ 75%            │   │
│ │ Last active: 2 hours ago            │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 👤 Trần Thị B                       │   │
│ │ Progress: ███████░░░ 60%            │   │
│ │ Last active: 1 day ago              │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Student cards: 16px padding, hover effect
Avatar: 40px circular
Progress: 6px height bar
```

### Assignments Tab
```
┌─────────────────────────────────────────────┐
│ Active Assignments:                         │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📝 IELTS Reading Practice           │   │
│ │ Deadline: March 25, 2026            │   │
│ │ Submissions: 18/24 (75%)            │   │
│ │ [View Submissions]                  │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📝 Listening Test                   │   │
│ │ Deadline: March 30, 2026            │   │
│ │ Submissions: 12/24 (50%)            │   │
│ │ [View Submissions]                  │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Assignment cards: White, border
Progress indicator: Colored based on %
```

### Performance Tab
```
┌─────────────────────────────────────────────┐
│ Class Performance Overview                  │
│                                             │
│ Average Score: 78%                          │
│ [Line Chart - Score over time]             │
│                                             │
│ Top Performers:                             │
│ 1. 👤 Nguyễn Văn A - 92%                   │
│ 2. 👤 Trần Thị B - 88%                     │
│ 3. 👤 Lê Văn C - 85%                       │
│                                             │
│ Needs Attention:                            │
│ • 👤 Phạm Thị D - 45%                      │
│ • 👤 Hoàng Văn E - 52%                     │
└─────────────────────────────────────────────┘

Chart: 300px height, Blue line
Lists: 16px padding per item
```

---

## 📱 RESPONSIVE BEHAVIOR

### Desktop
```
- Table: Full width, all columns
- Class cards: 3 columns
- Detail view: Sidebar + content
```

### Tablet
```
- Table: Horizontal scroll
- Class cards: 2 columns
- Detail view: Full width, tabs
```

### Mobile
```
- Table: Card view (stack)
- Class cards: 1 column
- Detail view: Full screen
- Bottom navigation
```

---

**Next**: PROMPT 5 - Students, Assignments & Grading