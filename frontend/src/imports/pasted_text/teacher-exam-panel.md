DESIGN PROMPT: Teacher Panel - Exam Bank / Assessment (4 Pages)
Context
Design 4 pages for the "Ngân hàng đề" (Exam Bank) section in Teacher Panel. Based on backend with Exam model (eTitle, eType, eSkill, eDuration_minutes, eIs_private, eSource_type) and ExamTemplate system (VSTEP, IELTS, Cambridge).

PAGE 1: Tất cả đề thi (All Exams List)
Layout
Header Section:

Page title: "Ngân hàng đề thi" (large, bold)
Breadcrumb: Dashboard > Ngân hàng đề > Tất cả đề thi
Action buttons (right aligned):
"Tạo đề mới" button (primary blue, with + icon)
"Từ mẫu đề" button (secondary, with template icon)
View toggle: Grid/List
Stats Cards Row (4 cards):

Total exams (with document icon, number)
Published exams (green accent)
Draft exams (orange accent)
Total questions across all exams (blue accent)
Filter & Search Bar:

Search box (placeholder: "Tìm theo tên đề thi...")
Filter dropdowns:
Type: All/VSTEP/IELTS/Cambridge/General
Skill: All/Listening/Reading/Writing/Speaking
Status: All/Draft/Published/Private
Source: All/Manual/Template/Upload
Sort by: Name/Date/Questions/Duration (dropdown)
"Lọc" button, "Xóa bộ lọc" link
Exam Cards Grid (or Table):

Grid View (3 columns):

Card design:
Type badge (top-left corner): VSTEP/IELTS/Cambridge chip
Skill icon (top-right): 🎧 Listening / 📖 Reading / ✍️ Writing / 🗣️ Speaking
Exam title (bold, 18px)
Description (2 lines, truncated)
Info row with icons:
⏱️ Duration: "90 minutes"
📝 Questions: "40 questions"
🎯 Points: "100 points"
📅 Created: "Mar 15, 2026"
Status badge: Draft/Published/Private
Source badge: Manual/Template/Upload
Progress indicator (if from template):
"25/40 questions completed"
Progress bar
Quick stats:
Assignments: "5 lớp"
Submissions: "120 bài nộp"
Avg score: "75/100"
Action buttons:
"Xem chi tiết" (primary)
"Chỉnh sửa" (secondary)
More menu (3 dots):
Preview
Clone
Assign to class
Publish/Unpublish
Delete
Hover: Lift shadow, show quick preview
List View (Table):

Columns: Checkbox | Tên đề thi | Loại | Kỹ năng | Thời gian | Số câu hỏi | Trạng thái | Nguồn | Ngày tạo | Actions
Row actions: View, Edit, Preview, Clone, Assign, Delete
Bulk actions: Publish, Unpublish, Delete, Export
Sortable columns
Color-coded status badges
Tabs (alternative layout):

All exams
My exams (created by me)
From templates
Shared with me (if collaboration feature)
Pagination:

Show 12/24/48 per page (grid), 10/25/50 (list)
Page numbers, total count
Empty State:

Illustration of exam papers
"Chưa có đề thi nào"
Two buttons: "Tạo đề mới" and "Chọn từ mẫu đề"
Features:

Quick preview modal (hover or click)
Duplicate/Clone with one click
Drag-to-reorder (optional)
Export exam to PDF/Word
Share exam with other teachers
Responsive: 1 column mobile, 2 tablet, 3 desktop
PAGE 2: Tạo đề mới (Create New Exam)
Layout
Header:

Page title: "Tạo đề thi mới"
Breadcrumb: Dashboard > Ngân hàng đề > Tạo đề mới
Back button
Auto-save indicator
Progress indicator: "Bước 1/3: Thông tin cơ bản"
Step Wizard (3 steps):

STEP 1: Thông tin cơ bản (Basic Info)
Form Container:

Section 1: Loại đề thi

