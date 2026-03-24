PROMPT: Review UI/UX & API Design for Educational Testing Platform
I'm building an educational testing platform (similar to online exam systems for IELTS, TOEIC, VSTEP). Please review my current design and provide feedback on:

1. API Design Review
Current API Structure:

Authentication:

POST /api/login
POST /api/refresh
POST /api/logout
Teacher APIs:

GET /api/teacher/exams - List exams
POST /api/teacher/exams - Create exam
GET /api/teacher/exams/{id} - Get exam details
PUT /api/teacher/exams/{id} - Update exam
DELETE /api/teacher/exams/{id} - Delete exam
POST /api/teacher/exams/{id}/questions - Add questions
POST /api/teacher/exams/{id}/publish - Publish exam
POST /api/teacher/exams/from-template/{templateId} - Create from template
Assignment APIs:

POST /api/teacher/exams/{examId}/assign - Assign to class/student
GET /api/teacher/assignments - List assignments
DELETE /api/teacher/assignments/{id} - Delete assignment
GET /api/teacher/assignments/{id}/progress - View progress
POST /api/teacher/assignments/bulk - Bulk assign
POST /api/teacher/assignments/{id}/reminders - Send reminders
Grading APIs:

GET /api/teacher/submissions - List submissions
GET /api/teacher/submissions/{id} - View submission
POST /api/teacher/submissions/{id}/grade - Manual grade
POST /api/teacher/submissions/{id}/auto-grade - Auto grade
POST /api/teacher/submissions/{id}/detailed-grade - Detailed grade
GET /api/teacher/classes/{classId}/report - Class report
GET /api/teacher/grading/statistics - Grading stats
Monitoring APIs:

GET /api/teacher/dashboard/test-statistics/{examId} - Real-time stats
GET /api/teacher/dashboard/active-sessions - Active students
POST /api/teacher/dashboard/send-message - Send message to student
GET /api/teacher/dashboard/connection-logs/{submissionId} - Connection logs
Student APIs:

GET /api/student/tests - Available tests
GET /api/student/tests/{id} - Test details
POST /api/student/tests/{id}/start - Start test
POST /api/student/tests/{submissionId}/answer - Submit answer
POST /api/student/tests/{submissionId}/submit - Submit test
POST /api/student/websocket/connect - WebSocket connection
POST /api/student/websocket/answer - Real-time answer save
Blog/Content APIs:

GET /api/teacher/blogs - List posts
POST /api/teacher/blogs - Create post
PUT /api/teacher/blogs/{id} - Update post
DELETE /api/teacher/blogs/{id} - Delete post
Questions to answer:

RESTful Design:

Are my API endpoints following REST best practices?
Should I use different HTTP methods or endpoint structures?
Are there any inconsistencies in naming conventions?
API Organization:

Is the grouping logical (teacher/student/admin)?
Should I use versioning (e.g., /api/v1/)?
Are there missing CRUD operations?
Response Format:

Should all responses follow a standard format like:
{
  "status": "success|error",
  "data": {...},
  "message": "...",
  "errors": {...}
}
Pagination & Filtering:

Which endpoints need pagination?
What query parameters should I support (page, per_page, sort, filter)?
Real-time Features:

Is WebSocket the right choice for live monitoring?
Should I use Server-Sent Events (SSE) instead?
How to handle connection drops during exams?
Security:

Is role-based access control (teacher/student/admin) sufficient?
Should I implement rate limiting?
How to prevent cheating during online exams?
2. UI/UX Flow Review
Current User Flows:

Teacher Flow - Create Exam:

Dashboard → "Tạo đề thi mới"
Choose: Manual creation OR Template-based
If template: Select template (TOEIC/IELTS/VSTEP) → Auto-generate structure
If manual: Fill basic info → Add questions one by one
Preview exam
Publish
Teacher Flow - Assign Exam:

Exam list → Select exam → "Giao bài"
Choose target: Class OR Individual student
Set deadline, max attempts
Confirm → Assignment created
Teacher Flow - Monitor Live Exam:

Dashboard → "Giám sát trực tiếp"
See grid of active students
Click student → View details (time, progress, connection status)
Send message if needed
View connection logs
Teacher Flow - Grade Submissions:

"Chấm bài" → List of submissions
Click submission → View answers
Choose: Auto-grade OR Manual grade
If manual: Grade each question + feedback
Save → Student notified
Student Flow - Take Exam:

Login → "Bài thi của tôi"
See assigned tests
Click "Bắt đầu" → Confirm
WebSocket connects
Answer questions (auto-save)
Submit → Confirmation
Wait for grading
Questions to answer:

User Experience:

Are there too many steps in any flow?
Where can I reduce friction?
What confirmations are necessary vs annoying?
Information Architecture:

Is the navigation structure clear?
Should I use tabs, sidebar, or top nav?
How to organize 10+ features for teachers?
Visual Hierarchy:

What should be the primary actions on each page?
How to highlight important information (deadlines, warnings)?
Color coding strategy for statuses?
Responsive Design:

Which features MUST work on mobile?
Can students take exams on tablets?
Should teachers use desktop only?
Real-time Updates:

How to show live data without overwhelming users?
Polling interval vs WebSocket?
How to indicate "live" status?
Error Handling:

What happens if student loses connection during exam?
How to recover unsaved answers?
Clear error messages vs technical details?
Accessibility:

Keyboard navigation support?
Screen reader compatibility?
Color contrast for visually impaired?
3. Specific Feature Questions
Exam Creation:

Should I use a step-by-step wizard or single-page form?
How to make adding 100+ questions less tedious?
Bulk import from Excel/Word?
Question bank/library feature?
Live Monitoring:

Dashboard refresh rate (5s, 10s, 30s)?
How many students can teacher monitor simultaneously?
Alert system for connection issues?
Should teacher see student's screen (proctoring)?
Grading:

Batch grading multiple submissions at once?
Grading rubrics/templates?
AI-assisted grading for essays?
Peer review feature?
Reports:

What charts are most useful for teachers?
Export formats (PDF, Excel, CSV)?
Scheduled reports (weekly/monthly)?
Comparison views (class vs class, student vs student)?
4. Performance & Scalability
How many concurrent students can take exams?
Database optimization for large question banks?
Caching strategy for frequently accessed data?
CDN for media files (audio for listening tests)?
5. Mobile App Considerations
Should I build native apps or PWA?
Which features are mobile-first?
Offline mode for downloaded exams?
Push notifications for deadlines?
Please provide:

✅ What's good in current design
⚠️ What needs improvement
🚨 Critical issues to fix
💡 Innovative ideas to consider
📚 Best practices from similar platforms (Duolingo, Khan Academy, Coursera)