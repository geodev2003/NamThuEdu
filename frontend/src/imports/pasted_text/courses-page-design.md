# 🎨 FIGMA PROMPT - TRANG KHÓA HỌC (COURSES PAGE)

## 📋 TỔNG QUAN

**Trang**: Quản lý Khóa học (Courses Management)  
**Người dùng**: Giáo viên tiếng Anh  
**Chức năng**: Tạo, xem, sửa, xóa khóa học (IELTS, TOEIC, Cambridge, VSTEP, etc.)  
**APIs**: 5 endpoints (GET, POST, PUT, DELETE, GET by ID)  

---

## 🎨 LAYOUT TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)    │ MAIN CONTENT AREA (1160px)                │
│                    │                                            │
│ [Logo]             │ HEADER BAR                                 │
│ [User Profile]     │ Khóa học                    [+ Khóa mới]  │
│                    │ Trang này dùng quản lý khóa học            │
│ Navigation         │                                            │
│ • Dashboard        │ FILTERS & SEARCH                           │
│ • Courses ✓        │ [All] [IELTS] [TOEIC] [Cambridge]        │
│ • Classes          │ [🔍 Tìm kiếm khóa học...]                 │
│ • Students         │                                            │
│ • Exams            │ COURSES GRID (3 columns)                   │
│ • Cambridge        │ ┌────────┬────────┬────────┐              │
│ • Assignments      │ │ IELTS  │ TOEIC  │ Cambr. │              │
│ • Grading          │ │ 6.5    │ 700    │ KET    │              │
│ • Blog             │ └────────┴────────┴────────┘              │
│ • Settings         │ ┌────────┬────────┬────────┐              │
│                    │ │ VSTEP  │ IELTS  │ TOEIC  │              │
│ [Logout]           │ │ B2     │ 7.0    │ 850    │              │
│                    │ └────────┴────────┴────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 1. HEADER SECTION

```
┌──────────────────────────────────────────────────────────────┐
│ Khóa học                                    [+ Khóa học mới] │
│ Trang này dùng quản lý khóa học.                            │
└──────────────────────────────────────────────────────────────┘

Container:
- Width: 1096px (32px margin each side)
- Padding bottom: 24px
- Border bottom: 1px solid #E5E7EB

Title "Khóa học":
- Font: Inter Bold, 32px
- Color: #111827
- Line height: 1.2

Subtitle:
- Font: Inter Regular, 16px
- Color: #6B7280
- Margin top: 8px

Button "Khóa học mới":
- Position: Absolute top right
- Background: #2563EB
- Color: White
- Font: Inter Medium, 14px
- Height: 44px
- Padding: 0 24px
- Border radius: 8px
- Icon: "+" 18px, margin right 8px
- Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Hover: Background #1D4ED8, transform translateY(-1px)
```

---

## 🎨 2. FILTERS & SEARCH

```
┌──────────────────────────────────────────────────────────────┐
│ [All] [IELTS] [TOEIC] [Cambridge] [VSTEP] [Business]       │
│                                                              │
│ [🔍 Tìm kiếm khóa học theo tên, danh mục...]                │
└──────────────────────────────────────────────────────────────┘

Container:
- Width: 1096px
- Margin bottom: 32px
- Display: Flex column
- Gap: 16px

Filter Tabs:
- Display: Flex, gap 8px
- Margin bottom: 16px

Each Tab:
- Height: 40px
- Padding: 0 20px
- Border radius: 20px
- Font: Inter Medium, 14px
- Transition: all 200ms ease

Tab States:
1. Default (Inactive):
   - Background: #F3F4F6
   - Color: #6B7280
   - Border: 1px solid transparent

2. Hover:
   - Background: #E5E7EB
   - Color: #374151
   - Cursor: pointer

3. Active (All):
   - Background: #2563EB
   - Color: #FFFFFF
   - Shadow: 0 2px 4px rgba(37,99,235,0.2)

Search Bar:
- Width: 100%
- Height: 48px
- Background: White
- Border: 1px solid #D1D5DB
- Border radius: 10px
- Padding: 0 16px 0 48px
- Font: Inter Regular, 15px
- Transition: all 200ms ease

Search Icon:
- Size: 20px
- Color: #9CA3AF
- Position: Absolute left 16px

Search Focus State:
- Border: 2px solid #2563EB
- Shadow: 0 0 0 3px rgba(37,99,235,0.1)
- Outline: none
```

---

## 🎨 3. COURSES GRID (3 columns)

