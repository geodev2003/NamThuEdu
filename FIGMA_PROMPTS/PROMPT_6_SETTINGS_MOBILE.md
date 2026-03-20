# 🎨 FIGMA PROMPT 6/6 - SETTINGS, MOBILE & FINAL CHECKLIST

## ⚙️ SETTINGS PAGE

### Header
```
┌─────────────────────────────────────────────────┐
│ Settings                                        │
│ Manage your account and preferences             │
└─────────────────────────────────────────────────┘

Title: Inter Bold, 32px
Subtitle: Inter Regular, 16px, Gray 600
```

---

## 📋 SETTINGS LAYOUT (2 columns)

### Left Sidebar (Navigation)
```
┌─────────────────────────┐
│ 👤 Profile              │ ← Active
│ 🔐 Security             │
│ 🔔 Notifications        │
│ 🎨 Appearance           │
│ 🌐 Language             │
│ 📊 Data & Privacy       │
│ ℹ️ About                │
└─────────────────────────┘

Width: 240px
Item height: 48px
Active: Blue background, white text
Hover: Gray 100
Icons: 20px
```

### Right Content Area

#### Profile Settings
```
┌─────────────────────────────────────────────┐
│ Profile Information                         │
│                                             │
│ Avatar:                                     │
│ [👤 Photo] [Change Photo] [Remove]         │
│                                             │
│ Full Name: *                                │
│ [Nguyễn Văn Thuần                      ]   │
│                                             │
│ Email: *                                    │
│ [thuan@namthuedu.com                   ]   │
│                                             │
│ Phone:                                      │
│ [+84 123 456 789                       ]   │
│                                             │
│ Bio:                                        │
│ [English teacher with 10 years...      ]   │
│ [                                       ]   │
│                                             │
│ Teaching Specialization:                    │
│ ☑ IELTS                                     │
│ ☑ TOEIC                                     │
│ ☑ Cambridge (Young Learners)                │
│ ☐ VSTEP                                     │
│                                             │
│ [Cancel] [Save Changes] 🔵                  │
└─────────────────────────────────────────────┘

Avatar: 120px circular
Inputs: 44px height
Textarea: 120px min height
Checkboxes: 20px
Spacing: 24px between fields
```

#### Security Settings
```
┌─────────────────────────────────────────────┐
│ Security & Password                         │
│                                             │
│ Change Password:                            │
│ Current Password: *                         │
│ [••••••••••                            ]   │
│                                             │
│ New Password: *                             │
│ [••••••••••                            ]   │
│                                             │
│ Confirm Password: *                         │
│ [••••••••••                            ]   │
│                                             │
│ Password Strength: ████████░░ Strong        │
│                                             │
│ Two-Factor Authentication:                  │
│ ○ Disabled                                  │
│ ● Enabled via SMS                           │
│ ○ Enabled via Email                         │
│                                             │
│ Active Sessions:                            │
│ ┌─────────────────────────────────────┐   │
│ │ 💻 Windows • Chrome                 │   │
│ │ Current session                     │   │
│ │ IP: 192.168.1.100                   │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ [Update Password] 🔵                        │
└─────────────────────────────────────────────┘

Password inputs: Eye icon to toggle visibility
Strength bar: 12px height, color-coded
Radio buttons: 20px
Session cards: 16px padding
```

#### Notification Settings
```
┌─────────────────────────────────────────────┐
│ Notification Preferences                    │
│                                             │
│ Email Notifications:                        │
│ ☑ New student enrollment                    │
│ ☑ Test submission received                  │
│ ☑ Assignment deadline reminder              │
│ ☐ Weekly performance report                 │
│                                             │
│ Push Notifications:                         │
│ ☑ Student messages                          │
│ ☑ System updates                            │
│ ☐ Marketing emails                          │
│                                             │
│ Notification Frequency:                     │
│ ○ Real-time                                 │
│ ● Daily digest (9:00 AM)                    │
│ ○ Weekly digest (Monday)                    │
│                                             │
│ [Save Preferences] 🔵                       │
└─────────────────────────────────────────────┘

Checkboxes: 20px with labels
Radio buttons: 20px
Spacing: 16px between items
```

---

## 📱 MOBILE NAVIGATION

### Bottom Navigation Bar
```
┌─────────────────────────────────────────────┐
│ [🏠] [📚] [➕] [📊] [👤]                    │
│ Home Exams New Stats Profile                │
└─────────────────────────────────────────────┘

Height: 64px
Background: White
Shadow: 0 -2px 8px rgba(0,0,0,0.1)
Icons: 24px
Text: Inter Medium, 10px
Active: Blue color
Inactive: Gray 500

Center button (➕): 
- Size: 56px circular
- Background: Blue gradient
- Elevated 8px above bar
- Shadow: Large
```

