FIGMA AI DESIGN PROMPT: Teacher Reports & Analytics Dashboard
Design a comprehensive, data-rich UI for a Teacher Reports and Analytics Dashboard to help teachers track student performance, course statistics, and teaching effectiveness. Use a professional color scheme with primary blue (#2563EB), success green (#10B981), warning amber (#F59E0B), danger red (#EF4444), and neutral grays.

1. MAIN REPORTS DASHBOARD (Overview)
Components needed:

Page header with title "Báo cáo & Thống kê" and date range selector
Quick navigation tabs:
Tổng quan (Overview)
Tiến độ học sinh (Student Progress)
Phân tích kết quả (Results Analysis)
Xuất báo cáo (Export Reports)
Key metrics cards (4 columns):
Total students count (with trend indicator)
Active courses count
Assignments completed rate (%)
Average class score
Quick stats row:
Submissions graded this week
Pending submissions count (orange badge)
Recent grading activity
Average grading time (minutes)
Charts section (2 columns):
LEFT: Line chart "Student performance over time" (last 30 days)
RIGHT: Donut chart "Submissions by status" (graded/pending/in_progress)
Recent activity feed:
Student completed test
New submission received
Class average improved
Timestamps and links
Quick actions panel:
"Xem báo cáo lớp"
"Phân tích bài thi"
"Xuất báo cáo PDF"
2. CLASS REPORT PAGE (Detailed)
Components needed:

Breadcrumb: Báo cáo > Báo cáo lớp > [Class Name]
Class info header:
Class name and code
Total students
Teacher name
Date range filter
Exam filter dropdown
Export button (PDF/Excel)
Statistics overview cards:
Total students
Students with submissions
Participation rate (%) with progress bar
Average score (large number with color coding)
Highest score
Lowest score
Pass rate (%) with trend
Score distribution chart:
Bar chart showing ranges:
90-100 (Excellent - green)
80-89 (Good - blue)
70-79 (Average - yellow)
60-69 (Pass - orange)
0-59 (Fail - red)
Student count for each range
Exam performance table:
Columns: Exam title, Type, Submissions, Avg score, Pass rate, Highest, Lowest
Sortable columns
Color-coded scores
Link to detailed exam analysis
Student rankings table:
Rank number (with medal icons for top 3)
Student avatar and name
Submissions count
Average score
Highest score
Total points
Trend indicator (↑↓)
Link to student detail
Question analysis section:
Table showing difficult questions:
Question number
Question text (truncated)
Type badge
Total attempts
Correct attempts
Success rate (%)
Difficulty badge (Easy/Medium/Hard)
Color coding: Green >80%, Yellow 50-80%, Red <50%
3. STUDENT PROGRESS REPORT
Components needed:

Page title "Tiến độ học sinh"
Filter bar:
Class dropdown
Course dropdown
Date range picker
Search student
Student list with progress cards:
Each card showing:
Student avatar and name
Class badge
Progress metrics:
Tests completed / Total assigned
Progress bar
Average score (color-coded)
Last activity date
Attendance rate (if available)
Performance trend chart (sparkline)
"Xem chi tiết" button
Bulk actions:
Select students
"Xuất báo cáo hàng loạt"
"Gửi thông báo"
4. INDIVIDUAL STUDENT DETAIL REPORT
Components needed:

Student header:
Large avatar
Student name and ID
Contact info (phone, email)
Class and course info
Overall GPA/Average score
Performance summary cards:
Tests completed
Average score
Highest score
Improvement rate (%)
Attendance rate
Submission on-time rate
Performance timeline:
Line chart showing score progression over time
X-axis: Test dates
Y-axis: Scores
Markers for each test
Trend line
Test history table:
Test name
Date taken
Score
Status badge
Time spent
Attempt number
Link to submission detail
Strengths & Weaknesses analysis:
Skills breakdown (Reading, Writing, Listening, Speaking)
Radar chart showing performance by skill
Question types analysis
Recommendations section
Activity log:
Timeline of student activities
Test started/completed
Submissions
Grades received
5. EXAM ANALYSIS REPORT
Components needed:

Page title "Phân tích bài thi: [Exam Title]"
Exam info card:
Exam title and type
Total questions
Duration
Created date
Total submissions
Overall statistics cards:
Average score
Highest score
Lowest score
Pass rate (%)
Completion rate (%)
Average time spent
Score distribution histogram:
Bar chart showing score ranges
Number of students in each range
Percentage labels
Question-by-question analysis table:
Question number
Question type
Points possible
Average points earned
Success rate (%)
Time spent (avg)
Difficulty indicator
Most common wrong answer
Color coding for difficulty
Performance by section (if applicable):
Section name
Questions count
Average score
Success rate
Bar chart comparison
Top performers list:
Rank
Student name
Score
Time taken
Attempt number
6. GRADING STATISTICS PAGE
Components needed:

Page title "Thống kê chấm bài"
Overview metrics:
Total submissions
Graded submissions (green)
Pending submissions (orange)
Grading completion rate (%)
Recent grading activity (last 7 days)
Average grading time per submission
Charts section:
Pie chart: "Submissions by status"
Bar chart: "Average scores by exam type" (IELTS, VSTEP, Cambridge)
Line chart: "Grading activity over time"
Scores by exam type table:
Exam type
Submissions count
Average score
Highest score
Lowest score
Pass rate
Grading efficiency metrics:
Fastest grading time
Slowest grading time
Average time per question type
Auto-graded vs manual-graded ratio
7. COURSE STATISTICS PAGE
Components needed:

Page title "Thống kê khóa học: [Course Name]"
Course info header
Enrollment statistics:
Total enrolled
Active students
Completed students
Dropout rate
Enrollment trend chart (by month)
Revenue statistics (if applicable):
Total revenue
Average fee per student
Payment completion rate
Course timeline:
Start date
End date
Duration
Progress indicator
Days remaining
Student engagement metrics:
Average attendance rate
Assignment completion rate
Test participation rate
Average score
Performance distribution:
Excellent students count
Good students count
Average students count
Needs improvement count
8. ASSIGNMENT STATISTICS PAGE
Components needed:

Page title "Thống kê giao bài"
Overview cards:
Total assignments
Class assignments
Individual assignments
Overdue assignments (red)
Assignments with deadlines
Recent assignments (last 7 days)
Assignments by exam chart:
Bar chart showing distribution
Exam title
Assignment count
Completion tracking:
Assignment title
Target (class/student)
Deadline
Completion rate (%)
Progress bar
Status
9. EXPORT REPORT MODAL
Components needed:

Modal titled "Xuất báo cáo"
Report type selection (radio buttons):
Báo cáo lớp học
Báo cáo học sinh cá nhân
Phân tích bài thi
Thống kê tổng quan
Options section:
Date range picker
Class/Student selector (based on type)
Include charts checkbox
Include detailed data checkbox
Include recommendations checkbox
Format selection:
PDF (default)
Excel
CSV
Preview button
Action buttons: "Hủy" and "Xuất báo cáo" (blue)
Progress bar when generating
10. TRENDS & INSIGHTS PANEL
Components needed:

Collapsible panel titled "Xu hướng & Nhận xét"
Insights cards:
"Điểm trung bình tăng 15% so với tháng trước" (green, up arrow)
"3 học sinh cần hỗ trợ thêm" (orange, warning icon)
"Câu hỏi số 5 có tỷ lệ sai cao nhất" (red, info icon)
"Lớp A1 có tiến bộ vượt trội" (blue, star icon)
Recommendations section:
AI-generated suggestions
Action items
"Đánh dấu đã xử lý" checkbox
11. COMPARISON VIEW
Components needed:

Page title "So sánh kết quả"
Comparison selector:
Compare by: Classes / Students / Exams / Time periods
Select items to compare (multi-select)
Side-by-side comparison cards:
Key metrics for each item
Color-coded performance indicators
Difference percentages
Comparison charts:
Bar chart comparing averages
Line chart showing trends
Radar chart for multi-dimensional comparison
Winner/Best performer highlight
DESIGN REQUIREMENTS:
Use data visualization best practices
Implement color-coded performance indicators consistently
Add interactive charts with hover tooltips
Include export functionality for all reports
Use responsive grid layouts
Add loading states for data fetching
Implement date range filters throughout
Use icons from Heroicons or Lucide
Add print-friendly styles
Include empty states with helpful messages
Use progressive disclosure for detailed data
Add comparison features
COLOR PALETTE:
Primary: #2563EB (blue)
Success/High: #10B981 (green)
Warning/Medium: #F59E0B (amber)
Danger/Low: #EF4444 (red)
Info: #3B82F6 (light blue)
Gray scale: #F9FAFB, #E5E7EB, #9CA3AF, #6B7280, #374151
CHART TYPES TO USE:
Line charts for trends over time
Bar charts for comparisons
Pie/Donut charts for distributions
Radar charts for multi-dimensional data
Sparklines for inline trends
Histograms for score distributions
TYPOGRAPHY:
Headers: Bold, 24-32px
Metrics (large numbers): Bold, 36-48px
Body text: Regular, 14-16px
Small text: 12-14px
Design should feel like a professional analytics dashboard (similar to Google Analytics or Tableau), helping teachers make data-driven decisions about their teaching and student support.