DESIGN PROMPT: Teacher Panel - Student Management (4 Pages)
Context
Design 4 pages for the "Học viên" (Students) section in Teacher Panel of NamThu Education Platform. These pages appear when teacher clicks on "Học viên" menu item in sidebar.

PAGE 1: Danh sách học sinh (Student List)
Layout
Header Section:

Page title: "Danh sách học sinh" (large, bold)
Breadcrumb: Dashboard > Học viên > Danh sách
Action buttons (right aligned):
"Thêm học sinh" button (primary blue, with + icon)
"Xuất dữ liệu" button (secondary, with download icon)
Filter/Search icon button
Stats Cards Row (4 cards):

Total students (with icon, number, trend indicator)
Active students (green accent)
Inactive students (gray accent)
New this month (blue accent)
Filter Bar:

Search box (placeholder: "Tìm theo tên, SĐT, email...")
Dropdown filters: Class, Course, Status, Date range
"Lọc" button, "Xóa bộ lọc" link
Data Table:

Columns: Checkbox | Avatar | Tên | SĐT | Email | Lớp | Khóa học | Trạng thái | Ngày tạo | Actions
Row actions: View detail (eye icon), Edit (pencil), Delete (trash), More (3 dots menu)
Bulk actions toolbar (appears when rows selected): Delete, Change class, Export selected
Pagination: Show 10/25/50/100 per page, page numbers, total count
Empty state: Illustration + "Chưa có học sinh nào" + "Thêm học sinh" button
Features:

Sortable columns (click header to sort)
Row hover effect
Status badges: Active (green), Inactive (gray), Suspended (red)
Avatar with fallback initials
Responsive: Stack cards on mobile, horizontal scroll table
PAGE 2: Thêm học sinh (Add New Student)
Layout
Header:

Page title: "Thêm học sinh mới"
Breadcrumb: Dashboard > Học viên > Thêm học sinh
Back button (left arrow)
Form Container (centered, max-width 800px):

Section 1: Thông tin cá nhân

Avatar upload (circle, with camera icon overlay)
Full name (required, text input)
Phone number (required, tel input with validation)
Email (optional, email input)
Date of birth (date picker)
Gender (radio buttons: Nam/Nữ/Khác)
Address (textarea)
Section 2: Thông tin học tập

Class selection (searchable dropdown, multi-select)
Course enrollment (searchable dropdown, multi-select with chips)
Student ID (auto-generated, read-only, with regenerate button)
Notes (textarea, optional)
Section 3: Tài khoản

Auto-generate password checkbox (checked by default)
Password field (if unchecked, with strength indicator)
Confirm password
Send credentials via SMS checkbox
Account status (toggle: Active/Inactive)
Action Buttons (sticky bottom or fixed):

"Hủy" button (secondary, left)
"Lưu nháp" button (outline)
"Thêm học sinh" button (primary, right)
Features:

Real-time validation with error messages
Required field indicators (*)
Success toast notification after save
Confirmation modal on cancel if form dirty
PAGE 3: Thống kê (Student Statistics)
Layout
Header:

Page title: "Thống kê học sinh"
Breadcrumb: Dashboard > Học viên > Thống kê
Date range picker (right aligned)
Export report button
Overview Cards (3-4 cards):

Total students with growth percentage
Average test score
Attendance rate
Completion rate
Charts Section:

Row 1: Student Growth Chart

Line chart showing student enrollment over time
Toggle: Monthly/Quarterly/Yearly view
Legend with color codes
Row 2: Two Column Layout

Left: Class distribution (Pie/Donut chart)
Right: Course enrollment (Bar chart)
Row 3: Performance Overview

Horizontal bar chart: Average scores by class
Color-coded: Excellent (green), Good (blue), Average (yellow), Poor (red)
Top Performers Table:

Title: "Học sinh xuất sắc"
Columns: Rank | Avatar | Name | Class | Avg Score | Tests Completed
Show top 10, "Xem tất cả" link
Bottom Performers Alert (if any):

Warning card: "X học sinh cần hỗ trợ thêm"
Quick action button: "Xem chi tiết"
Features:

Interactive charts (hover tooltips, click to drill down)
Responsive: Stack charts vertically on mobile
Loading skeletons while fetching data
Empty state if no data available
PAGE 4: Xuất dữ liệu (Export Data)
Layout
Header:

Page title: "Xuất dữ liệu học sinh"
Breadcrumb: Dashboard > Học viên > Xuất dữ liệu
Back button
Export Configuration Panel (centered card):

Section 1: Chọn định dạng

Radio cards with icons:
Excel (.xlsx) - recommended badge
CSV (.csv)
PDF (with template preview)
Section 2: Chọn dữ liệu

Checkbox list:
☑ Thông tin cá nhân (Name, Phone, Email, DOB)
☑ Thông tin học tập (Class, Course, Student ID)
☐ Điểm số và kết quả thi
☐ Lịch sử tham gia
☐ Ghi chú và nhận xét
"Chọn tất cả" / "Bỏ chọn tất cả" links
Section 3: Bộ lọc

Class filter (multi-select dropdown)
Course filter (multi-select dropdown)
Status filter (checkboxes: Active, Inactive, Suspended)
Date range: Enrolled from [date] to [date]
"Áp dụng bộ lọc" button
Section 4: Tùy chọn nâng cao (collapsible)

Include photos (checkbox)
Sort by: Name/Date/Class (dropdown)
Group by: Class/Course/None (dropdown)
Language: Tiếng Việt/English (toggle)
Preview Section:

"Xem trước" button
Shows sample data in modal/drawer
Estimated file size display
Estimated record count: "X học sinh sẽ được xuất"
Action Buttons:

"Hủy" (secondary)
"Xuất dữ liệu" (primary, with download icon)
Export History (bottom section):

Table: Date | Format | Records | File Size | Status | Download
Status: Success (green), Processing (blue), Failed (red)
Download button for completed exports
Auto-delete after 7 days notice
Features:

Progress modal during export (with percentage)
Success notification with download link
Error handling with retry option
Save export configuration as template
Common Design Specifications (All 4 Pages)
Visual Design
Color scheme: Primary blue (#2563EB), Success green (#10B981), Warning yellow (#F59E0B), Error red (#EF4444)
Typography: Headings (Inter/SF Pro, 24-32px bold), Body (14-16px regular)
Spacing: 16px/24px/32px/48px grid system
Border radius: 8px for cards, 6px for buttons, 4px for inputs
Shadows: Subtle elevation (0 1px 3px rgba(0,0,0,0.1))
Components
Buttons: 40px height, 16px padding, medium weight text
Input fields: 40px height, border on focus, error states
Cards: White background, subtle shadow, 16px padding
Tables: Striped rows, hover effect, sticky header on scroll
Modals: Centered, backdrop blur, smooth animation
Responsive Breakpoints
Desktop: >1280px (full layout)
Laptop: 1024-1280px (compact spacing)
Tablet: 768-1024px (stack some sections)
Mobile: <768px (single column, bottom sheets)
Accessibility
WCAG 2.1 AA compliant
Keyboard navigation support
Screen reader labels
Focus indicators
Color contrast 4.5:1 minimum
Interactions
Loading states: Skeleton screens or spinners
Success/Error toasts: Top-right, auto-dismiss 3-5s
Confirmation modals: For destructive actions
Smooth transitions: 200-300ms ease-in-out
Optimistic UI updates where appropriate