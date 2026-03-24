FIGMA AI DESIGN PROMPT: Grading & Assessment Management System
Design a modern, professional UI for a Grading and Assessment Management System for teachers in an educational platform. Use a clean color scheme with primary blue (#2563EB), success green (#10B981), warning amber (#F59E0B), danger red (#EF4444), and neutral grays.

1. SUBMISSIONS LIST PAGE (Grading Queue)
Components needed:

Page header with title "Chấm bài" and filter button
Statistics cards row:
Total submissions count
Graded submissions (green badge)
Pending submissions (orange badge)
Grading completion rate (circular progress)
Filter bar with:
Dropdown: Filter by exam
Dropdown: Filter by status (all/submitted/graded/partially_graded)
Dropdown: Filter by student
Search input
Data table with columns:
Student name and avatar
Exam title
Submission time
Status badge (submitted/graded/partially_graded)
Score (if graded)
Attempt number
Action buttons (View Details, Auto Grade, Manual Grade)
Bulk actions toolbar: "Chấm tự động hàng loạt" button
Empty state when no submissions
2. SUBMISSION DETAIL PAGE (Grading Interface)
Components needed:

Breadcrumb: Chấm bài > [Student Name] > [Exam Title]
Top info card showing:
Student info (name, avatar, ID)
Exam title and type
Submission time
Current status badge
Attempt number
Action buttons row:
"Chấm tự động" (blue)
"Lưu điểm" (green)
"Quay lại" (gray)
Score summary panel (sticky sidebar):
Current total score display (large number)
Progress bar showing graded vs total questions
Auto-graded count
Manual grading required count
Max score possible
Questions list (scrollable main area):
Each question card showing:
Question number and type badge
Question text with rich formatting
Student's answer (highlighted)
Correct answer (if auto-graded)
Points input field (editable)
Correct/Incorrect toggle
Feedback textarea
Auto-grade indicator (green checkmark if auto-graded)
Overall feedback section at bottom:
Large textarea for teacher feedback
"Điểm mạnh" (Strengths) chips input
"Cần cải thiện" (Improvements) chips input
3. AUTO-GRADE CONFIRMATION MODAL
Components needed:

Modal titled "Chấm tự động"
Info icon with message
Summary showing:
Total questions
Auto-gradable questions (multiple choice, true/false, fill-blank)
Manual grading required (essay, short answer)
Warning: "Câu tự luận vẫn cần chấm thủ công"
Action buttons: "Hủy" and "Chấm tự động" (blue)
4. DETAILED GRADING MODAL
Components needed:

Full-screen modal titled "Chấm chi tiết"
Split view:
LEFT: Question and student answer
RIGHT: Grading panel with:
Points slider/input
Correct/Incorrect radio buttons
Feedback textarea
Sample answer reference (collapsible)
Navigation arrows: Previous/Next question
Progress indicator: "Câu 3/10"
Quick actions: "Đúng hoàn toàn", "Sai hoàn toàn", "Một phần đúng"
Bottom bar: "Lưu và tiếp tục" button
5. CLASS REPORT PAGE
Components needed:

Page header: "Báo cáo lớp [Class Name]"
Filter: Select exam dropdown
Class overview cards:
Total students
Students with submissions
Participation rate (%)
Average score
Pass rate (%)
Score distribution chart:
Bar chart showing ranges: 90-100, 80-89, 70-79, 60-69, 0-59
Different colors for each range
Exam performance section:
Table showing each exam with:
Exam title
Submissions count
Average score
Pass rate
Highest/Lowest scores
Student rankings table:
Rank number
Student name and avatar
Submissions count
Average score
Highest score
Total points
Trend indicator (up/down arrow)
Question analysis section:
Table showing difficult questions:
Question text (truncated)
Question type
Success rate (%)
Average score
Total attempts
Difficulty indicator (easy/medium/hard badge)
Export button: "Xuất báo cáo PDF"
6. GRADING STATISTICS DASHBOARD
Components needed:

Page title "Thống kê chấm bài"
Overview metrics cards:
Total submissions
Graded submissions
Pending submissions
Grading completion rate
Recent grading activity (last 7 days)
Average grading time (in minutes)
Charts section:
Pie chart: Submissions by status
Line chart: Grading activity over time
Bar chart: Average scores by exam type (IELTS, VSTEP, Cambridge, etc.)
Scores by exam type table:
Exam type
Submissions count
Average score
Highest score
Lowest score
Quick actions panel:
"Xem bài chờ chấm"
"Chấm tự động hàng loạt"
"Xem báo cáo chi tiết"
7. BULK AUTO-GRADE MODAL
Components needed:

Modal titled "Chấm tự động hàng loạt"
Selection criteria:
Checkbox list of exams
Status filter (only submitted)
Date range picker
Preview section showing:
Number of submissions to be graded
Estimated time
Warning about manual grading requirements
Progress bar (when processing)
Results summary after completion:
Successfully graded count
Failed count
Manual grading still required
Action buttons: "Hủy" and "Bắt đầu chấm"
8. FEEDBACK TEMPLATES SIDEBAR
Components needed:

Collapsible sidebar titled "Mẫu nhận xét"
Category tabs:
Excellent
Good
Average
Needs Improvement
Template cards with:
Template text preview
"Sử dụng" button
Edit icon
"Thêm mẫu mới" button at bottom
9. SCORE ADJUSTMENT MODAL
Components needed:

Modal titled "Điều chỉnh điểm"
Current score display (large)
Adjustment reason dropdown:
Bonus points
Penalty
Correction
Other
Points adjustment input (+/-)
Reason textarea (required)
Preview of new score
Action buttons: "Hủy" and "Áp dụng"
DESIGN REQUIREMENTS:
Use card-based layouts with subtle shadows
Implement color-coded status badges (green=graded, orange=pending, blue=in_progress)
Add smooth transitions and hover effects
Include loading states and skeleton screens
Use icons from Heroicons or Lucide
Implement sticky headers for long scrolling pages
Add tooltips for complex actions
Include keyboard shortcuts hints (e.g., "Ctrl+S to save")
Use progress indicators for multi-step processes
Add confirmation dialogs for destructive actions
Implement responsive design (desktop and tablet)
COLOR PALETTE:
Primary: #2563EB (blue)
Success: #10B981 (green)
Warning: #F59E0B (amber)
Danger: #EF4444 (red)
Info: #3B82F6 (light blue)
Gray scale: #F9FAFB, #E5E7EB, #9CA3AF, #6B7280, #374151
TYPOGRAPHY:
Headers: Bold, 24-32px
Body: Regular, 14-16px
Small text: 12-14px
Use clear hierarchy with proper spacing
Design should feel efficient and professional, helping teachers grade submissions quickly while maintaining quality feedback.