### Mobile Header
```
┌─────────────────────────────────────────────┐
│ [☰] NamThu Education          [🔔] [👤]    │
└─────────────────────────────────────────────┘

Height: 56px
Background: White
Shadow: Small
Menu icon: 24px (opens drawer)
Logo: 32px
Notification: Badge with count
Avatar: 32px
```

### Mobile Drawer Menu
```
┌─────────────────────────┐
│                         │
│ 👤 Nguyễn Văn Thuần     │
│ 🎓 Teacher              │
│ ─────────────────       │
│                         │
│ 🏠 Dashboard            │
│ 📚 Courses              │
│ 🏫 Classes              │
│ 👥 Students             │
│ 📝 Exams                │
│ 🎓 Cambridge Templates  │
│ 📋 Assignments          │
│ 📈 Grading              │
│ ✍️ Blog Posts           │
│ ─────────────────       │
│ ⚙️ Settings             │
│ 🚪 Logout               │
│                         │
└─────────────────────────┘

Width: 280px
Slide from left
Overlay: rgba(0,0,0,0.5)
Item height: 48px
Icons: 20px
```

---

## 📱 MOBILE RESPONSIVE LAYOUTS

### Mobile Dashboard (Portrait <568px)
```
┌─────────────────────────┐
│ [☰] Dashboard  [🔔] [👤]│
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ 📚 Courses          │ │
│ │ 12                  │ │
│ │ +2 this month       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🏫 Classes          │ │
│ │ 8                   │ │
│ │ +1 this month       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 👥 Students         │ │
│ │ 156                 │ │
│ │ +12 this month      │ │
│ └─────────────────────┘ │
│                         │
│ Recent Activity         │
│ ○─ Created test         │
│ ○─ Assigned test        │
│                         │
├─────────────────────────┤
│ [🏠] [📚] [➕] [📊] [👤]│
└─────────────────────────┘

Stats: Stack vertically, full width
Cards: 16px margin
Bottom nav: Fixed
```

### Mobile Cambridge Templates
```
┌─────────────────────────┐
│ [☰] Templates  [🔔] [👤]│
├─────────────────────────┤
│                         │
│ [All] [Young] [Main]    │
│ [🔍 Search...]          │
│                         │
│ ┌─────────────────────┐ │
│ │ 🎓 STARTERS         │ │
│ │ Pre A1 • 6-8 years  │ │
│ │ 45 min • 54 qs      │ │
│ │                     │ │
│ │ [View] [Use] 🔵     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🎓 MOVERS           │ │
│ │ A1 • 8-11 years     │ │
│ │ 62 min • 64 qs      │ │
│ │                     │ │
│ │ [View] [Use] 🔵     │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [🏠] [📚] [➕] [📊] [👤]│
└─────────────────────────┘

Cards: Full width, stack
Buttons: Side by side
Tabs: Horizontal scroll
```

### Mobile Grading Interface
```
┌─────────────────────────┐
│ [←] Grading    [Save]   │
├─────────────────────────┤
│                         │
│ Student: Nguyễn Văn A   │
│ Test: IELTS Reading     │
│                         │
│ [Questions] [Scoring]   │
│ ─────────                │
│                         │
│ Q1. Multiple Choice     │
│ ✅ Correct              │
│                         │
│ Q2. Fill Blank          │
│ ✅ Correct              │
│                         │
│ Q31. Essay Writing      │
│ [Student's essay...]    │
│                         │
│ Score: [__/10]          │
│ Feedback:               │
│ [Good work...]          │
│                         │
│ ─────────────────       │
│ Total: 75/100 (75%)     │
│                         │
│ [Submit Grade] 🔵       │
│                         │
├─────────────────────────┤
│ [🏠] [📚] [➕] [📊] [👤]│
└─────────────────────────┘

Single column layout
Simplified scoring
Sticky header
Sticky bottom nav
```

---

## 🎨 MOBILE-SPECIFIC COMPONENTS

### Mobile Card
```
Width: 100% (16px margin)
Padding: 16px
Border Radius: 12px
Shadow: Small
Tap target: Min 44px height
```

### Mobile Button
```
Height: 48px (larger tap target)
Full width or 50% side-by-side
Font: Inter Medium, 16px
Border Radius: 8px
```

### Mobile Input
```
Height: 48px (easier to tap)
Font: 16px (prevents zoom on iOS)
Border Radius: 8px
Padding: 12px 16px
```

### Mobile Modal
```
Full screen on mobile
Slide up animation
Close button: Top right, 44px
Padding: 16px
```

---

## 📱 RESPONSIVE BREAKPOINTS SUMMARY

### Desktop (1440px+)
```
- Sidebar: 280px visible
- Content: Multi-column layouts
- Tables: Full width, all columns
- Cards: 3-4 columns grid
- Modals: Centered, max 600px
```

### Laptop (1024-1439px)
```
- Sidebar: 240px visible
- Content: 2-3 columns
- Tables: Horizontal scroll if needed
- Cards: 2-3 columns
- Modals: Centered, max 500px
```

