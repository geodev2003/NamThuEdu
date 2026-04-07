# Student UI - NamThuEdu

Giao diện học viên được thiết kế thông minh, hiện đại và tối ưu trải nghiệm người dùng.

## 🎨 Design System

### Colors
- Primary: `#2563EB` (Blue)
- Background: `#EEEEF3` (Light Gray)
- Text Primary: `#1F1344` (Dark Purple)
- Text Secondary: `#6B7280` (Gray)

### Skills Colors
- Listening: `#8B5CF6` (Purple)
- Reading: `#10B981` (Green)
- Writing: `#F59E0B` (Amber)
- Speaking: `#2563EB` (Blue)

### Grade Colors
- A: Green (`#10B981`)
- B: Blue (`#2563EB`)
- C: Yellow (`#F59E0B`)
- D/F: Red (`#EF4444`)

## 📁 Structure

```
student/
├── dashboard/          # Trang chủ học viên
│   └── StudentDashboard.tsx
├── tests/             # Quản lý bài thi
│   ├── TestList.tsx
│   ├── TestTaking.tsx (TODO)
│   └── TestResults.tsx (TODO)
├── practice/          # Luyện tập
│   ├── PracticeList.tsx
│   └── PracticeSession.tsx (TODO)
├── notifications/     # Thông báo
│   └── NotificationList.tsx
├── profile/          # Hồ sơ cá nhân (TODO)
│   ├── ProfileInfo.tsx
│   ├── LearningGoals.tsx
│   └── Settings.tsx
└── progress/         # Tiến độ học tập (TODO)
    └── ProgressTracking.tsx
```

## 🧩 Shared Components

### Badges
- `SkillBadge` - Badge hiển thị kỹ năng
- `GradeBadge` - Badge hiển thị xếp loại
- `StatusBadge` - Badge hiển thị trạng thái

### Progress
- `CircularProgress` - Progress circle animated
- `LinearProgress` - Progress bar
- `Timer` - Countdown timer

### Feedback
- `EmptyState` - Trạng thái rỗng
- `ErrorState` - Trạng thái lỗi
- `LoadingSkeleton` - Loading placeholder

## 🔧 Utilities

### Formatters (`utils/formatters.ts`)
- `formatDate()` - Format ngày tháng
- `formatTime()` - Format giờ
- `formatTimeAgo()` - "2 giờ trước"
- `formatDuration()` - Format thời gian (HH:MM:SS)
- `formatScore()` - Format điểm số
- `formatPercentage()` - Format phần trăm

### Grade Helpers (`utils/gradeHelpers.ts`)
- `getGradeBadge()` - Tính xếp loại từ điểm
- `getGradeColor()` - Lấy màu theo xếp loại
- `getGradeDescription()` - Mô tả xếp loại
- `isPassingGrade()` - Kiểm tra đạt/không đạt
- `calculateGradeImprovement()` - Tính tiến bộ

### Skill Helpers (`utils/skillHelpers.ts`)
- `getSkillColor()` - Màu theo kỹ năng
- `getSkillIcon()` - Icon theo kỹ năng
- `getSkillName()` - Tên kỹ năng (i18n)

## 🌐 i18n Support

Tất cả text đều sử dụng `useTranslation()` hook:

```typescript
const { t } = useTranslation();

<h1>{t('student.dashboard.title')}</h1>
<p>{t('student.tests.startTest')}</p>
```

Translation keys được tổ chức theo namespace:
- `student.dashboard.*` - Dashboard
- `student.tests.*` - Bài thi
- `student.practice.*` - Luyện tập
- `student.notifications.*` - Thông báo
- `common.*` - Chung
- `difficulty.*` - Độ khó
- `status.*` - Trạng thái

## 📱 Responsive Design

Tất cả components đều responsive:
- Mobile: Single column, bottom navigation
- Tablet: 2 columns, compact layout
- Desktop: Full layout với sidebar

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚀 API Integration

Sử dụng React Query cho data fetching:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['student', 'tests'],
  queryFn: () => studentApi.getTests(),
});
```

Mutations cho write operations:

```typescript
const mutation = useMutation({
  mutationFn: (id) => studentApi.markNotificationRead(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
  },
});
```

## ✨ Features Implemented

✅ Dashboard với stats và charts
✅ Test List với filters và search
✅ Practice List với topics
✅ Notifications với real-time updates
✅ Shared components library
✅ i18n support (vi/en)
✅ Responsive design
✅ Loading states
✅ Empty states
✅ Error handling

## 🔜 TODO

- [ ] Test Taking Interface (làm bài thi)
- [ ] Test Results (kết quả chi tiết)
- [ ] Answer Review (xem đáp án)
- [ ] Progress Tracking (tiến độ học tập)
- [ ] Test History (lịch sử bài làm)
- [ ] Profile & Settings (hồ sơ cá nhân)
- [ ] WebSocket integration (real-time)
- [ ] Offline support
- [ ] Mobile app (React Native)

## 🧭 Route Base (Updated)

- Student portal chính dùng base: `/hoc-vien/*`
- Legacy route `/hoc-sinh/*` được redirect sang `/hoc-vien/*` để tương thích link cũ

## 🎯 Best Practices

1. **Component Organization**: Mỗi feature có folder riêng
2. **Type Safety**: Sử dụng TypeScript interfaces
3. **Code Splitting**: Lazy load routes
4. **Performance**: Memoization, virtual scrolling
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Testing**: Unit tests, integration tests
7. **Documentation**: JSDoc comments

## 📚 References

- [Design Prompts](.kiro/prompts/student-ui-prompts.md)
- [Additional Prompts](.kiro/prompts/student-ui-additional-prompts.md)
- [API Documentation](backend/storage/api-docs/api-docs.json)
