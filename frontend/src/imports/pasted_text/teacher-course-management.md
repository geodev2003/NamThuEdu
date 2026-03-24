DESIGN PROMPT: Teacher Panel - Course Management (4 Pages)
Context
Design 4 pages for the "Khóa học" (Courses) section in Teacher Panel of NamThu Education Platform. Based on backend API with fields: cName, cCategory, cNumberOfStudent, cTime, cSchedule, cStartDate, cEndDate, cStatus, cDescription.

PAGE 1: Danh sách khóa học (Course List)
Layout
Header Section:

Page title: "Danh sách khóa học" (large, bold)
Breadcrumb: Dashboard > Khóa học > Danh sách
Action buttons (right aligned):
"Tạo khóa học" button (primary blue, with + icon)
"Thống kê" button (secondary, with chart icon)
View toggle: Grid/List (icon buttons)
Stats Cards Row (4 cards):

Total courses (with book icon, number, trend)
Active courses (green accent)
Total students enrolled (blue accent)
Average occupancy rate (purple accent, percentage with gauge)
Filter Bar:

Search box (placeholder: "Tìm theo tên khóa học...")
Dropdown filters:
Category (VSTEP, IELTS, Cambridge)
Status (draft, active, completed, archived)
Date range (Start date)
Sort by: Name/Date/Students/Occupancy (dropdown)
"Lọc" button, "Xóa bộ lọc" link
Course Cards Grid (or Table):

Grid View (3 columns):

Card design:
Course banner/image (16:9 ratio, placeholder if none)
Category badge (top-right corner: VSTEP/IELTS chip)
Course name (bold, 18px)
Description (2 lines, truncated with "...")
Info row with icons:
📅 Schedule: "Mon-Wed-Fri, 7PM"
⏱️ Duration: "2 hours"
📆 Period: "Apr 1 - Jun 30, 2026"
Progress bar: Student enrollment (25/30 students)
Color: Green if <80%, Orange if 80-100%, Red if full
Status badge: Draft/Active/Completed/Archived
Quick stats row:
Occupancy: "83%"
Revenue: "37.5M VND" (if fee_paid available)
Action buttons:
"Xem chi tiết" (primary)
"Chỉnh sửa" (secondary)
More menu (3 dots): Duplicate, Archive, Delete
Hover: Lift shadow, show quick actions overlay
List View (Table):

Columns: Checkbox | Tên khóa học | Danh mục | Lịch học | Thời gian | Sĩ số | Tỷ lệ lấp đầy | Trạng thái | Ngày bắt đầu | Actions
Row actions: View (eye), Edit (pencil), Students (users), Delete (trash)
Bulk actions: Archive, Export, Delete
Sortable columns
Color-coded occupancy: Cell background gradient based on percentage
Pagination:

Show 12/24/48 per page (grid), 10/25/50 (list)
Page numbers, total count
Empty State:

Illustration of books/courses
"Chưa có khóa học nào"
"Tạo khóa học đầu tiên" button
Features:

Filter by date range (courses starting in selected period)
Quick status toggle on card
Duplicate course feature (copy all settings)
Export course list to Excel/PDF
Responsive: 1 column mobile, 2 tablet, 3 desktop
PAGE 2: Tạo khóa học (Create Course)
Layout
Header:

Page title: "Tạo khóa học mới"
Breadcrumb: Dashboard > Khóa học > Tạo khóa học
Back button (left arrow)
Auto-save indicator (last saved timestamp)
Form Container (centered, max-width 1000px):

Section 1: Thông tin cơ bản

Course banner upload (drag-drop, 16:9 ratio, 1200x675px recommended)
Course name (required, text input, max 100 chars)
Placeholder: "VD: Khóa học VSTEP B1-B2 - Buổi tối"
Course type/Category (required, radio cards with icons):
🎯 VSTEP (B1, B2, C1)
🌍 IELTS (5.0-6.0, 6.5-7.0, 7.5+)
📚 Cambridge (KET, PET, FCE)
Description (rich text editor, max 1000 chars)
Toolbar: Bold, Italic, List, Link
Character counter
Section 2: Cấu hình khóa học

Maximum students (required, number input)
Default: 30
Range: 1-100
Helper text: "Số lượng học sinh tối đa"
Duration per session (required, text input)
Placeholder: "2 giờ" or "90 phút"
Helper text: "Thời lượng mỗi buổi học"
Schedule (required, textarea or schedule builder)
Option 1: Free text (e.g., "Thứ 2-4-6, 19:00-21:00")
Option 2: Visual builder:
Select days: Mon/Tue/Wed/Thu/Fri/Sat/Sun (checkboxes)
Time picker: Start time - End time
Preview: "Mon, Wed, Fri - 7:00 PM to 9:00 PM"
Start date (required, date picker, must be future date)
End date (required, date picker, must be after start date)
Date range preview: "Khóa học kéo dài X tuần/tháng"
Section 3: Học phí & Thanh toán (optional)

Course fee (number input, VND)
Placeholder: "1,500,000"
Format with thousand separators
Payment terms (dropdown):
Full payment upfront
Installments (2/3/4 payments)
Pay per session
Discount options (collapsible):
Early bird discount (%, amount, deadline)
Group discount (%, minimum students)
Section 4: Thêm học sinh ban đầu (optional)

