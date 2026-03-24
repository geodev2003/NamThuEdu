ESIGN PROMPT: Teacher Panel - Class Management (4 Pages)
Context
Design 4 pages for the "Lớp học" (Classes) section in Teacher Panel of NamThu Education Platform. These pages appear when teacher clicks on "Lớp học" menu item in sidebar.

PAGE 1: Danh sách lớp (Class List)
Layout
Header Section:

Page title: "Danh sách lớp học" (large, bold)
Breadcrumb: Dashboard > Lớp học > Danh sách
Action buttons (right aligned):
"Tạo lớp mới" button (primary blue, with + icon)
"Thống kê" button (secondary, with chart icon)
View toggle: Grid/List view (icon buttons)
Stats Cards Row (4 cards):

Total classes (with school icon, number, trend)
Active classes (green accent)
Total students across all classes (blue accent)
Average class size (purple accent)
Filter Bar:

Search box (placeholder: "Tìm theo tên lớp, mã lớp...")
Dropdown filters: Status (Active/Inactive/Archived), Course, Semester, Year
Sort by: Name/Date/Student count (dropdown)
"Lọc" button, "Xóa bộ lọc" link
Class Cards Grid (or Table based on view toggle):

Grid View (3-4 columns):

Card design:
Class name (bold, large)
Class code (small, gray)
Student count badge (with user icon: "25/30 học sinh")
Course tags (colored chips)
Status badge (Active/Inactive)
Quick stats: Assignments, Avg score
Action buttons: View details, Edit, More menu (3 dots)
Hover effect: Lift shadow, show quick actions
List View (Table):

Columns: Checkbox | Tên lớp | Mã lớp | Khóa học | Sĩ số | Trạng thái | Ngày tạo | Actions
Row actions: View (eye), Edit (pencil), Transfer students (arrows), Delete (trash)
Bulk actions: Delete, Archive, Export
Sortable columns
Pagination:

Show 12/24/48 per page (grid), 10/25/50 (list)
Page numbers, total count
"Tải thêm" button option for infinite scroll
Empty State:

Illustration of classroom
"Chưa có lớp học nào"
"Tạo lớp đầu tiên" button
Features:

Drag-to-reorder classes (optional)
Quick add student modal from card
Status toggle directly on card
Responsive: 1 column on mobile, 2 on tablet, 3-4 on desktop
PAGE 2: Tạo lớp mới (Create New Class)
Layout
Header:

Page title: "Tạo lớp học mới"
Breadcrumb: Dashboard > Lớp học > Tạo lớp mới
Back button (left arrow)
Save draft indicator (auto-save status)
Form Container (centered, max-width 900px):

Section 1: Thông tin cơ bản

Class name (required, text input, placeholder: "VD: Lớp IELTS 7.0 - Sáng T2-T4-T6")
Class code (auto-generated, editable, with regenerate button)
Description (rich text editor, optional)
Class image/banner upload (drag-drop area, 16:9 ratio)
Section 2: Cấu hình lớp học

Course selection (searchable dropdown, required)
Semester/Term (dropdown: Spring 2026, Fall 2026, etc.)
Academic year (dropdown: 2025-2026, 2026-2027)
Class type (radio: Regular/Intensive/Weekend/Online)
Maximum students (number input, default 30, range 1-100)
Start date (date picker, required)
End date (date picker, optional)
Section 3: Lịch học (Schedule)

Weekly schedule builder:
Add schedule button
Each row: Day of week | Start time | End time | Room/Location | Remove button
Visual calendar preview (optional)
Timezone (dropdown, default: Asia/Ho_Chi_Minh)
Section 4: Thêm học sinh

Two options (tabs):
Tab 1: Chọn từ danh sách
Multi-select searchable list with checkboxes
Show: Avatar, Name, Phone, Current classes
Bulk select all
Tab 2: Nhập danh sách
CSV upload (with template download)
Manual entry textarea (one phone/email per line)
Selected students preview (chips with remove X)
Student count: "Đã chọn: X/Y học sinh"
Section 5: Cài đặt nâng cao (collapsible)

Auto-enroll new students (toggle)
Allow self-enrollment (toggle with enrollment code generation)
Notification settings (checkboxes: Email, SMS, In-app)
Class visibility (radio: Public/Private/Hidden)
Tags (multi-input chips for categorization)
Action Buttons (sticky bottom):

"Hủy" button (secondary, left)
"Lưu nháp" button (outline, auto-saves)
"Tạo lớp học" button (primary, right, with loading state)
Features:

Real-time validation
Duplicate class detection (by name/code)
Success modal with options: View class, Add more students, Create another
Confirmation on cancel if form dirty
PAGE 3: Chuyển lớp (Transfer Students)
Layout
Header:

Page title: "Chuyển lớp học sinh"
Breadcrumb: Dashboard > Lớp học > Chuyển lớp
Help icon with tooltip explaining transfer process
Transfer Wizard (3-step process):

Step 1: Chọn lớp nguồn (Source Class)

Visual class selector (cards or dropdown)
Show class details: Name, Code, Student count
Filter: Active classes only
"Tiếp tục" button (disabled until selection)
Step 2: Chọn học sinh (Select Students)

Student list from selected class
Table with checkboxes:
Columns: Select | Avatar | Name | Phone | Enrollment date | Current performance
Bulk select options: All, None, By criteria (score range, attendance)
Search/filter students
Selected count indicator: "Đã chọn: X học sinh"
"Quay lại" and "Tiếp tục" buttons
Step 3: Chọn lớp đích (Destination Class)

