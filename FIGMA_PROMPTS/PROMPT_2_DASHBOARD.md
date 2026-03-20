# 🎨 FIGMA PROMPT 2/6 - DASHBOARD & NAVIGATION

## 🏠 DASHBOARD LAYOUT

### Overall Structure
```
┌─────────────────────────────────────────────────┐
│ [Sidebar 280px] │ [Main Content Area]          │
│                 │                               │
│ Logo & Brand    │ Header Bar                    │
│ User Profile    │ Breadcrumb + Actions          │
│ Navigation      │                               │
│                 │ Stats Cards (4 columns)       │
│                 │ ┌────┬────┬────┬────┐        │
│                 │ │ 📚 │ 🏫 │ 👥 │ 📝 │        │
│                 │ └────┴────┴────┴────┘        │
│                 │                               │
│                 │ Content Area                  │
└─────────────────────────────────────────────────┘
```

---

## 📂 SIDEBAR (280px width)

### Logo Section (Top)
```
┌─────────────────────────┐
│                         │
│   📚 NamThu Education   │
│                         │
└─────────────────────────┘
Height: 80px
Logo: 40px
Text: Inter Bold, 18px
```

### User Profile Section
```
┌─────────────────────────┐
│  👤                     │
│  Nguyễn Văn Thuần       │
│  🎓 Teacher             │
└─────────────────────────┘
Avatar: 48px circular
Name: Inter Medium, 14px
Role: Inter Regular, 12px, Gray 500
Background: Gray 50
Padding: 16px
Border Radius: 8px
```

### Navigation Menu
```
📊 Dashboard          ← Active (Blue bg, white text)
📚 Courses
🏫 Classes
👥 Students
📝 Exams
🎓 Cambridge Templates ⭐ NEW badge
📋 Assignments
📈 Grading
✍️ Blog Posts
⚙️ Settings
─────────────────
🚪 Logout

Each Item:
- Height: 44px
- Padding: 12px 16px
- Icon: 20px
- Text: Inter Medium, 14px
- Hover: Gray 100 background
- Active: Blue background, white text
- Border Radius: 8px
```

---

## 📊 HEADER BAR

```
┌─────────────────────────────────────────────────┐
│ Dashboard > Home    [+ New] [🔔 3] [👤 Profile]│
└─────────────────────────────────────────────────┘

Components:
- Breadcrumb: Inter Regular, 14px, Gray 500
- New Button: Primary button, 40px height
- Notifications: Icon with badge (red dot)
- Profile: Avatar 32px + dropdown arrow
```

---

## 📈 STATS CARDS (4 columns)

### Card Structure
```
┌─────────────────────┐
│ 📚                  │
│ Courses             │
│ 12                  │
│ +2 this month       │
└─────────────────────┘

Width: 25% (4 columns)
Height: 120px
Padding: 20px
Background: White
Border: 1px solid Gray 200
Border Radius: 12px
Shadow: Small

Icon: 32px, Blue background circle
Title: Inter Medium, 14px, Gray 600
Number: Inter Bold, 32px, Gray 900
Change: Inter Regular, 12px, Green (positive)
```

### 4 Stats Cards
```
1. 📚 Courses: 12 (+2 this month)
2. 🏫 Classes: 8 (+1 this month)
3. 👥 Students: 156 (+12 this month)
4. 📝 Exams: 45 (+5 this month)
```

---

## 📋 RECENT ACTIVITY SECTION

```
┌─────────────────────────────────────────────┐
│ Recent Activity                             │
│                                             │
│ ○─ Created "IELTS Reading Test"            │
│ │  2 hours ago                              │
│ │                                           │
│ ○─ Assigned test to "Morning Class"        │
│ │  5 hours ago                              │
│ │                                           │
│ ○─ Graded 12 submissions                    │
│    Yesterday                                │
└─────────────────────────────────────────────┘

Timeline Style:
- Vertical line: 2px, Gray 300
- Dots: 12px, Blue
- Text: Inter Regular, 14px
- Time: Inter Regular, 12px, Gray 500
```

---

## 📊 QUICK STATS CHARTS

### Student Performance Chart
```
┌─────────────────────────────────────────────┐
│ Student Performance                         │
│                                             │
│ [Line Chart]                                │
│ - X axis: Months                            │
│ - Y axis: Average Score                     │
│ - Line: Blue gradient                       │
│                                             │
└─────────────────────────────────────────────┘
Height: 300px
Chart library: Use Figma chart plugin
```

### Test Completion Rate
```
┌─────────────────────────────────────────────┐
│ Test Completion Rate                        │
│                                             │
│     [Donut Chart]                           │
│        85%                                  │
│                                             │
│ ● Completed: 85%                            │
│ ● Pending: 15%                              │
└─────────────────────────────────────────────┘
Size: 200px
Colors: Blue (completed), Gray (pending)
```

---

## 📱 RESPONSIVE DASHBOARD

### Desktop (1440px+)
```
- Sidebar: 280px visible
- Stats: 4 columns
- Charts: 2 columns side by side
```

### Tablet (768-1023px)
```
- Sidebar: Collapsible overlay
- Stats: 2×2 grid
- Charts: Stack vertically
```

### Mobile (<768px)
```
- Bottom navigation
- Stats: Stack vertically
- Charts: Full width, scrollable
```

---

## 🎯 INTERACTION STATES

### Hover States
```
Cards: Lift 2px, add shadow
Buttons: Darken 10%
Menu items: Gray 100 background
```

### Active States
```
Menu item: Blue background, white text
Button: Pressed effect (scale 0.98)
```

### Loading States
```
Skeleton screens for cards
Shimmer animation
Gray 200 background
```

---

**Next**: PROMPT 3 - Cambridge Templates Page