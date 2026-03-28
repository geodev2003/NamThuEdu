# Student UI Quick Guide

## 🚀 Start Development Server

```bash
cd frontend
npm run dev
```

## 🌐 URLs

- **Dashboard**: http://localhost:5173/
- **Bài tập**: http://localhost:5173/bai-tap
- **Luyện tập**: http://localhost:5173/luyen-tap
- **Thông báo**: http://localhost:5173/thong-bao

## 🔧 Configuration

### Mock Data Mode

Khi backend chưa chạy, bật mock data trong `.env`:

```env
VITE_USE_MOCK_DATA=true
```

Khi backend đã chạy, tắt mock data:

```env
VITE_USE_MOCK_DATA=false
```

### i18n Language

Mặc định: Tiếng Việt (`vi`)

Để đổi sang English, update trong `src/i18n.ts`:

```typescript
lng: "en", // Change from "vi" to "en"
```

## 🐛 Troubleshooting

### Issue: Text hiển thị translation keys (student.dashboard.loading)

**Fix**: Restart dev server sau khi update i18n config

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue: API Connection Refused

**Option 1**: Bật mock data (recommended for UI development)
```env
VITE_USE_MOCK_DATA=true
```

**Option 2**: Start backend server
```bash
cd backend
php artisan serve
```

### Issue: Blank page

**Check**:
1. Console errors (F12)
2. i18n imported in `main.tsx`
3. Routes configured correctly
4. Dev server running

## 📝 Development Tips

1. **Hot Reload**: Changes auto-reload, no need to restart
2. **Mock Data**: Edit `src/services/mockData.ts` to customize test data
3. **Translations**: Edit `src/locales/vi.json` or `en.json`
4. **Styling**: Use Tailwind classes, colors in design system
5. **Components**: Reuse shared components from `src/app/components/student/`

## 🎨 Design System

### Colors
- Primary: `#2563EB`
- Background: `#EEEEF3`
- Text: `#1F1344`

### Skills
- Listening: `#8B5CF6`
- Reading: `#10B981`
- Writing: `#F59E0B`
- Speaking: `#2563EB`

### Grades
- A: Green
- B: Blue
- C: Yellow
- D/F: Red

## 📚 Next Steps

1. ✅ Dashboard - Done
2. ✅ Test List - Done
3. ✅ Practice List - Done
4. ✅ Notifications - Done
5. ⏳ Test Taking Interface - TODO
6. ⏳ Test Results - TODO
7. ⏳ Answer Review - TODO
8. ⏳ Progress Tracking - TODO
9. ⏳ Test History - TODO
10. ⏳ Profile & Settings - TODO