```
┌────────────┬────────────┬────────────┐
│ IELTS 6.5  │ TOEIC 700  │ Cambridge  │
│ 24 students│ 18 students│ KET        │
│ Mon,Wed,Fri│ Tue,Thu    │ 12 students│
└────────────┴────────────┴────────────┘
┌────────────┬────────────┬────────────┐
│ VSTEP B2   │ IELTS 7.0  │ TOEIC 850  │
│ 15 students│ 20 students│ 10 students│
│ Mon-Fri    │ Weekend    │ Evening    │
└────────────┴────────────┴────────────┘

Container:
- Width: 1096px
- Display: Grid, 3 columns
- Gap: 24px
- Grid template: repeat(3, 1fr)
```

---

## 🎨 4. COURSE CARD (Chi tiết)

```
┌─────────────────────────────────────┐
│ 🎓 IELTS                            │
│                                     │
│ IELTS 6.5 - Morning Class           │
│                                     │
│ 👥 24 students                      │
│ 📅 Mon, Wed, Fri                    │
│ 🕐 8:00 - 10:00 AM                  │
│ 📆 01/03/2026 - 30/06/2026          │
│                                     │
│ Progress:                           │
│ ████████░░ 75%                      │
│                                     │
│ Status: 🟢 Active                   │
│                                     │
│ [View Details] [Edit] [⋮]          │
└─────────────────────────────────────┘

Card Container:
- Width: 349px (auto from grid)
- Height: 380px
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Transition: all 300ms ease
- Cursor: pointer

Card Hover:
- Transform: translateY(-4px)
- Shadow: 0 8px 16px rgba(0,0,0,0.12)
- Border color: #2563EB

Category Badge (Top):
- Display: Inline-flex, align-center
- Background: Linear gradient based on type:
  * IELTS: #DBEAFE to #BFDBFE
  * TOEIC: #FEF3C7 to #FDE68A
  * Cambridge: #D1FAE5 to #A7F3D0
  * VSTEP: #E0E7FF to #C7D2FE
- Padding: 6px 12px
- Border radius: 6px
- Font: Inter SemiBold, 12px
- Color: Matching dark color
- Icon: 16px, margin right 6px
- Margin bottom: 16px

Course Title:
- Font: Inter Bold, 18px
- Color: #1F2937
- Line height: 1.3
- Margin bottom: 20px
- Max lines: 2
- Text overflow: ellipsis

Info Items (4 items):
- Display: Flex, align-center
- Gap: 8px
- Margin bottom: 12px
- Font: Inter Regular, 14px
- Color: #6B7280

Icon (for each info):
- Size: 18px
- Color: #9CA3AF
- Margin right: 8px

Progress Section:
- Margin top: 20px
- Margin bottom: 16px

Progress Label:
- Font: Inter Medium, 13px
- Color: #6B7280
- Margin bottom: 8px

Progress Bar:
- Width: 100%
- Height: 8px
- Background: #E5E7EB
- Border radius: 4px
- Overflow: hidden

Progress Fill:
- Height: 100%
- Background: Linear gradient #10B981 to #059669
- Border radius: 4px
- Width: Dynamic (75%)
- Transition: width 500ms ease

Progress Percentage:
- Font: Inter Bold, 14px
- Color: #10B981
- Position: Absolute right
- Margin top: -20px

Status Badge:
- Display: Inline-flex, align-center
- Height: 28px
- Padding: 0 12px
- Border radius: 14px
- Font: Inter Medium, 13px
- Gap: 6px
- Margin bottom: 16px

Status Colors:
1. Active:
   - Background: #D1FAE5
   - Color: #065F46
   - Dot: #10B981

2. Completed:
   - Background: #E0E7FF
   - Color: #3730A3
   - Dot: #6366F1

3. Upcoming:
   - Background: #FEF3C7
   - Color: #92400E
   - Dot: #F59E0B

Status Dot:
- Size: 8px
- Border radius: 50%
- Background: Matching color

Action Buttons:
- Display: Flex, gap 8px
- Margin top: auto

View Details Button:
- Flex: 1
- Height: 40px
- Background: #F3F4F6
- Color: #374151
- Font: Inter Medium, 14px
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Hover: Background #E5E7EB

Edit Button:
- Width: 40px
- Height: 40px
- Background: #F3F4F6
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Icon: ✏️ 18px
- Hover: Background #E5E7EB

More Menu Button (⋮):
- Width: 40px
- Height: 40px
- Background: #F3F4F6
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Icon: ⋮ 18px
- Hover: Background #E5E7EB
```

