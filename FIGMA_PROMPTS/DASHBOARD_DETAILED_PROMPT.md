# 🎨 FIGMA PROMPT - TEACHER DASHBOARD (Chi Tiết)

## 📋 TỔNG QUAN TRANG DASHBOARD

**Mục đích**: Trang chủ cho giáo viên, hiển thị tổng quan hoạt động, thống kê, và truy cập nhanh các chức năng chính.

**Người dùng**: Giáo viên tiếng Anh (25-50 tuổi)

**Kích thước thiết kế**: Desktop 1440px × 900px

---

## 🎨 LAYOUT TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)    │ MAIN CONTENT AREA (1160px)                │
│                    │                                            │
│ [Logo]             │ HEADER BAR (80px height)                   │
│ [User Profile]     │ Dashboard > Home  [+ New] [🔔] [👤]       │
│                    │                                            │
│ Navigation Menu    │ STATS CARDS SECTION (140px height)         │
│ • Dashboard        │ ┌────┬────┬────┬────┐                     │
│ • Courses          │ │ 📚 │ 🏫 │ 👥 │ 📝 │                     │
│ • Classes          │ └────┴────┴────┴────┘                     │
│ • Students         │                                            │
│ • Exams            │ CONTENT GRID (2 columns)                   │
│ • Cambridge ⭐     │ ┌──────────────┬──────────────┐           │
│ • Assignments      │ │ Recent       │ Quick        │           │
│ • Grading          │ │ Activity     │ Actions      │           │
│ • Blog             │ │              │              │           │
│ • Settings         │ ├──────────────┴──────────────┤           │
│                    │ │ Student Performance Chart   │           │
│ [Logout]           │ └─────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 1. SIDEBAR (280px width)

### A. Logo Section (Top)
```
┌─────────────────────────────────┐
│                                 │
│     📚 NamThu Education         │
│                                 │
└─────────────────────────────────┘

Kích thước: 280px × 80px
Background: White (#FFFFFF)
Logo icon: 40px × 40px
Text: Inter Bold, 18px, #1F2937
Alignment: Center
Border bottom: 1px solid #E5E7EB
```

### B. User Profile Card
```
┌─────────────────────────────────┐
│  ┌────┐                         │
│  │ 👤 │  Nguyễn Văn Thuần       │
│  └────┘  🎓 Teacher             │
│          thuan@namthuedu.com    │
└─────────────────────────────────┘

Position: Below logo, 16px margin
Size: 248px × 96px (16px margin each side)
Background: Linear gradient #F3F4F6 to #E5E7EB
Border radius: 12px
Padding: 16px

Avatar:
- Size: 56px × 56px
- Border radius: 50% (circular)
- Border: 2px solid white
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

Name:
- Font: Inter SemiBold, 15px
- Color: #111827
- Margin bottom: 4px

Role:
- Font: Inter Regular, 13px
- Color: #6B7280
- Icon: 16px before text

Email:
- Font: Inter Regular, 12px
- Color: #9CA3AF
- Margin top: 4px
```

### C. Navigation Menu
```
┌─────────────────────────────────┐
│ 📊 Dashboard                    │ ← Active
│ 📚 Courses                      │
│ 🏫 Classes                      │
│ 👥 Students                     │
│ 📝 Exams                        │
│ 🎓 Cambridge Templates ⭐ NEW   │
│ 📋 Assignments                  │
│ 📈 Grading                      │
│ ✍️ Blog Posts                   │
│ ⚙️ Settings                     │
│ ─────────────────────────       │
│ 🚪 Logout                       │
└─────────────────────────────────┘

Position: Below profile, 16px margin top
Width: 248px (16px margin each side)

Each Menu Item:
- Height: 44px
- Padding: 12px 16px
- Border radius: 8px
- Margin bottom: 4px
- Transition: all 200ms ease

Icon:
- Size: 20px × 20px
- Margin right: 12px
- Color: #6B7280 (inactive), #FFFFFF (active)

Text:
- Font: Inter Medium, 14px
- Color: #374151 (inactive), #FFFFFF (active)

States:
1. Default (Inactive):
   - Background: Transparent
   - Text: #374151
   - Icon: #6B7280

2. Hover:
   - Background: #F3F4F6
   - Text: #1F2937
   - Icon: #374151
   - Cursor: pointer

3. Active (Dashboard):
   - Background: Linear gradient #2563EB to #1D4ED8
   - Text: #FFFFFF
   - Icon: #FFFFFF
   - Shadow: 0 2px 4px rgba(37,99,235,0.2)

NEW Badge (Cambridge):
- Background: #EF4444
- Color: White
- Font: Inter Bold, 10px
- Padding: 2px 6px
- Border radius: 4px
- Position: Absolute right
- Animation: Pulse (subtle)

Divider:
- Height: 1px
- Background: #E5E7EB
- Margin: 8px 0

Logout:
- Color: #EF4444 (red)
- Icon: #EF4444
- Hover background: #FEE2E2
```

