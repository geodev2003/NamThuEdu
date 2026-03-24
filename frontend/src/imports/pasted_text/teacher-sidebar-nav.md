DESIGN PROMPT: Teacher Sidebar Navigation
Project Context
Design a sidebar navigation for an education management system (NamThu Education Platform) - Teacher role interface.

Design Requirements
1. Layout & Structure
Sidebar width: 280px (expanded), 72px (collapsed)
Fixed position on the left side
Collapsible/expandable with smooth animation
Responsive: auto-collapse on tablets (<1024px), drawer overlay on mobile (<768px)
Sticky header with user profile section at top
Scrollable menu area in the middle
Footer section at bottom (optional: settings, logout)
2. Visual Design
Modern, clean, professional aesthetic
Color scheme:
Primary: Education-friendly blue (#2563EB or similar)
Background: White or light gray (#F9FAFB)
Active state: Primary color with subtle background
Hover state: Light primary tint (#EFF6FF)
Text: Dark gray (#1F2937) for primary, lighter gray (#6B7280) for secondary
Typography:
Menu items: 14-15px, medium weight (500-600)
Section headers: 12px, uppercase, light weight, letter-spacing
Icons: Consistent icon set (Heroicons, Lucide, or Phosphor recommended)
Shadows: Subtle elevation (shadow-sm to shadow-md)
3. Navigation Structure
Main Menu Items:

Dashboard (📊 icon: chart-bar)

Single item, no submenu
Badge: Show count of pending tasks/notifications
Học sinh (👥 icon: users)

Submenu items:
Danh sách học sinh
Thêm học sinh
Thống kê
Xuất dữ liệu
Lớp học (🏫 icon: academic-cap)

Submenu items:
Danh sách lớp
Tạo lớp mới
Chuyển lớp
Thống kê lớp
Khóa học (📚 icon: book-open)

Submenu items:
Danh sách khóa học
Tạo khóa học
Quản lý học viên
Thống kê
Ngân hàng đề (📝 icon: document-text)

Submenu items:
Tất cả đề thi
Tạo đề mới
Mẫu đề thi (with nested: IELTS, VSTEP, Cambridge)
Đề thi của tôi
Giao bài thi (✍️ icon: clipboard-list)

Submenu items:
Danh sách bài giao
Giao bài mới
Giao hàng loạt
Thống kê
Badge: Show count of pending assignments
Luyện tập (📖 icon: light-bulb)

Submenu items:
Danh sách bài luyện
Tạo theo chủ đề
Tạo theo mẫu
Tạo ngẫu nhiên
Chấm bài (✅ icon: check-circle)

Submenu items:
Bài chờ chấm
Đã chấm
Chấm tự động
Báo cáo lớp
Badge: Show count of ungraded submissions (red/orange)
Giám sát trực tiếp (📡 icon: signal)

Submenu items:
Phiên thi đang diễn ra
Lịch sử kết nối
Thống kê realtime
Indicator: Green dot when active sessions exist
Blog & Bài viết (📰 icon: newspaper)

Submenu items:
Danh sách bài viết
Tạo bài mới
Danh mục
Báo cáo (📊 icon: chart-pie)

Submenu items:
Tổng quan
Tiến độ học sinh
Phân tích kết quả
Xuất báo cáo
Divider line

Cài đặt (⚙️ icon: cog)
Single item or submenu
4. Interactive States
Default: Gray text, no background
Hover: Light background, slightly darker text, smooth transition (150ms)
Active/Selected: Primary color text, light primary background, left border accent (3-4px)
Disabled: Reduced opacity (0.5), no hover effect, cursor not-allowed
Submenu expanded: Rotate chevron icon 180deg, show nested items with indent
Badge/Counter: Small pill shape, primary or red color, white text
5. Behavior & Interactions
Smooth expand/collapse animation (300ms ease-in-out)
Submenu toggle on click (not hover)
Active state persists based on current route
Keyboard navigation support (Tab, Arrow keys, Enter)
Tooltips on collapsed state showing full menu name
Auto-close other submenus when opening a new one (accordion behavior)
Scroll to active item on page load if not visible
6. Accessibility (WCAG 2.1 AA)
Semantic HTML: <nav>, <ul>, <li>, <a> or <button>
ARIA labels: aria-label, aria-expanded, aria-current="page"
Focus indicators: Clear outline on keyboard focus
Color contrast: Minimum 4.5:1 for text
Screen reader friendly: Announce state changes
Skip navigation link option
7. Responsive Behavior
Desktop (>1280px): Expanded by default
Laptop (1024-1280px): Collapsed by default, expand on hover or click
Tablet (768-1024px): Collapsed, overlay on toggle
Mobile (<768px): Hidden, drawer from left with backdrop overlay
8. Additional Features
Search/filter menu items (optional, for large menus)
User profile section at top: Avatar, name, role badge, dropdown menu
Notification indicator on relevant items
Quick actions: Floating action button for common tasks
Dark mode support (optional)
Customizable: Allow users to pin/unpin favorite items
9. Technical Specifications
Framework agnostic (provide design for React, Vue, or vanilla JS)
CSS: Tailwind CSS preferred, or modern CSS with variables
Icons: SVG format, 20-24px size
Animation: CSS transitions or Framer Motion
State management: Context API, Zustand, or Pinia
Routing: React Router, Vue Router, or Next.js
10. Deliverables Expected
High-fidelity mockup (Figma, Adobe XD, or Sketch)
Component structure/hierarchy
Color palette with hex codes
Spacing system (4px, 8px, 16px, 24px, etc.)
Typography scale
Interactive prototype showing hover, active, and expanded states
Mobile responsive views
Dark mode variant (optional)
Design Inspiration References
Notion sidebar
Linear app navigation
Vercel dashboard
Stripe dashboard
Modern admin templates (Tailwind UI, Shadcn UI)
Success Criteria
Easy to scan and navigate
Clear visual hierarchy
Intuitive grouping of related features
Fast access to frequently used functions
Professional and trustworthy appearance
Smooth, delightful interactions
Accessible to all users