---

## 🎨 5. MORE MENU DROPDOWN

```
┌─────────────────────┐
│ 👁️ View Details     │
│ ✏️ Edit Course      │
│ 📋 Duplicate        │
│ 👥 Manage Students  │
│ 📊 View Statistics  │
│ ─────────────────   │
│ 🗑️ Delete          │
└─────────────────────┘

Dropdown Container:
- Width: 200px
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Padding: 8px
- Position: Absolute
- Z-index: 10

Menu Item:
- Height: 40px
- Padding: 0 12px
- Border radius: 6px
- Display: Flex, align-center
- Gap: 12px
- Font: Inter Medium, 14px
- Color: #374151
- Cursor: pointer
- Transition: background 150ms ease

Menu Item Hover:
- Background: #F3F4F6

Menu Item Icon:
- Size: 18px
- Color: #6B7280

Divider:
- Height: 1px
- Background: #E5E7EB
- Margin: 4px 0

Delete Item:
- Color: #EF4444
- Icon color: #EF4444
- Hover background: #FEE2E2
```

---

## 🎨 6. CREATE/EDIT COURSE MODAL

```
┌─────────────────────────────────────────────┐
│ ✕ Close                                     │
│                                             │
│ Tạo khóa học mới                            │
│                                             │
│ Thông tin cơ bản                            │
│                                             │
│ Tên khóa học: *                             │
│ [IELTS 6.5 - Morning Class             ]   │
│                                             │
│ Danh mục: *                                 │
│ [IELTS                                 ▾]   │
│                                             │
│ Mô tả:                                      │
│ [Khóa học IELTS 6.5 dành cho...        ]   │
│ [                                       ]   │
│ [                                       ]   │
│                                             │
│ Lịch học                                    │
│                                             │
│ Ngày bắt đầu: *                             │
│ [01/03/2026                            ]   │
│                                             │
│ Ngày kết thúc: *                            │
│ [30/06/2026                            ]   │
│                                             │
│ Lịch học: *                                 │
│ ☑ Monday    ☑ Wednesday    ☑ Friday        │
│ ☐ Tuesday   ☐ Thursday     ☐ Saturday      │
│ ☐ Sunday                                    │
│                                             │
│ Thời gian: *                                │
│ [08:00] - [10:00]                          │
│                                             │
│ Số lượng học viên tối đa:                   │
│ [30                                    ]   │
│                                             │
│ Trạng thái:                                 │
│ ○ Active    ○ Upcoming    ○ Completed      │
│                                             │
│ [Cancel] [Save Course] 🔵                  │
└─────────────────────────────────────────────┘

Modal Container:
- Width: 600px
- Max height: 90vh
- Background: White
- Border radius: 16px
- Shadow: 0 20px 25px rgba(0,0,0,0.15)
- Padding: 32px
- Position: Fixed center
- Overflow-y: auto

Modal Overlay:
- Background: rgba(0,0,0,0.5)
- Backdrop filter: blur(4px)

Close Button:
- Position: Absolute top 24px right 24px
- Size: 32px × 32px
- Background: #F3F4F6
- Border radius: 50%
- Icon: ✕ 16px
- Hover: Background #E5E7EB

Modal Title:
- Font: Inter Bold, 24px
- Color: #111827
- Margin bottom: 32px

Section Title:
- Font: Inter SemiBold, 16px
- Color: #374151
- Margin bottom: 16px
- Margin top: 24px

Form Label:
- Font: Inter Medium, 14px
- Color: #374151
- Margin bottom: 8px
- Display: block

Required Indicator (*):
- Color: #EF4444
- Margin left: 4px

Input Field:
- Width: 100%
- Height: 44px
- Background: White
- Border: 1px solid #D1D5DB
- Border radius: 8px
- Padding: 0 16px
- Font: Inter Regular, 14px
- Color: #1F2937
- Transition: all 200ms ease

Input Focus:
- Border: 2px solid #2563EB
- Shadow: 0 0 0 3px rgba(37,99,235,0.1)
- Outline: none

Select Dropdown:
- Same as input
- Padding right: 40px
- Arrow icon: 16px on right

Textarea:
- Min height: 100px
- Padding: 12px 16px
- Resize: vertical
- Line height: 1.5

Checkbox Group:
- Display: Grid, 3 columns
- Gap: 12px
- Margin: 16px 0

Checkbox Item:
- Display: Flex, align-center
- Gap: 8px
- Font: Inter Regular, 14px
- Color: #374151

Checkbox:
- Size: 20px × 20px
- Border: 2px solid #D1D5DB
- Border radius: 4px
- Cursor: pointer

Checkbox Checked:
- Background: #2563EB
- Border color: #2563EB
- Checkmark: White

Time Inputs:
- Display: Flex, gap 16px
- Align-center

Time Input:
- Width: 120px
- Height: 44px

Radio Group:
- Display: Flex, gap 24px

Radio Item:
- Display: Flex, align-center
- Gap: 8px

Radio Button:
- Size: 20px × 20px
- Border: 2px solid #D1D5DB
- Border radius: 50%

Radio Checked:
- Border color: #2563EB
- Inner dot: 10px, #2563EB

Action Buttons:
- Display: Flex, gap 12px
- Margin top: 32px
- Justify-content: flex-end

Cancel Button:
- Height: 44px
- Padding: 0 24px
- Background: White
- Color: #374151
- Border: 1px solid #D1D5DB
- Border radius: 8px
- Font: Inter Medium, 14px
- Hover: Background #F9FAFB

Save Button:
- Height: 44px
- Padding: 0 24px
- Background: #2563EB
- Color: White
- Border: none
- Border radius: 8px
- Font: Inter Medium, 14px
- Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Hover: Background #1D4ED8
```

