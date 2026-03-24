FIGMA AI DESIGN PROMPT: Practice Session Management System
Design a modern, intuitive UI for a Practice Session Management System for teachers to create and manage practice exercises for students. Use a clean color scheme with primary blue (#2563EB), success green (#10B981), warning amber (#F59E0B), purple (#8B5CF6) for practice mode, and neutral grays.

1. PRACTICE SESSIONS LIST PAGE (Main Dashboard)
Components needed:

Page header with title "Bài luyện tập" and "Tạo bài luyện tập" button (primary blue)
Quick stats cards row:
Total practice sessions count
Active sessions (green badge)
Sessions this week
Average completion rate (%)
Filter bar with:
Dropdown: Filter by type (topic-based/template-based/random/all)
Dropdown: Filter by skill (listening/reading/writing/speaking/all)
Dropdown: Filter by purpose (review/practice/drill/mock_test/homework)
Dropdown: Filter by difficulty (easy/medium/hard/mixed)
Search input for title
View toggle: Grid view / List view
Practice sessions grid (3 columns):
Each card showing:
Practice type badge (topic/template/random with different colors)
Title
Skill icon and label
Difficulty badge (color-coded: green=easy, yellow=medium, red=hard)
Purpose tag
Duration and question count
Created date
Usage stats (if assigned)
Quick actions: View, Edit, Assign, Delete
Pagination at bottom
Empty state: "Chưa có bài luyện tập nào"
2. CREATE PRACTICE SESSION MODAL (3-Step Wizard)
Step 1: Choose Creation Method

Components needed:

Modal titled "Tạo bài luyện tập mới"
Three large option cards (radio selection):
CARD 1: "Theo chủ đề" (Topic-Based)
Icon: Book/Topic icon
Description: "Tạo bài luyện tập tập trung vào chủ đề cụ thể"
Badge: "Phổ biến"
CARD 2: "Từ template" (Template-Based)
Icon: Template/Document icon
Description: "Sử dụng cấu trúc có sẵn từ TOEIC, IELTS, VSTEP"
Badge: "Nhanh chóng"
CARD 3: "Ngẫu nhiên" (Random)
Icon: Shuffle/Random icon
Description: "Tạo bài luyện tập với câu hỏi ngẫu nhiên"
Badge: "Đa dạng"
Navigation: "Hủy" and "Tiếp tục" button
Step 2A: Topic-Based Configuration

Components needed:

Progress indicator: Step 2/3
Form fields:
Title input (required)
Description textarea
Skill selector (radio buttons with icons):
Listening (headphone icon)
Reading (book icon)
Writing (pen icon)
Speaking (microphone icon)
Topic input/dropdown (required):
Grammar
Vocabulary
Pronunciation
Comprehension
Custom (text input)
Difficulty selector (radio buttons):
Easy (green)
Medium (yellow)
Hard (red)
Duration slider (5-180 minutes)
Question count slider (5-50 questions)
Purpose dropdown:
Review
Practice
Drill
Mock test
Homework
Exam type dropdown (optional):
VSTEP
IELTS Academic
IELTS General
General
Private toggle switch
Navigation: "Quay lại" and "Tiếp tục"
Step 2B: Template-Based Configuration

Components needed:

Progress indicator: Step 2/3
Template selection:
Search/filter templates
Template cards grid showing:
Template name
Category badge (TOEIC/IELTS/VSTEP)
Level indicator
Duration
Skills covered
Preview button
Selected template highlight
Customization options:
Title input (auto-filled from template)
Description textarea
Skill filter (if template has multiple)
Difficulty override
Question count adjustment
Duration adjustment
Purpose dropdown
Navigation: "Quay lại" and "Tiếp tục"
Step 2C: Random Configuration

Components needed:

Progress indicator: Step 2/3
Form fields:
Title input
Description textarea
Skill selector (radio buttons)
Difficulty selector with "Mixed" option
Duration slider
Question count slider
Exam type dropdown
Purpose dropdown
Advanced options (collapsible):
Question type preferences (checkboxes)
Topic exclusions
Minimum/maximum difficulty per question
Navigation: "Quay lại" and "Tiếp tục"
Step 3: Review & Create

Components needed:

Progress indicator: Step 3/3
Summary card showing:
Practice type
Title
Skill and difficulty
Duration and question count
Purpose
Estimated generation time
Preview section:
"Xem trước cấu trúc" button
Shows question distribution
Options:
Checkbox: "Tạo và giao ngay cho lớp/học sinh"
If checked: Class/student selector appears
Action buttons: "Quay lại" and "Tạo bài luyện tập" (blue, loading state)
3. PRACTICE SESSION DETAIL PAGE
Components needed:

Breadcrumb: Bài luyện tập > [Session Title]
Header section:
Title (editable inline)
Type badge
Skill icon and label
Difficulty badge
Created date
Action buttons: Edit, Assign, Clone, Delete
Info cards row:
Duration
Question count
Purpose
Exam type
Times assigned
Completion rate (if assigned)
Questions preview section:
Tabs by section/part (if applicable)
Question list showing:
Question number
Question type
Points
Preview of content (truncated)
"Xem chi tiết" link
"Chỉnh sửa câu hỏi" button
Usage statistics (if assigned):
Students assigned count
Average score
Completion rate
Time spent (average)
Related sessions section:
Similar practice sessions
"Tạo bài tương tự" button
4. TEMPLATE LIBRARY MODAL
Components needed:

Modal titled "Chọn template"
Filter sidebar:
Category filter (TOEIC/IELTS/VSTEP/Cambridge/General)
Level filter (Beginner/Intermediate/Advanced)
Skill filter (checkboxes)
Duration range slider
Template grid (2-3 columns):
Each card showing:
Template name
Category badge
Level indicator
Duration
Skills icons
Total questions
Description (truncated)
"Xem chi tiết" and "Chọn" buttons
Template detail view (when clicked):
Full description
Structure breakdown (sections/parts)
Question distribution
Sample questions preview
"Sử dụng template" button
Search bar at top
Pagination
5. PRACTICE STATISTICS PAGE
Components needed:

Page title "Thống kê luyện tập"
Date range selector
Overview cards:
Total practice sessions created
Total sessions assigned
Average completion rate
Most popular skill
Most used type
Charts section:
Bar chart: "Practice sessions by type"
Pie chart: "Sessions by skill"
Line chart: "Creation trend over time"
Bar chart: "Sessions by difficulty"
Popular topics table:
Topic name
Sessions count
Average score
Completion rate
Usage by purpose:
Purpose type
Sessions count
Student engagement
Export button: "Xuất báo cáo"
6. ASSIGN PRACTICE MODAL
Components needed:

Modal titled "Giao bài luyện tập"
Practice session info display (title, type, duration)
Target selection:
Radio buttons: "Giao cho lớp" / "Giao cho học sinh"
If class: Dropdown list of classes
If student: Searchable multi-select of students
Assignment settings:
Deadline date-time picker
Max attempts input (default: unlimited)
Auto-grade toggle
Show answers after completion toggle
Notification options:
Checkbox: "Gửi thông báo ngay"
Checkbox: "Gửi nhắc nhở trước deadline"
Preview: "Sẽ giao cho X học sinh"
Action buttons: "Hủy" and "Giao bài" (blue)
7. QUICK CREATE PANEL (Floating)
Components needed:

Floating action button (bottom right): "+" icon
On click, expands to show quick options:
"Tạo theo chủ đề" (fast form)
"Từ template" (opens template library)
"Ngẫu nhiên" (fast form)
"Nhân bản bài cũ" (shows recent sessions)
Each option opens a streamlined creation flow
8. PRACTICE TYPE BADGES & ICONS
Components needed:

Consistent badge design for types:
Topic-Based: Purple badge with book icon
Template-Based: Blue badge with document icon
Random: Orange badge with shuffle icon
Skill icons:
Listening: Headphone icon
Reading: Book icon
Writing: Pen icon
Speaking: Microphone icon
Difficulty indicators:
Easy: Green badge with 1 star
Medium: Yellow badge with 2 stars
Hard: Red badge with 3 stars
Mixed: Gray badge with shuffle icon
9. BULK ACTIONS PANEL
Components needed:

Appears when sessions selected (checkbox)
Selected count display: "Đã chọn X bài"
Action buttons:
"Giao hàng loạt"
"Nhân bản"
"Xóa hàng loạt"
"Xuất danh sách"
"Bỏ chọn tất cả" link
10. PRACTICE SESSION PREVIEW MODAL
Components needed:

Modal titled "Xem trước bài luyện tập"
Session info header
Question preview (paginated):
Question number and type
Question content
Answer options (if multiple choice)
Correct answer indicator (for teacher)
Points
Navigation: Previous/Next question
"Chỉnh sửa" button for each question
"Đóng" button
DESIGN REQUIREMENTS:
Use card-based layouts with subtle shadows
Implement step-by-step wizard for creation
Add visual indicators for practice types
Include skill icons consistently
Use color-coded difficulty badges
Add loading states for generation
Implement responsive design (desktop and tablet)
Use icons from Heroicons or Lucide
Add tooltips for complex options
Include empty states with helpful messages
Add confirmation dialogs for destructive actions
Implement smooth transitions between steps
COLOR PALETTE:
Primary: #2563EB (blue)
Practice/Topic: #8B5CF6 (purple)
Template: #3B82F6 (light blue)
Random: #F59E0B (amber)
Success: #10B981 (green)
Warning: #F59E0B (amber)
Danger: #EF4444 (red)
Gray scale: #F9FAFB, #E5E7EB, #9CA3AF, #6B7280, #374151
SKILL COLOR CODING:
Listening: #3B82F6 (blue)
Reading: #10B981 (green)
Writing: #F59E0B (amber)
Speaking: #EF4444 (red)
DIFFICULTY COLOR CODING:
Easy: #10B981 (green)
Medium: #F59E0B (amber)
Hard: #EF4444 (red)
Mixed: #6B7280 (gray)
TYPOGRAPHY:
Headers: Bold, 24-32px
Card titles: Medium, 18-20px
Body text: Regular, 14-16px
Small text: 12-14px
Design should feel quick and efficient, helping teachers create practice sessions in under 2 minutes while maintaining flexibility for customization.