Visual class selector (exclude source class)
Show class capacity: "15/30 học sinh" with warning if will exceed
Option: Create new class (opens quick create modal)
Transfer options:
Keep enrollment date (checkbox)
Transfer grades/scores (checkbox)
Send notification to students (checkbox)
Reason for transfer (textarea, optional)
Summary panel (sticky right):
From: [Class name]
To: [Class name]
Students: X
Date: [Today]
"Quay lại" and "Xác nhận chuyển lớp" buttons
Confirmation Modal:

Warning icon
"Xác nhận chuyển X học sinh từ [Class A] sang [Class B]?"
Impact summary: "Lớp nguồn còn Y học sinh, lớp đích sẽ có Z học sinh"
Checkbox: "Tôi hiểu và muốn tiếp tục"
"Hủy" and "Xác nhận" buttons
Success State:

Success animation/illustration
"Đã chuyển X học sinh thành công"
Action buttons:
"Xem lớp đích"
"Xem lịch sử chuyển lớp"
"Chuyển lớp khác"
"Về danh sách lớp"
Transfer History Section (bottom of page):

Table: Date | From Class | To Class | Students | Reason | Performed by | Actions
Actions: View details, Revert (if within 24h)
Filter by date range, class
Export history button
Features:

Validation: Check destination capacity
Bulk transfer with progress indicator
Undo option (time-limited)
Audit trail logging
Email/SMS notifications to affected students
PAGE 4: Thống kê lớp (Class Statistics)
Layout
Header:

Page title: "Thống kê lớp học"
Breadcrumb: Dashboard > Lớp học > Thống kê
Class selector dropdown (multi-select, "Tất cả lớp" default)
Date range picker (default: Current semester)
Export report button (PDF/Excel)
Overview Dashboard:

Row 1: Key Metrics (4 cards)

Total classes (with trend vs last period)
Total students enrolled
Average attendance rate (with gauge chart)
Average class performance (score)
Row 2: Class Performance Comparison

Horizontal bar chart: Classes ranked by average score
Color-coded: Top (green), Middle (blue), Need attention (orange/red)
Click to drill down to class details
Toggle: Score/Attendance/Completion rate
Row 3: Two Column Layout

Left: Enrollment Trends

Line chart: Student enrollment over time
Multiple lines for different classes (color-coded)
Legend with show/hide toggles
Annotations for key events (semester start, holidays)
Right: Class Size Distribution

Histogram: Number of classes by size range
Bars: 0-10, 11-20, 21-30, 31+ students
Ideal range indicator
Click to see classes in range
Row 4: Attendance Heatmap

Calendar heatmap showing attendance rates
Color intensity: High (dark green) to Low (light/red)
Hover tooltip: Date, Class, Attendance %
Filter by class, date range
Row 5: Performance by Course

Grouped bar chart: Courses with multiple classes
Metrics: Avg score, Completion rate, Satisfaction
Comparison view
Detailed Class Table (bottom section):

Expandable rows for each class
Summary row: Class name | Students | Avg score | Attendance | Status | Actions
Expanded view shows:
Student list with individual scores
Recent assignments and results
Attendance breakdown
Quick actions: Message class, View details, Generate report
Insights Panel (right sidebar or cards):

AI-generated insights (if available):
"Lớp IELTS 7.0 có tỷ lệ vắng mặt cao trong 2 tuần qua"
"3 lớp cần bổ sung học sinh"
"Điểm trung bình tăng 15% so với kỳ trước"
Recommended actions
Alerts and warnings
Export Options:

Full report (PDF with all charts)
Data export (Excel/CSV)
Custom report builder (select metrics, classes, date range)
Schedule recurring reports (email delivery)
Features:

Interactive charts (click, hover, zoom)
Real-time data updates
Comparison mode (select 2+ classes)
Responsive: Stack charts on mobile
Loading skeletons
Empty states with helpful messages
Drill-down navigation (chart → class → student)
Common Design Specifications (All 4 Pages)
Visual Design
Color Palette:

Primary: #2563EB (blue)
Success: #10B981 (green)
Warning: #F59E0B (orange)
Error: #EF4444 (red)
Neutral: #6B7280 (gray)
Background: #F9FAFB (light gray)
Typography:

Headings: Inter/SF Pro Display, 24-32px, bold (700)
Subheadings: 18-20px, semibold (600)
Body: 14-16px, regular (400)
Small text: 12-13px, medium (500)
Spacing:

Base unit: 4px
Common: 8px, 12px, 16px, 24px, 32px, 48px
Card padding: 20-24px
Section gaps: 32-48px
Components:

Cards: White bg, border-radius 12px, shadow-sm
Buttons: Height 40-44px, border-radius 8px, medium weight
Inputs: Height 40px, border-radius 6px, focus ring
Badges: Pill shape, 6px padding, 12px text
Tables: 48px row height, hover bg, sticky header
Interactions
Smooth transitions: 200-300ms ease-in-out
Hover effects: Lift shadow, scale 1.02, color change
Loading states: Skeleton screens, spinners, progress bars
Success feedback: Toast notifications (top-right, 4s)
Error handling: Inline validation, error modals
Confirmation: Modals for destructive actions
Responsive Design
Desktop (>1280px): Full layout, multi-column
Laptop (1024-1280px): Compact spacing, 2-3 columns
Tablet (768-1024px): Stack some sections, 2 columns
Mobile (<768px): Single column, bottom sheets, simplified charts
Accessibility
WCAG 2.1 AA compliant
Keyboard navigation (Tab, Enter, Esc)
Screen reader labels (aria-label, aria-describedby)
Focus indicators (2px outline)
Color contrast 4.5:1 minimum
Alt text for images/icons
Performance
Lazy load images and charts
Virtualized lists for large datasets
Debounced search inputs
Optimistic UI updates
Pagination/infinite scroll for tables