---

## 🎨 7. COURSE DETAIL VIEW

```
┌─────────────────────────────────────────────┐
│ ← Back to Courses                           │
│                                             │
│ 🎓 IELTS 6.5 - Morning Class                │
│ Active • 24 students • Mon, Wed, Fri        │
│                                             │
│ [Edit Course] [Manage Students] [Delete]   │
│                                             │
│ [Overview] [Students] [Schedule] [Stats]   │
│ ─────────                                   │
│                                             │
│ Course Information                          │
│ ┌─────────────────────────────────────┐   │
│ │ Category: IELTS                     │   │
│ │ Level: 6.5                          │   │
│ │ Duration: 4 months                  │   │
│ │ Schedule: Mon, Wed, Fri             │   │
│ │ Time: 8:00 - 10:00 AM               │   │
│ │ Start Date: 01/03/2026              │   │
│ │ End Date: 30/06/2026                │   │
│ │ Max Students: 30                    │   │
│ │ Enrolled: 24/30                     │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Description                                 │
│ ┌─────────────────────────────────────┐   │
│ │ Khóa học IELTS 6.5 dành cho học    │   │
│ │ viên có trình độ trung cấp, mục    │   │
│ │ tiêu đạt 6.5 trong kỳ thi IELTS... │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Progress Overview                           │
│ ┌─────────────────────────────────────┐   │
│ │ Overall Progress: 75%               │   │
│ │ ████████████████░░░░                │   │
│ │                                     │   │
│ │ Completed Lessons: 45/60            │   │
│ │ Average Score: 78%                  │   │
│ │ Attendance Rate: 92%                │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Container:
- Width: 1096px
- Padding: 32px

Back Button:
- Font: Inter Medium, 14px
- Color: #6B7280
- Icon: ← 16px
- Hover: Color #2563EB

Course Title:
- Font: Inter Bold, 32px
- Color: #111827
- Margin: 24px 0 8px

Meta Info:
- Font: Inter Regular, 15px
- Color: #6B7280
- Display: Flex, gap 16px
- Separator: • between items

Action Buttons:
- Display: Flex, gap 12px
- Margin: 24px 0

Tabs:
- Display: Flex, gap 32px
- Border bottom: 2px solid #E5E7EB
- Margin: 32px 0

Tab Item:
- Height: 48px
- Font: Inter Medium, 15px
- Color: #6B7280
- Padding: 0 4px
- Position: relative
- Cursor: pointer

Tab Active:
- Color: #2563EB
- Border bottom: 3px solid #2563EB
- Margin bottom: -2px

Info Card:
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 24px
- Margin bottom: 24px

Info Grid:
- Display: Grid, 2 columns
- Gap: 16px

Info Item:
- Display: Flex
- Font: Inter Regular, 14px

Info Label:
- Color: #6B7280
- Width: 140px

Info Value:
- Color: #1F2937
- Font weight: 500
```

---

## 🎨 8. EMPTY STATE

