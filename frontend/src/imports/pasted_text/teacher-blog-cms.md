FIGMA AI DESIGN PROMPT: Teacher Blog & Content Management System
Design a modern, clean UI for a Blog and Content Management System for teachers to create, manage, and publish educational content. Use a professional color scheme with primary blue (#2563EB), success green (#10B981), warning amber (#F59E0B), danger red (#EF4444), and neutral grays.

1. BLOG LIST PAGE (Teacher's Content Dashboard)
Components needed:

Page header with title "Quản lý bài viết" and "Tạo bài viết mới" button (primary blue)
Quick stats cards row:
Total posts count
Active/Published posts (green badge)
Draft posts (gray badge)
Rejected posts (red badge)
Total views count
Total likes count
Filter and search bar:
Dropdown: Filter by status (all/active/draft/inactive)
Dropdown: Filter by type (grammar/tips/vocabulary)
Dropdown: Filter by category
Search input for title/content
Date range picker
Posts grid/list view toggle
Posts grid (3 columns):
Each post card showing:
Thumbnail image (with fallback)
Post title (truncated)
Post type badge (grammar/tips/vocabulary)
Category tag
Status badge (active/draft/inactive)
Author info (avatar + name)
Created date
View count icon + number
Like count icon + number
Quick actions dropdown: Edit, Delete, View, Duplicate
Pagination at bottom
Empty state: "Chưa có bài viết nào"
2. CREATE/EDIT POST PAGE
Components needed:

Page header with breadcrumb: Bài viết > Tạo mới / Chỉnh sửa
Two-column layout:
LEFT (Main content - 70%):
Post title input (large, prominent)
Rich text editor for content with toolbar:
Bold, Italic, Underline
Headings (H1, H2, H3)
Lists (bullet, numbered)
Links, Images
Code blocks
Quotes
Alignment
Undo/Redo
Character/word counter at bottom
RIGHT (Sidebar - 30%):
Publish panel:
Status dropdown (draft/active/inactive)
Save draft button (gray)
Publish button (blue)
Preview button (outline)
Post settings panel:
Type selector (radio buttons):
Grammar
Tips
Vocabulary
Category dropdown (searchable)
URL slug input (auto-generated from title)
Thumbnail upload:
Drag & drop area
Image preview
Remove button
Recommended size hint
SEO panel (collapsible):
Meta description textarea
Keywords input (chips)
Visibility panel:
Public/Private toggle
Scheduled publish (date-time picker)
Autosave indicator: "Đã lưu 2 phút trước"
Unsaved changes warning on exit
3. POST DETAIL VIEW (Preview)
Components needed:

Header with back button and action buttons:
Edit button
Delete button
Share button
Post metadata section:
Author avatar and name
Published date
Category badge
Type badge
Status indicator
View count
Like count
Thumbnail image (full width)
Post title (large, bold)
Post content (formatted, readable typography)
Tags section at bottom
Related posts section (if any)
Comments section (optional)
4. DELETE CONFIRMATION MODAL
Components needed:

Modal titled "Xóa bài viết"
Warning icon (red)
Confirmation message: "Bạn có chắc muốn xóa bài viết '[Post Title]'? Hành động này không thể hoàn tác."
Post info summary (title, created date)
Checkbox: "Tôi hiểu rằng bài viết sẽ bị xóa vĩnh viễn"
Action buttons: "Hủy" (gray) and "Xóa bài viết" (red)
5. CONTENT STATISTICS PAGE
Components needed:

Page title "Thống kê nội dung"
Overview cards:
Total posts
Published posts
Draft posts
Total views
Total likes
Average views per post
Charts section:
Line chart: "Views over time" (last 30 days)
Bar chart: "Posts by type" (grammar/tips/vocabulary)
Pie chart: "Posts by category"
Bar chart: "Top performing posts" (by views)
Top posts table:
Thumbnail
Title
Type
Views
Likes
Published date
Link to view
Recent activity feed:
Post published
Post edited
Post liked
Timestamps
6. ADMIN MODERATION VIEW (For Admin Role)
Components needed:

Page header "Duyệt bài viết" with pending count badge
Filter tabs:
All posts
Pending approval (orange badge)
Approved (green badge)
Rejected (red badge)
Posts table with columns:
Thumbnail
Title
Author (name + avatar)
Type
Category
Status badge
Submitted date
Actions (Approve, Reject, View)
Bulk actions toolbar:
Select all checkbox
"Duyệt hàng loạt" button
"Từ chối hàng loạt" button
Quick stats at top:
Pending approval count
Approved today count
Rejected today count
Approval rate (%)
7. APPROVE POST MODAL (Admin)
Components needed:

Modal titled "Duyệt bài viết"
Post preview:
Thumbnail
Title
Author info
Content preview (truncated)
Type and category
Approval checklist:
Checkbox: "Nội dung phù hợp với quy định"
Checkbox: "Không có lỗi chính tả nghiêm trọng"
Checkbox: "Hình ảnh phù hợp"
Optional feedback textarea for author
Action buttons: "Hủy" and "Duyệt bài viết" (green)
8. REJECT POST MODAL (Admin)
Components needed:

Modal titled "Từ chối bài viết"
Warning icon (red)
Post info display (title, author)
Reason dropdown (required):
"Nội dung không phù hợp"
"Vi phạm quy định"
"Chất lượng kém"
"Sai chính tả nhiều"
"Hình ảnh không phù hợp"
"Khác (ghi rõ)"
Detailed reason textarea (required, max 500 chars)
Character counter
Notification checkbox: "Gửi thông báo cho tác giả"
Action buttons: "Hủy" and "Từ chối" (red)
9. POST STATUS NOTIFICATION (For Teacher)
Components needed:

Notification card showing:
Icon (checkmark for approved, X for rejected)
Status message
Post title
Admin name who reviewed
Review date
Rejection reason (if rejected)
Action button: "Xem bài viết" or "Chỉnh sửa lại"
Dismissible close button
10. CONTENT TEMPLATES LIBRARY (Optional)
Components needed:

Modal/Page titled "Mẫu bài viết"
Template categories:
Grammar lessons
Vocabulary tips
Study guides
Exam strategies
Template cards showing:
Template name
Preview thumbnail
Description
"Sử dụng mẫu" button
Search and filter for templates
11. RICH TEXT EDITOR TOOLBAR (Detailed)
Components needed:

Formatting toolbar with groups:
Text style: Bold, Italic, Underline, Strikethrough
Headings: H1, H2, H3, Normal
Lists: Bullet list, Numbered list
Alignment: Left, Center, Right, Justify
Insert: Link, Image, Video embed, Code block, Quote
Table: Insert table, Edit table
Special: Highlight, Text color, Background color
Actions: Undo, Redo, Clear formatting
Image upload modal:
Drag & drop area
Browse button
URL input option
Alt text input
Alignment options
Size options
12. BULK ACTIONS PANEL
Components needed:

Floating panel (appears when items selected)
Selected count display: "Đã chọn X bài viết"
Action buttons:
"Xuất bản hàng loạt"
"Chuyển sang nháp"
"Xóa hàng loạt"
"Thay đổi danh mục"
"Bỏ chọn tất cả" link
Confirmation modal for bulk actions
DESIGN REQUIREMENTS:
Use card-based layouts with subtle shadows
Implement rich text editor with WYSIWYG preview
Add image upload with drag & drop
Include autosave functionality indicator
Use status badges consistently (green=active, gray=draft, red=rejected)
Add loading states for content saving
Implement responsive design (desktop and tablet)
Use icons from Heroicons or Lucide
Add tooltips for editor toolbar buttons
Include character/word counters
Add confirmation dialogs for destructive actions
Implement smooth transitions
COLOR PALETTE:
Primary: #2563EB (blue)
Success/Active: #10B981 (green)
Warning/Pending: #F59E0B (amber)
Danger/Rejected: #EF4444 (red)
Draft: #6B7280 (gray)
Gray scale: #F9FAFB, #E5E7EB, #9CA3AF, #6B7280, #374151
TYPOGRAPHY:
Post titles: Bold, 24-32px
Editor content: Regular, 16px, line-height 1.6
Metadata: Regular, 14px
Labels: Medium, 14px
Design should feel like a professional content management system (similar to Medium or WordPress), helping teachers create and manage educational content efficiently.