---

## 🎨 2. HEADER BAR (1160px width, 80px height)

```
┌──────────────────────────────────────────────────────────────┐
│ Dashboard > Home          [+ New Test] [🔔 3] [👤 Profile ▾]│
└──────────────────────────────────────────────────────────────┘

Background: White
Border bottom: 1px solid #E5E7EB
Padding: 0 32px
Display: Flex, space-between, align-center

Left Side - Breadcrumb:
- Font: Inter Regular, 14px
- Color: #6B7280
- "Dashboard" bold, #1F2937
- Separator: ">" margin 0 8px

Right Side - Actions:
1. New Test Button:
   - Background: #2563EB
   - Color: White
   - Font: Inter Medium, 14px
   - Height: 40px
   - Padding: 0 20px
   - Border radius: 8px
   - Icon: "+" 16px, margin right 8px
   - Shadow: 0 1px 2px rgba(0,0,0,0.05)
   - Hover: Background #1D4ED8

2. Notification Bell:
   - Icon: 🔔 24px
   - Color: #6B7280
   - Size: 40px × 40px
   - Border radius: 8px
   - Hover: Background #F3F4F6
   - Badge: 
     * Size: 18px × 18px
     * Background: #EF4444
     * Color: White
     * Font: Inter Bold, 11px
     * Position: Top right corner
     * Border: 2px solid white

3. Profile Dropdown:
   - Avatar: 32px circular
   - Name: "Profile" Inter Medium, 14px
   - Arrow: ▾ 12px
   - Padding: 6px 12px 6px 6px
   - Border radius: 20px
   - Hover: Background #F3F4F6
```

---

## 🎨 3. STATS CARDS SECTION (4 cards)

```
┌────────────┬────────────┬────────────┬────────────┐
│ 📚 Courses │ 🏫 Classes │ 👥 Students│ 📝 Exams   │
│ 12         │ 8          │ 156        │ 45         │
│ +2 month   │ +1 month   │ +12 month  │ +5 month   │
└────────────┴────────────┴────────────┴────────────┘

Container:
- Width: 1096px (32px margin each side)
- Height: 140px
- Display: Grid, 4 columns
- Gap: 24px
- Margin bottom: 32px
```

### Card Structure (Each card)
```
┌─────────────────────────────┐
│ ┌────┐                      │
│ │ 📚 │  Courses              │
│ └────┘                      │
│                             │
│ 12                          │
│ +2 this month ↗             │
└─────────────────────────────┘

Size: 262px × 140px
Background: White
Border: 1px solid #E5E7EB
Border radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Icon Container:
- Size: 48px × 48px
- Border radius: 12px
- Background: Linear gradient
  * Courses: #DBEAFE to #BFDBFE
  * Classes: #D1FAE5 to #A7F3D0
  * Students: #FEF3C7 to #FDE68A
  * Exams: #E0E7FF to #C7D2FE
- Icon: 24px, centered
- Margin bottom: 16px

Title:
- Font: Inter Medium, 14px
- Color: #6B7280
- Position: Absolute top right
- Margin: 24px

Number:
- Font: Inter Bold, 36px
- Color: #111827
- Line height: 1
- Margin bottom: 8px

Change Indicator:
- Font: Inter Regular, 13px
- Color: #10B981 (positive), #EF4444 (negative)
- Icon: ↗ or ↘ 14px
- Display: Inline with text

Hover Effect:
- Transform: translateY(-4px)
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Transition: all 300ms ease
- Border color: #2563EB
```