```
┌─────────────────────────────────────────────┐
│                                             │
│              📚                             │
│                                             │
│         Chưa có khóa học nào                │
│                                             │
│    Tạo khóa học đầu tiên để bắt đầu        │
│    quản lý lớp học và học viên              │
│                                             │
│         [+ Tạo khóa học mới]                │
│                                             │
└─────────────────────────────────────────────┘

Container:
- Width: 100%
- Height: 400px
- Display: Flex column, center
- Background: #F9FAFB
- Border: 2px dashed #D1D5DB
- Border radius: 12px

Icon:
- Size: 64px
- Color: #D1D5DB
- Margin bottom: 24px

Title:
- Font: Inter SemiBold, 20px
- Color: #374151
- Margin bottom: 12px

Description:
- Font: Inter Regular, 15px
- Color: #6B7280
- Text align: center
- Max width: 400px
- Line height: 1.6
- Margin bottom: 32px

Button:
- Height: 48px
- Padding: 0 32px
- Background: #2563EB
- Color: White
- Font: Inter Medium, 15px
- Border radius: 8px
- Icon: + 20px
```

---

## 🎨 9. LOADING STATE

```
┌────────────┬────────────┬────────────┐
│ ░░░░░░░░░░ │ ░░░░░░░░░░ │ ░░░░░░░░░░ │
│ ░░░░░░░░   │ ░░░░░░░░   │ ░░░░░░░░   │
│ ░░░░░░     │ ░░░░░░     │ ░░░░░░     │
└────────────┴────────────┴────────────┘

Skeleton Card:
- Same size as course card
- Background: Linear gradient
  * From: #F3F4F6
  * To: #E5E7EB
- Animation: Shimmer effect
- Border radius: 12px

Shimmer Animation:
- Duration: 1.5s
- Timing: ease-in-out
- Iteration: infinite
- Transform: translateX(-100% to 100%)
```

---

## 🎨 10. RESPONSIVE BEHAVIOR

### Desktop (1440px+)
```
- Grid: 3 columns
- Card width: 349px
- Gap: 24px
- Sidebar: 280px visible
```

### Laptop (1024-1439px)
```
- Grid: 2 columns
- Card width: ~400px
- Gap: 20px
- Sidebar: 240px visible
```

### Tablet (768-1023px)
```
- Grid: 2 columns
- Card width: ~340px
- Gap: 16px
- Sidebar: Collapsible
```

### Mobile (<768px)
```
- Grid: 1 column
- Card width: 100%
- Gap: 16px
- Bottom navigation
- Modal: Full screen
```

---

## 🎨 11. ANIMATIONS

### Page Load
```
1. Header: Fade in (300ms)
2. Filters: Slide down (400ms)
3. Cards: Fade in + slide up (500ms, stagger 100ms)
```

### Card Hover
```
- Transform: translateY(-4px) 300ms ease
- Shadow: Expand 300ms ease
- Border: Color change 200ms ease
```

### Modal Open
```
- Overlay: Fade in (200ms)
- Modal: Scale(0.95 to 1) + fade in (300ms)
- Backdrop blur: 0 to 4px (200ms)
```

### Button Click
```
- Scale: 0.98 (100ms)
- Ripple effect from click point
```

---

## 🎨 12. COLOR CODING BY CATEGORY

```
IELTS:
- Badge: #DBEAFE to #BFDBFE
- Text: #1E40AF
- Border: #3B82F6

TOEIC:
- Badge: #FEF3C7 to #FDE68A
- Text: #92400E
- Border: #F59E0B

Cambridge:
- Badge: #D1FAE5 to #A7F3D0
- Text: #065F46
- Border: #10B981

VSTEP:
- Badge: #E0E7FF to #C7D2FE
- Text: #3730A3
- Border: #6366F1

Business English:
- Badge: #FCE7F3 to #FBCFE8
- Text: #831843
- Border: #EC4899
```

---

## ✅ CHECKLIST THIẾT KẾ

- [ ] Header với title và button "Tạo mới"
- [ ] Filter tabs cho categories
- [ ] Search bar với icon
- [ ] Course cards grid 3 columns
- [ ] Card hover effects
- [ ] Progress bars trong cards
- [ ] Status badges (Active, Completed, Upcoming)
- [ ] More menu dropdown
- [ ] Create/Edit modal với form đầy đủ
- [ ] Course detail view với tabs
- [ ] Empty state khi chưa có khóa học
- [ ] Loading skeleton
- [ ] Responsive cho tất cả breakpoints
- [ ] Color coding theo category
- [ ] Animations mượt mà

---

**🎯 Sử dụng prompt này để tạo trang Khóa học hoàn chỉnh trong Figma!**