Two tabs:
Tab 1: Chọn từ danh sách
Multi-select searchable dropdown
Show: Avatar, Name, Phone, Current courses
Bulk select
Tab 2: Để trống (thêm sau)
Info message: "Bạn có thể thêm học sinh sau khi tạo khóa học"
Selected students preview (chips with X to remove)
Count: "Đã chọn: X học sinh"
Section 5: Cài đặt nâng cao (collapsible)

Course status (radio):
📝 Draft (default) - "Nháp, chưa công khai"
✅ Active - "Kích hoạt ngay"
Visibility (radio):
Public - "Hiển thị cho tất cả"
Private - "Chỉ học sinh được mời"
Auto-enroll settings (toggle):
Allow self-enrollment with code
Generate enrollment code (auto-generated, editable)
Notification settings (checkboxes):
Email notifications
SMS reminders
In-app notifications
Tags (multi-input chips):
For categorization and search
Suggestions: "Intensive", "Weekend", "Online", "Beginner"
Action Buttons (sticky bottom bar):

"Hủy" (secondary, left)
"Lưu nháp" (outline, auto-saves every 30s)
"Tạo khóa học" (primary, right)
Success Modal:

Success icon/animation
"Khóa học đã được tạo thành công!"
Course summary card
Action buttons:
"Xem khóa học"
"Thêm học sinh"
"Tạo khóa học khác"
"Về danh sách"
Features:

Real-time validation with inline errors
Auto-save draft every 30 seconds
Duplicate detection (warn if similar name exists)
Date conflict detection (warn if teacher has another course at same time)
Confirmation modal on cancel if form dirty
Form progress indicator (steps completed)
PAGE 3: Quản lý học viên (Manage Students in Course)
Layout
Header:

Page title: "Quản lý học viên - [Course Name]"
Breadcrumb: Dashboard > Khóa học > [Course Name] > Học viên
Back to course button
Course info chip: Category, Schedule, Period
Course Summary Card (top):

Left side:
Course name (large, bold)
Category badge
Schedule & duration
Date range
Right side (stats):
Enrolled: 25/30 students
Progress bar (occupancy)
Completed: 3 students
Dropped: 2 students
Available slots: 5
Action Bar:

"Thêm học sinh" button (primary, with + icon)
"Xuất danh sách" button (secondary, Excel/PDF)
Search box (placeholder: "Tìm học sinh...")
Filter dropdown: Status (Enrolled/Completed/Dropped)
Sort by: Name/Enrollment date/Fee status
Students Table:

Columns:

Checkbox (for bulk actions)
Avatar
Tên học sinh
Số điện thoại
Email
Ngày đăng ký
Học phí (Paid/Unpaid badge)
Trạng thái (Enrolled/Completed/Dropped)
Ghi chú
Actions
Row actions (3 dots menu):

View profile
Edit enrollment
Mark as completed
Remove from course
Add note
Send message
Status badges:

Enrolled: Green
Completed: Blue
Dropped: Gray/Red
Fee status:

Paid: Green checkmark
Unpaid: Orange warning
Partial: Yellow info
Click to view payment details
Bulk Actions (when rows selected):

Toolbar appears at top
"X học sinh đã chọn"
Actions:
Send notification
Mark as completed
Remove from course
Export selected
Update fee status
Add Student Modal:

Search/select student from database
Or enter new student info (quick create)
Fields:
Student selection (searchable dropdown)
Fee paid (number input, optional)
Payment status (dropdown)
Notes (textarea)
Enrollment date (date picker, default today)
Validation:
Check if already enrolled
Check if course is full
Warn if student has schedule conflict
"Hủy" and "Thêm học sinh" buttons
Remove Student Confirmation:

Warning modal
"Xác nhận xóa [Student Name] khỏi khóa học?"
Impact info: "Học sinh sẽ chuyển sang trạng thái Dropped"
Option: "Hoàn học phí" (checkbox)
Reason (textarea, optional)
"Hủy" and "Xác nhận" buttons
Student Detail Drawer (slide from right):

Triggered by clicking student name
Sections:
Personal info (avatar, name, phone, email)
Enrollment info (date, status, fee)
Performance (if available):
Attendance rate
Average score
Assignments completed
Notes history (timeline)
Quick actions:
Edit enrollment
Send message
View full profile
Remove from course
Empty State:

Illustration
"Chưa có học sinh nào trong khóa học"
"Thêm học sinh đầu tiên" button
Features:

Real-time search and filter
Inline editing for notes
Quick status toggle
Export with custom fields selection
Bulk operations with progress indicator
Payment tracking integration
Responsive: Horizontal scroll on mobile
PAGE 4: Thống kê (Course Statistics)
Layout
Header:

Page title: "Thống kê khóa học - [Course Name]"
Breadcrumb: Dashboard > Khóa học > [Course Name] > Thống kê
Back to course button
Date range picker (default: Course duration)
Export report button (PDF/Excel)
Course Overview Card:

