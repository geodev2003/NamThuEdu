FIGMA AI DESIGN PROMPT: Real-Time Test Monitoring & Supervision System
Design a modern, dynamic UI for a Real-Time Test Monitoring and Supervision System for teachers to monitor students during live exams. Use a professional color scheme with primary blue (#2563EB), success green (#10B981), warning amber (#F59E0B), danger red (#EF4444), and neutral grays. The design should feel like a mission control center with live data updates.

1. LIVE MONITORING DASHBOARD (Main View)
Components needed:

Page header with title "Giám sát trực tiếp" and live indicator (pulsing green dot with "LIVE")
Quick stats cards row:
Active students count (with live counter animation)
Total sessions today
Average completion rate
Connection issues count (red if > 0)
Filter bar:
Dropdown: Filter by exam
Dropdown: Filter by class
Toggle: Show only active sessions
Search: Student name/ID
Grid view of active test sessions (auto-refresh every 5 seconds):
Each student card showing:
Student avatar and name
Exam title badge
Connection status indicator (green dot = connected, red dot = disconnected, yellow = unstable)
Time elapsed / Time remaining (countdown timer)
Progress bar showing answered questions (e.g., "15/30 câu")
Last activity timestamp
Quick action buttons: "Xem chi tiết", "Gửi tin nhắn", "Xem log"
Warning icon if connection issues detected
View toggle: Grid view / List view / Map view (optional)
Auto-refresh indicator: "Cập nhật 3 giây trước"
Empty state: "Không có học sinh nào đang thi"
2. STUDENT DETAIL MONITORING MODAL (Full Screen)
Components needed:

Modal header with:
Student info (avatar, name, ID, phone)
Exam title
Connection status badge (large, animated)
Close button
Top metrics row:
Start time
Time elapsed (live counter)
Time remaining (countdown with color change when < 10 min)
Questions answered
Connection quality indicator (signal bars)
Connection timeline (horizontal):
Visual timeline showing connection/disconnection events
Green segments = connected
Red segments = disconnected
Timestamps on hover
Connection statistics panel:
Total connections count
Total disconnections count
Last seen timestamp (live update)
Average connection duration
Answers submitted count
Activity feed (scrollable, real-time):
Each activity item showing:
Icon (answer saved, connected, disconnected, etc.)
Activity description
Timestamp
Auto-scroll to latest
Quick actions panel:
"Gửi tin nhắn" button (primary)
"Xem chi tiết bài làm" button
"Xuất báo cáo" button
Live answer progress (optional):
Grid showing all questions
Green = answered
Gray = not answered
Question numbers
3. SEND MESSAGE TO STUDENT MODAL
Components needed:

Modal titled "Gửi tin nhắn cho học sinh"
Student info display (name, current exam)
Message templates dropdown:
"Chúc bạn làm bài tốt!"
"Còn 15 phút nữa hết giờ"
"Hãy kiểm tra lại bài làm"
"Tùy chỉnh..."
Message textarea (max 500 characters)
Character counter
Preview of how message will appear to student
Send options:
Checkbox: "Hiển thị dưới dạng thông báo"
Checkbox: "Phát âm thanh"
Action buttons: "Hủy" and "Gửi tin nhắn" (blue)
Success toast after sending
4. CONNECTION LOGS DETAIL PAGE
Components needed:

Breadcrumb: Giám sát > [Student Name] > Lịch sử kết nối
Student and exam info card at top
Summary statistics cards:
Total connection time
Total disconnection time
Connection stability score (%)
Number of reconnection attempts
Connection events table:
Columns: Event type, Timestamp, Duration, Status, Details
Event type icons and colors:
Connected (green)
Disconnected (red)
Reconnected (yellow)
Answer saved (blue)
Expandable rows for detailed info
Connection quality chart:
Line chart showing connection stability over time
X-axis: Time
Y-axis: Connection quality (0-100%)
Highlight disconnection periods in red
Export button: "Xuất báo cáo PDF"
5. TEST STATISTICS REAL-TIME PAGE
Components needed:

Page title "Thống kê bài thi: [Exam Title]"
Live indicator (pulsing)
Overview cards:
Students started
Students in progress
Students completed
Average score (if any completed)
Average time spent
Real-time charts (auto-update):
Line chart: "Students active over time"
Bar chart: "Questions answered distribution"
Pie chart: "Connection status breakdown"
Question difficulty analysis:
Table showing each question with:
Question number
Attempts count
Correct answers count
Success rate (%)
Average time spent
Difficulty indicator badge
Student progress table:
Student name
Progress bar
Time elapsed
Connection status
Current question
Link to monitor detail
6. ACTIVE SESSIONS LIST VIEW
Components needed:

Table header with sortable columns:
Student (name + avatar)
Exam
Status (badge)
Start time
Time remaining (countdown)
Progress (visual bar)
Connection (status indicator)
Actions
Row actions:
Eye icon: View details
Message icon: Send message
Log icon: View connection logs
Bulk actions toolbar:
"Gửi tin nhắn hàng loạt"
"Xuất danh sách"
Status filters (chips):
All
Connected (green)
Disconnected (red)
Completed (blue)
Live update indicator at top
7. BROADCAST MESSAGE MODAL
Components needed:

Modal titled "Gửi tin nhắn hàng loạt"
Target selection:
Radio buttons:
"Tất cả học sinh đang thi"
"Chỉ học sinh của bài thi cụ thể"
"Chọn học sinh thủ công"
If manual: Checkbox list of active students
Message composer:
Template dropdown
Textarea for custom message
Character counter
Delivery options:
Priority level (normal/urgent)
Display type (notification/alert/banner)
Auto-dismiss after X seconds
Preview section showing selected students count
Action buttons: "Hủy" and "Gửi cho [X] học sinh"
8. CONNECTION ALERTS PANEL (Sidebar)
Components needed:

Collapsible sidebar titled "Cảnh báo kết nối"
Alert counter badge (red if > 0)
Alert list (scrollable):
Each alert card showing:
Alert icon (warning/error)
Student name
Issue description (e.g., "Mất kết nối 5 phút")
Timestamp
"Xem chi tiết" link
"Đã xử lý" checkbox
Filter by severity:
Critical (red)
Warning (yellow)
Info (blue)
"Xóa tất cả đã xử lý" button at bottom
9. EXAM SESSION CONTROL PANEL
Components needed:

Floating action panel (bottom right):
"Tạm dừng tất cả" button (with confirmation)
"Gia hạn thời gian" button
"Kết thúc sớm" button (red, with confirmation)
"Gửi thông báo" button
Each action opens a confirmation modal
Only visible when there are active sessions
10. REAL-TIME NOTIFICATIONS TOAST
Components needed:

Toast notifications (top right):
Student connected (green)
Student disconnected (red)
Student completed test (blue)
Connection issue detected (yellow)
Auto-dismiss after 5 seconds
Click to view details
Sound notification option (toggle in settings)
DESIGN REQUIREMENTS:
Use live data indicators (pulsing dots, animated counters)
Implement color-coded status system consistently
Add smooth transitions for data updates
Use WebSocket connection indicator in header
Include auto-refresh timers
Add loading skeletons for data fetching
Implement responsive grid layouts
Use icons from Heroicons or Lucide
Add tooltips for all monitoring metrics
Include keyboard shortcuts for quick actions
Use sound alerts for critical events (optional toggle)
Implement dark mode support for long monitoring sessions
COLOR PALETTE:
Primary: #2563EB (blue)
Success/Connected: #10B981 (green)
Warning/Unstable: #F59E0B (amber)
Danger/Disconnected: #EF4444 (red)
Info: #3B82F6 (light blue)
Gray scale: #F9FAFB, #E5E7EB, #9CA3AF, #6B7280, #374151
ANIMATION & INTERACTIONS:
Pulsing animation for "LIVE" indicators
Smooth countdown timers
Real-time progress bar updates
Connection status transitions
Toast slide-in animations
Auto-scroll for activity feeds
Hover effects on student cards
ACCESSIBILITY:
High contrast for status indicators
Screen reader support for live updates
Keyboard navigation for all actions
ARIA labels for dynamic content
Design should feel like a professional monitoring dashboard with real-time updates, helping teachers supervise multiple students simultaneously during live exams.