---

## 🎨 4. CONTENT GRID (2 columns)

### Layout
```
┌──────────────────────┬──────────────────────┐
│ Recent Activity      │ Quick Actions        │
│ (60% width)          │ (40% width)          │
│                      │                      │
├──────────────────────┴──────────────────────┤
│ Student Performance Chart                   │
│ (Full width)                                │
└─────────────────────────────────────────────┘

Container: 1096px width, 32px margin
Gap: 24px between columns
```

---

## 🎨 5. RECENT ACTIVITY CARD

```
┌─────────────────────────────────────────┐
│ Recent Activity              [View All] │
│                                         │
│ ○───┐                                   │
│     │ Created "IELTS Reading Test"     │
│     │ 2 hours ago                       │
│     │                                   │
│ ○───┤                                   │
│     │ Assigned test to "Morning Class" │
│     │ 5 hours ago                       │
│     │                                   │
│ ○───┤                                   │
│     │ Graded 12 submissions            │
│     │ Yesterday                         │
│     │                                   │
│ ○───┘                                   │
│     No more activities                  │
└─────────────────────────────────────────┘

Size: 640px × 400px
Background: White
Border: 1px solid #E5E7EB
Border radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Header:
- Title: Inter SemiBold, 18px, #1F2937
- View All: Inter Medium, 14px, #2563EB
- Display: Flex, space-between

Timeline:
- Vertical line: 2px solid #E5E7EB
- Position: Left 6px
- Height: Connect all dots

Timeline Dot:
- Size: 14px × 14px
- Border: 3px solid #2563EB
- Background: White
- Border radius: 50%
- Position: Relative to line

Activity Item:
- Padding left: 32px
- Margin bottom: 24px

Activity Text:
- Font: Inter Medium, 14px
- Color: #1F2937
- Line height: 1.5

Time Text:
- Font: Inter Regular, 12px
- Color: #9CA3AF
- Margin top: 4px

Empty State:
- Text: "No more activities"
- Font: Inter Regular, 13px
- Color: #D1D5DB
- Text align: center
- Padding: 16px
```

---

## 🎨 6. QUICK ACTIONS CARD

```
┌─────────────────────────────────┐
│ Quick Actions                   │
│                                 │
│ ┌─────────────────────────────┐│
│ │ 📝 Create New Exam          ││
│ │ Build custom test           ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ 🎓 Use Cambridge Template   ││
│ │ Quick professional tests    ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ 📤 Assign Test              ││
│ │ Send to students            ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ 📊 View Reports             ││
│ │ Check performance           ││
│ └─────────────────────────────┘│
└─────────────────────────────────┘

Size: 432px × 400px
Background: White
Border: 1px solid #E5E7EB
Border radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Header:
- Title: Inter SemiBold, 18px, #1F2937
- Margin bottom: 20px

Action Button (Each):
- Width: 100%
- Height: 72px
- Background: #F9FAFB
- Border: 1px solid #E5E7EB
- Border radius: 10px
- Padding: 16px
- Margin bottom: 12px
- Display: Flex, align-center
- Cursor: pointer
- Transition: all 200ms ease

Icon:
- Size: 32px × 32px
- Margin right: 16px
- Background: White
- Border radius: 8px
- Padding: 6px
- Shadow: 0 1px 2px rgba(0,0,0,0.05)

Text Container:
- Display: Flex column

Title:
- Font: Inter SemiBold, 15px
- Color: #1F2937
- Margin bottom: 4px

Description:
- Font: Inter Regular, 13px
- Color: #6B7280

Hover State:
- Background: #F3F4F6
- Border color: #2563EB
- Transform: translateX(4px)
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

Special Highlight (Cambridge):
- Border: 2px solid #10B981
- Background: Linear gradient #F0FDF4 to #DCFCE7
- Icon background: #10B981
- Icon color: White
```

---

## 🎨 7. STUDENT PERFORMANCE CHART

