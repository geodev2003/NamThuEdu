FIGMA AI DESIGN PROMPT: Test Assignment Management System
Design a modern, clean UI for a Test Assignment Management System for teachers in an educational platform. Use a professional color scheme with primary blue (#2563EB), success green (#10B981), warning orange (#F59E0B), and neutral grays.

1. ASSIGNMENT LIST PAGE (Main Dashboard)
Components needed:

Page header with title "Quản lý giao bài thi" and "Giao bài mới" button (primary blue)
Statistics cards row showing:
Total assignments count
Class assignments count
Individual student assignments count
Overdue assignments count (red badge)
Filter bar with:
Dropdown: Filter by exam (all exams)
Dropdown: Filter by target type (all/class/student)
Search input for assignment search
Data table with columns:
Exam title
Target type badge (class/student)
Target name
Deadline (with overdue indicator in red)
Max attempts
Completion rate (progress bar)
Action buttons (View Progress, Send Reminder, Delete)
Empty state illustration when no assignments exist
2. CREATE ASSIGNMENT MODAL
Components needed:

Modal overlay with form titled "Giao bài thi mới"
Step 1: Select exam dropdown (searchable)
Step 2: Assignment type radio buttons:
"Giao cho lớp học" (class icon)
"Giao cho học sinh" (student icon)
Step 3: Target selection:
If class: Dropdown list of classes
If student: Searchable dropdown of students
Settings section:
Date-time picker for deadline
Number input for max attempts (default: 1)
Toggle switch for "Public assignment"
Action buttons: "Hủy" (gray) and "Giao bài" (blue)
3. BULK ASSIGNMENT MODAL
Components needed:

Modal titled "Giao bài hàng loạt"
Select exam dropdown at top
Multi-select area with tabs:
"Chọn lớp học" tab with checkbox list of classes
"Chọn học sinh" tab with checkbox list of students
Selected targets chips display (removable)
Common settings:
Deadline picker
Max attempts input
Summary section showing: "Sẽ giao cho X lớp và Y học sinh"
Action buttons: "Hủy" and "Giao bài hàng loạt"
4. ASSIGNMENT PROGRESS PAGE
Components needed:

Breadcrumb navigation: Assignments > [Exam Title]
Assignment info card showing:
Exam title and type badge
Target type and name
Deadline with countdown timer
Max attempts allowed
Overdue warning banner (if applicable)
Statistics cards row:
Total students
Completed count (green)
Not completed count (orange)
Completion rate percentage (circular progress)
Two-column layout:
LEFT: "Đã hoàn thành" section with student cards showing:
Student name and phone
Score badge
Status badge (completed/graded)
Submission time
Attempt number
"Xem chi tiết" link
RIGHT: "Chưa hoàn thành" section with student cards showing:
Student name and phone
"Chưa làm bài" status
"Gửi nhắc nhở" button
Floating action button: "Gửi nhắc nhở hàng loạt"
5. STATISTICS DASHBOARD
Components needed:

Page title "Thống kê giao bài"
Overview cards:
Total assignments
Assignments with deadlines
Recent assignments (last 7 days)
Overdue assignments
Chart section:
Bar chart: "Assignments by Exam" showing distribution
Line chart: "Assignment trends over time"
Quick actions panel:
"Xem tất cả assignments"
"Giao bài mới"
"Xem báo cáo chi tiết"
6. REMINDER CONFIRMATION MODAL
Components needed:

Modal titled "Gửi nhắc nhở"
Warning icon
Message: "Bạn có chắc muốn gửi nhắc nhở đến [X] học sinh chưa hoàn thành bài thi?"
Assignment details summary
Action buttons: "Hủy" and "Gửi nhắc nhở" (orange)
DESIGN REQUIREMENTS:
Use modern card-based layouts with subtle shadows
Implement responsive grid system (works on desktop and tablet)
Use icons from Heroicons or Lucide
Add hover states and smooth transitions
Include loading states (skeleton screens)
Use toast notifications for success/error messages
Implement proper spacing (8px grid system)
Add empty states with illustrations
Use badges for status indicators
Include tooltips for action buttons
COLOR PALETTE:
Primary: #2563EB (blue)
Success: #10B981 (green)
Warning: #F59E0B (orange)
Danger: #EF4444 (red)
Gray scale: #F9FAFB, #E5E7EB, #6B7280, #1F2937
Design should feel modern, professional, and easy to use for teachers managing multiple test assignments