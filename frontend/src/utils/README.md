# 🛠️ Utilities

Thư mục này chứa các utility functions dùng chung trong toàn bộ ứng dụng.

## 📦 Available Utilities

### `mediaUtils.ts`
Xử lý media URLs (audio, images) với environment-based configuration.

**Functions:**
- `getApiBaseUrl()` - Lấy base URL từ environment
- `getFullMediaUrl(url)` - Convert relative URL → full URL
- `isValidMediaUrl(url)` - Validate media URL
- `getMediaTypeFromUrl(url)` - Xác định loại media

**Usage:**
```typescript
import { getFullMediaUrl } from '@/utils/mediaUtils';

const fullUrl = getFullMediaUrl('/storage/image.png');
// Returns: "http://localhost:8000/storage/image.png"
```

**Documentation:** See `.kiro/docs/MEDIA-URL-HANDLING.md`

---

## 🎯 Best Practices

1. **Always use utilities** thay vì hardcode URLs
2. **Import from utils** để tái sử dụng logic
3. **Add tests** khi tạo utility mới
4. **Document** functions với JSDoc comments

## 📝 Adding New Utilities

Khi thêm utility mới:

1. Tạo file mới trong `src/utils/`
2. Export functions với TypeScript types
3. Add JSDoc comments
4. Update README này
5. Tạo documentation trong `.kiro/docs/`
6. Add tests nếu cần

## 🔗 Related

- Environment config: `frontend/.env`
- API config: `frontend/src/services/api.ts`
- Documentation: `.kiro/docs/`