```
┌─────────────────────────────────────────────────────────────┐
│ Student Performance Overview                    [This Month]│
│                                                             │
│ Average Score: 78%                                          │
│                                                             │
│ 100% ┤                                                      │
│  90% ┤                    ●────●                            │
│  80% ┤          ●────●                                      │
│  70% ┤    ●────●                                            │
│  60% ┤                                                      │
│  50% ┤                                                      │
│      └────┬────┬────┬────┬────┬────┬────┬────              │
│         Week1 Week2 Week3 Week4                             │
│                                                             │
│ ● Average Score    ● Listening    ● Reading    ● Writing   │
└─────────────────────────────────────────────────────────────┘

Size: 1096px × 360px
Background: White
Border: 1px solid #E5E7EB
Border radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Margin top: 24px

Header:
- Title: Inter SemiBold, 18px, #1F2937
- Filter: Dropdown "This Month"
- Display: Flex, space-between

Average Score:
- Font: Inter Bold, 32px
- Color: #2563EB
- Margin bottom: 24px

Chart Area:
- Height: 220px
- Background: Linear gradient #F9FAFB to transparent
- Border radius: 8px
- Padding: 16px

Line Chart:
- Line width: 3px
- Line color: #2563EB
- Smooth curves (bezier)
- Data points: 8px circles
- Grid lines: 1px dashed #E5E7EB

X-Axis:
- Labels: Inter Regular, 12px, #9CA3AF
- Spacing: Equal distribution

Y-Axis:
- Labels: Inter Regular, 12px, #9CA3AF
- Range: 0-100%
- Intervals: 10%

Legend:
- Position: Bottom center
- Font: Inter Medium, 13px
- Color dots: 8px circles
- Spacing: 24px between items
- Colors:
  * Average: #2563EB
  * Listening: #10B981
  * Reading: #F59E0B
  * Writing: #8B5CF6

Hover Tooltip:
- Background: #1F2937
- Color: White
- Font: Inter Medium, 12px
- Padding: 8px 12px
- Border radius: 6px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Arrow pointing to data point
```

---

## 🎨 8. RESPONSIVE BEHAVIOR

### Desktop (1440px)
```
- Sidebar: 280px visible
- Stats: 4 columns
- Content: 2 columns (60/40)
- Chart: Full width
```

### Laptop (1024px)
```
- Sidebar: 240px visible
- Stats: 2×2 grid
- Content: Stack vertically
- Chart: Full width
```

### Tablet (768px)
```
- Sidebar: Collapsible overlay
- Stats: 2 columns
- Content: Stack vertically
- Chart: Scrollable horizontal
```

---

## 🎨 9. ANIMATIONS & TRANSITIONS

### Page Load
```
1. Sidebar: Slide in from left (300ms)
2. Stats cards: Fade in + slide up (400ms, stagger 100ms)
3. Content cards: Fade in (500ms)
4. Chart: Draw animation (800ms)
```

### Hover Effects
```
- Cards: Transform translateY(-4px) 200ms ease
- Buttons: Background color 150ms ease
- Menu items: Background color 200ms ease
```

### Click Effects
```
- Buttons: Scale(0.98) 100ms
- Cards: Ripple effect from click point
```

---

## 🎨 10. COLOR CODING

### Stats Cards
```
Courses: Blue (#2563EB)
Classes: Green (#10B981)
Students: Yellow (#F59E0B)
Exams: Purple (#8B5CF6)
```

### Status Colors
```
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Info: #2563EB
```

---

## ✅ CHECKLIST THIẾT KẾ

- [ ] Logo và branding rõ ràng
- [ ] User profile hiển thị đầy đủ thông tin
- [ ] Navigation menu có active state
- [ ] Stats cards có số liệu và trend
- [ ] Recent activity có timeline
- [ ] Quick actions dễ truy cập
- [ ] Chart hiển thị data rõ ràng
- [ ] Hover effects mượt mà
- [ ] Color coding nhất quán
- [ ] Spacing theo grid 4px
- [ ] Typography hierarchy rõ ràng
- [ ] Responsive cho các breakpoints

---

**🎯 Sử dụng prompt này để tạo trang Dashboard hoàn chỉnh trong Figma!**