Radio cards with icons (large, visual):
🎯 VSTEP (B1, B2, C1)
🌍 IELTS (Academic/General)
📚 Cambridge (KET, PET, FCE, CAE, CPE)
📄 General (Custom exam)
Each card shows: Icon, Name, Description, Typical duration
Section 2: Kỹ năng

Radio cards (horizontal):
🎧 Listening
📖 Reading
✍️ Writing
🗣️ Speaking
Helper text: "Chọn kỹ năng chính cho đề thi này"
Section 3: Thông tin đề thi

Exam title (required, text input, max 255 chars)
Placeholder: "VD: VSTEP B2 Listening - Practice Test 1"
Description (rich text editor, optional)
Toolbar: Bold, Italic, List, Link
Character counter
Duration (required, number input with unit selector)
Input: Number
Unit dropdown: Minutes/Hours
Helper: "Thời gian làm bài"
Difficulty level (dropdown):
Easy / Medium / Hard / Expert
Tags (multi-input chips):
For categorization
Suggestions based on type/skill
Section 4: Cài đặt

Visibility (radio):
🌐 Public - "Hiển thị cho tất cả giáo viên"
🔒 Private - "Chỉ mình tôi"
Source type (auto-set, display only):
Manual creation
Allow preview (toggle):
Students can preview before starting
Action Buttons:

"Hủy" (secondary, left)
"Lưu nháp" (outline)
"Tiếp tục" (primary, right) → Go to Step 2
STEP 2: Thêm câu hỏi (Add Questions)
Question Builder Interface:

Left Panel: Question List (30% width)

List of added questions
Each item shows:
Question number
Question type icon
First line of question text
Points
Drag handle for reordering
Click to edit
Delete button
Total: "25 câu hỏi, 100 điểm"
Right Panel: Question Editor (70% width)

Add Question Button (top):

"+ Thêm câu hỏi" button
Dropdown menu:
Multiple choice
True/False
Fill in the blank
Short answer
Essay
Matching
Listening (with audio)
Speaking (with recording)
Question Form (when adding/editing):

Question number (auto, display only): "Câu 1"
Question type (dropdown, selected from menu)
Question content (rich text editor):
Support for images, audio, video
Formatting toolbar
Media upload area
Points (number input, default 1)
For Listening questions:
Audio file upload (drag-drop)
Play limit (number input, default 2)
Transcript (textarea, optional)
For Reading questions:
Passage text (textarea)
Reading time (optional)
Answers Section (varies by question type):

Multiple Choice:

Add answer button
Each answer:
Radio button (mark as correct)
Answer text (input)
Remove button
Minimum 2, maximum 6 answers
Must have exactly 1 correct answer
True/False:

Radio buttons: True / False
Select correct answer
Fill in the Blank:

Correct answer(s) (text input)
Allow multiple correct answers (toggle)
Case sensitive (toggle)
Short Answer:

Sample answer (textarea)
Grading rubric (optional)
Essay:

Min words (number input)
Max words (number input)
Grading rubric (textarea)
Sample answer (optional)
Additional Settings (collapsible):

Explanation (textarea): Show after submission
Difficulty (dropdown): Easy/Medium/Hard
Tags (multi-input)
Time limit per question (optional)
Question Actions:

"Hủy" (cancel edit)
"Lưu câu hỏi" (save question)
"Lưu & Thêm tiếp" (save and add another)
Bulk Import Option:

"Nhập hàng loạt" button
Opens modal:
Upload Excel/CSV template
Download template link
Paste JSON format
Import from question bank (if feature exists)
Action Buttons (bottom):

"Quay lại" (go to Step 1)
"Lưu nháp" (save draft)
"Tiếp tục" (go to Step 3) - disabled if no questions
STEP 3: Xem trước & Xuất bản (Preview & Publish)
Preview Panel:

Exam Summary Card:

Exam title
Type & Skill badges
Duration
Total questions
Total points
Status: Draft
Questions Preview:

Accordion list of all questions
Each question shows:
Question number & type
Question content (truncated)
Points
Number of answers
Expand to see full question & answers
"Chỉnh sửa" button on each question
Statistics:

Questions by type (pie chart)
Points distribution (bar chart)
Estimated completion time
Preview as Student:

"Xem như học sinh" button
Opens full-screen preview
Shows exam exactly as students will see
Timer simulation
Can navigate through questions
Exit preview button
Publish Options:

Publish now (radio, default)
Save as draft (radio)
Schedule publish (radio):
Date & time picker
Notification settings (checkboxes):
Notify students
Notify other teachers
Send email
Action Buttons:

"Quay lại" (go to Step 2)
"Lưu nháp" (save as draft)
"Xuất bản" (publish exam) - primary, large
Success Modal:

Success animation
"Đề thi đã được xuất bản!"
Exam summary
Action buttons:
"Xem đề thi"
"Giao bài thi"
"Tạo đề thi khác"
"Về danh sách"
Features:

Real-time validation
Auto-save every 30 seconds
Warn if leaving page with unsaved changes
Duplicate question detection
Point calculation validation
Preview mode with student view
Export to PDF/Word before publishing
PAGE 3: Mẫu đề thi (Exam Templates)
Layout
Header:

Page title: "Mẫu đề thi"
Breadcrumb: Dashboard > Ngân hàng đề > Mẫu đề thi
Back button
Info icon with tooltip: "Chọn mẫu đề thi chuẩn để tạo đề nhanh chóng"
Template Categories (Tabs or Sections):

Tab 1: Cambridge Young Learners
Template Cards:
Pre A1 Starters
A1 Movers
A2 Flyers
Each card shows:
Template name & level
Age group: "7-12 years old"
Skills: Listening, Reading & Writing, Speaking
Duration: "45-60 minutes"
Structure preview: "3 parts, 25 questions"
"Xem chi tiết" and "Sử dụng mẫu" buttons
Tab 2: Cambridge Main Suite
Template Cards:
A2 Key (KET)
B1 Preliminary (PET)
B2 First (FCE)
C1 Advanced (CAE)
C2 Proficiency (CPE)
Each card shows similar info as above
Tab 3: International Tests
VSTEP Templates:
VSTEP B1
VSTEP B2
VSTEP C1
IELTS Templates:
IELTS Academic
IELTS General Training
Each with full structure details
Tab 4: Specialized
Custom templates created by admin

School-specific templates

Template Card Design:

Large icon/badge for template type
Template name (bold, large)
Level badge (color-coded)
Age group indicator
Skills covered (icons)
Duration
Structure summary:
Number of sections
Number of parts
Total questions
Total points
"Xem chi tiết" button (secondary)
"Sử dụng mẫu" button (primary)
Hover: Show quick preview of structure
Template Detail Modal:

Triggered by "Xem chi tiết"
Shows:
Full template description
Detailed structure (sections, parts, question types)
Sample questions (if available)
Duration breakdown by section
Grading criteria
Official resources/links
"Đóng" and "Sử dụng mẫu" buttons
Use Template Flow:

Click "Sử dụng mẫu"
Opens modal:
Exam title (required, pre-filled with template name)
Description (optional, pre-filled)
Customize duration (toggle):
If enabled, show duration input
Default: template duration
Visibility: Public/Private
"Hủy" and "Tạo đề thi" buttons
Creates exam with template structure
Redirects to exam editor with sample questions
User can edit/replace sample questions
Filter & Search:

Search templates by name
Filter by:
Category
Level
Age group
Skills
Sort by: Name/Level/Popularity
Empty State (if no templates):

"Chưa có mẫu đề thi nào"
"Liên hệ quản trị viên để thêm mẫu đề"
Features:

Template preview with full structure
One-click exam creation from template
Customizable duration
Sample questions included
Official exam format compliance
Responsive grid layout
PAGE 4: Đề thi của tôi (My Exams)
Layout
Header:

Page title: "Đề thi của tôi"
Breadcrumb: Dashboard > Ngân hàng đề > Đề thi của tôi
Action buttons:
"Tạo đề mới" button
"Từ mẫu đề" button
View toggle: Grid/List
Filter Tabs:

All (show count)
Published (show count)
Draft (show count)
Private (show count)
Secondary Filters:

Type: All/VSTEP/IELTS/Cambridge
Skill: All/Listening/Reading/Writing/Speaking
Date range picker
Sort by: Recent/Name/Most used/Highest score
Exam Cards (similar to Page 1 but with more actions):

Same card design as "All Exams"
Additional info:
Usage stats:
Times assigned: "12 lần"
Total submissions: "350 bài"
Average score: "78/100"
Completion rate: "95%"
Last modified: "2 days ago"
Created from: "VSTEP B2 Template" (if applicable)
Enhanced actions:
View details
Edit
Preview
Clone
Assign to class
View submissions
View analytics
Export
Archive
Delete
Exam Detail View (click on card):

Opens drawer or new page

Sections:

Overview:

Exam info (title, type, skill, duration)
Status badge
Created & modified dates
Description
Structure:

List of questions with:
Question number & type
Content preview
Points
Edit button
Total questions & points
"Chỉnh sửa cấu trúc" button
Usage Statistics:

Times assigned (with list of classes)
Total submissions
Score distribution (histogram)
Average score
Completion rate
Time spent (average)
"Xem chi tiết" link to analytics
Recent Activity:

Timeline of:
Assignments
Submissions
Edits
Comments (if feature exists)
Actions:

Edit exam
Preview
Clone
Assign to class
View all submissions
Export results
Archive
Delete
Bulk Actions (when exams selected):

Toolbar appears
"X đề thi đã chọn"
Actions:
Publish
Unpublish
Archive
Delete
Export
Change visibility
Analytics Dashboard (optional section):

Top performing exams (by avg score)
Most used exams (by assignments)
Recent activity chart
Question difficulty analysis
Student performance trends
Empty State:

"Bạn chưa tạo đề thi nào"
Illustration
Two buttons: "Tạo đề mới" and "Chọn từ mẫu đề"
Features:

Quick edit mode (inline editing)
Batch operations
Advanced filtering
Usage analytics
Export to various formats
Archive instead of delete
Restore archived exams
Duplicate detection
Version history (optional)
Collaborative editing (optional)
Common Design Specifications (All 4 Pages)
Visual Design
Color Palette:

Primary: #2563EB (blue)
Success: #10B981 (green)
Warning: #F59E0B (orange)
Error: #EF4444 (red)
Info: #8B5CF6 (purple)
Neutral: #6B7280 (gray)
Type Badges:

VSTEP: Blue (#2563EB)
IELTS: Green (#10B981)
Cambridge: Purple (#8B5CF6)
General: Gray (#6B7280)
Skill Icons:

Listening: 🎧 (blue)
Reading: 📖 (green)
Writing: ✍️ (orange)
Speaking: 🗣️ (purple)
Typography:

Headings: Inter, 24-32px, bold
Subheadings: 18-20px, semibold
Body: 14-16px, regular
Small: 12-13px, medium
Spacing:

Base: 4px
Common: 8px, 12px, 16px, 24px, 32px
Card padding: 20-24px
Components
Cards: White bg, border-radius 12px, shadow-sm
Buttons: Height 40-44px, border-radius 8px
Inputs: Height 40px, border-radius 6px
Badges: Pill shape, 6px padding
Step wizard: Progress bar, numbered steps
Interactions
Transitions: 200-300ms ease-in-out
Hover: Lift shadow, scale 1.02
Loading: Skeleton screens, spinners
Success: Toast notifications
Errors: Inline validation, modals
Confirmations: Modals for destructive actions
Auto-save: Every 30 seconds with indicator
Responsive
Desktop (>1280px): Full layout, 3 columns
Laptop (1024-1280px): 2 columns
Tablet (768-1024px): 2 columns, stack sections
Mobile (<768px): Single column, simplified
Accessibility
WCAG 2.1 AA compliant
Keyboard navigation
Screen reader labels
Focus indicators
Color contrast 4.5:1+
Alt text for icons