### Tablet (768-1023px)
```
- Sidebar: Collapsible overlay
- Content: 2 columns or stack
- Tables: Card view or scroll
- Cards: 2 columns
- Modals: Full width, 32px margin
```

### Mobile Landscape (568-767px)
```
- Bottom navigation
- Content: 2 columns for cards
- Tables: Card view
- Cards: 2 columns
- Modals: Full width, 16px margin
```

### Mobile Portrait (<568px)
```
- Bottom navigation
- Content: Single column
- Tables: Card view, stack
- Cards: 1 column, full width
- Modals: Full screen
```

---

## ✅ FINAL DESIGN CHECKLIST

### 🎨 Visual Design
```
☑ Color palette applied consistently
☑ Typography hierarchy clear
☑ Spacing system used (4px grid)
☑ Border radius consistent
☑ Shadows applied correctly
☑ Icons sized properly (16px, 20px, 24px)
☑ Avatars circular (32px, 40px, 48px)
☑ Badges styled correctly
```

### 📱 Responsive Design
```
☑ Desktop layout (1440px+)
☑ Laptop layout (1024-1439px)
☑ Tablet layout (768-1023px)
☑ Mobile landscape (568-767px)
☑ Mobile portrait (<568px)
☑ Bottom navigation for mobile
☑ Collapsible sidebar for tablet
☑ Touch targets min 44px
```

### 🎯 Components
```
☑ Buttons (Primary, Secondary, Icon)
☑ Input fields (Text, Select, Textarea)
☑ Cards (Standard, Hover states)
☑ Tables (Desktop, Mobile card view)
☑ Modals (Desktop centered, Mobile full)
☑ Navigation (Sidebar, Bottom nav)
☑ Progress bars (Multiple sizes)
☑ Status badges (Colored)
☑ Charts (Line, Donut)
```

### 🔄 Interaction States
```
☑ Hover states (Cards, Buttons, Menu)
☑ Active states (Tabs, Menu items)
☑ Focus states (Inputs, Buttons)
☑ Loading states (Skeleton, Spinner)
☑ Disabled states (Buttons, Inputs)
☑ Error states (Form validation)
☑ Success states (Confirmations)
```

### 📄 Pages Completed
```
☑ Dashboard (Stats, Charts, Activity)
☑ Cambridge Templates (Grid, Detail, Form)
☑ Exams (Table, Detail, Questions)
☑ Classes (Cards, Detail, Students)
☑ Students (Table, Detail, Performance)
☑ Assignments (Grid, Detail, Modal)
☑ Grading (Queue, Interface, Scoring)
☑ Settings (Profile, Security, Notifications)
☑ Mobile versions (All pages)
```

### ♿ Accessibility
```
☑ Color contrast WCAG AA (4.5:1 text)
☑ Touch targets min 44px
☑ Focus indicators visible
☑ Form labels present
☑ Error messages clear
☑ Alt text for icons (in implementation)
☑ Keyboard navigation support
```

### 🎯 Cambridge-Specific
```
☑ 9 template cards designed
☑ Color coding (Young=Green, Main=Orange, Intl=Red)
☑ Age ranges displayed
☑ Duration and question counts
☑ Section breakdowns
☑ Template detail modals
☑ Create from template forms
```

---

## 🚀 EXPORT GUIDELINES

### For Developers
```
1. Export assets at 1x, 2x, 3x
2. Use SVG for icons
3. Export colors as CSS variables
4. Document component variants
5. Provide spacing tokens
6. Include interaction specs
7. Note animation timings
```

### Asset Naming
```
Icons: icon-[name]-[size].svg
Images: img-[page]-[element].png
Logos: logo-[variant]-[size].svg
```

### Design Tokens
```css
/* Colors */
--color-primary: #2563EB;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Typography */
--font-family: 'Inter', sans-serif;
--font-size-sm: 12px;
--font-size-base: 14px;
--font-size-lg: 16px;
--font-size-xl: 20px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

---

## 🎉 COMPLETION

### What You've Created
```
✅ Complete Teacher Dashboard UI
✅ 8 main pages with full functionality
✅ 50+ unique components
✅ 5 responsive breakpoints
✅ Mobile-first design approach
✅ Cambridge Templates showcase
✅ Professional, modern aesthetic
✅ Ready for development handoff
```

### Next Steps
```
1. Review all 6 prompts
2. Create designs in Figma
3. Share with stakeholders
4. Gather feedback
5. Iterate on designs
6. Prepare developer handoff
7. Create design system documentation
```

---

**🎨 END OF FIGMA PROMPTS (6/6)**

**Total Pages**: 8 main pages  
**Total Components**: 50+  
**Responsive Breakpoints**: 5  
**Design System**: Complete  
**Ready for**: Figma Design & Development  

**Good luck with your design! 🚀**