Course name, category, status
Key metrics in 4 columns:
Total enrolled (with trend vs last course)
Completion rate (percentage with gauge)
Average attendance (if tracked)
Total revenue (if fee_paid available)
Dashboard Layout:

Row 1: Enrollment Overview (2 columns)

Left: Enrollment Status Breakdown

Donut chart showing:
Enrolled (green): 25 students
Completed (blue): 3 students
Dropped (red): 2 students
Legend with percentages
Center: Total students (30)
Right: Occupancy & Capacity

Gauge chart showing occupancy rate (83%)
Color-coded: <60% red, 60-80% yellow, >80% green
Stats below:
Current: 25 students
Maximum: 30 students
Available: 5 slots
Waitlist: 0 (if feature exists)
Row 2: Enrollment Trends

Line chart: Enrollments over time
X-axis: Months (from course start to now)
Y-axis: Number of enrollments
Multiple lines:
Cumulative enrollments (blue)
Dropped students (red, negative)
Net active students (green)
Annotations for key events:
Course start
Holidays/breaks
Promotional periods
Hover tooltip: Date, count, change
Row 3: Revenue Statistics (if applicable)

3 metric cards:
Total revenue: "37,500,000 VND"
Average fee per student: "1,500,000 VND"
Paid students: "25/25 (100%)"
Bar chart: Revenue by month
Payment status breakdown:
Fully paid: 23 students
Partially paid: 2 students
Unpaid: 0 students
Row 4: Course Progress Timeline

Visual timeline showing:
Start date (marker)
Current date (highlighted)
End date (marker)
Progress bar with percentage
Stats:
Days total: 90 days
Days elapsed: 45 days
Days remaining: 45 days
Progress: 50%
Milestones (if defined):
Mid-term exam
Final exam
Holidays
Row 5: Student Demographics (2 columns)

Left: Enrollment by Source

Pie chart:
Direct enrollment: 60%
Transferred from other class: 20%
Self-enrolled: 15%
Other: 5%
Right: Enrollment by Month

Bar chart showing when students enrolled
Identify peak enrollment periods
Row 6: Performance Metrics (if available)

Average score trend (line chart)
Attendance rate over time (line chart)
Assignment completion rate (bar chart)
Top performers table (top 5)
Students needing attention (bottom 5)
Detailed Students Table (bottom):

Expandable/collapsible section
Table with all students and their stats:
Name
Enrollment date
Status
Fee paid
Attendance (if tracked)
Performance (if tracked)
Export button for this data
Insights Panel (right sidebar or cards):

AI-generated insights:
"Tỷ lệ ghi danh tăng 20% so với khóa trước"
"3 học sinh có nguy cơ bỏ học (attendance <50%)"
"Doanh thu đạt 95% mục tiêu"
Recommendations:
"Khóa học sắp đầy, cân nhắc mở lớp mới"
"Gửi nhắc nhở cho 2 học sinh chưa đóng học phí"
Alerts:
Payment overdue
Low attendance warnings
Course ending soon
Comparison Mode (optional):

Toggle to compare with:
Previous course (same type)
Average of all courses
Target/goal metrics
Side-by-side charts
Difference indicators (↑↓ with percentages)
Export Options:

Full report (PDF with all charts and tables)
Data export (Excel/CSV)
Custom report builder:
Select metrics to include
Choose date range
Add custom notes
Schedule recurring reports (weekly/monthly email)
Features:

Interactive charts (click, hover, zoom)
Real-time data updates
Drill-down navigation (chart → student list → student detail)
Responsive: Stack charts vertically on mobile
Loading skeletons for async data
Empty states with helpful messages
Print-friendly layout
Common Design Specifications (All 4 Pages)
Visual Design
Color Palette:

Primary: #2563EB (blue)
Success: #10B981 (green)
Warning: #F59E0B (orange)
Error: #EF4444 (red)
Info: #8B5CF6 (purple)
Neutral: #6B7280 (gray)
Background: #F9FAFB
Typography:

Headings: Inter/SF Pro, 24-32px, bold (700)
Subheadings: 18-20px, semibold (600)
Body: 14-16px, regular (400)
Small: 12-13px, medium (500)
Spacing:

Base: 4px
Common: 8px, 12px, 16px, 24px, 32px, 48px
Card padding: 20-24px
Section gaps: 32-48px
Components:

Cards: White bg, border-radius 12px, shadow-sm
Buttons: Height 40-44px, border-radius 8px
Inputs: Height 40px, border-radius 6px
Badges: Pill shape, 6px padding
Tables: 48px row height, hover bg
Interactions
Transitions: 200-300ms ease-in-out
Hover: Lift shadow, scale 1.02
Loading: Skeleton screens, spinners
Success: Toast notifications (4s)
Errors: Inline validation, modals
Confirmations: Modals for destructive actions
Responsive
Desktop (>1280px): Full layout
Laptop (1024-1280px): Compact spacing
Tablet (768-1024px): Stack sections
Mobile (<768px): Single column, simplified
Accessibility
WCAG 2.1 AA compliant
Keyboard navigation
Screen reader labels
Focus indicators
Color contrast 4.5:1+
