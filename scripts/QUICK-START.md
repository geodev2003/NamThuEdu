# 🚀 Quick Start - Generate SVGs

## Bước 1: Test API (30 giây)

```bash
cd scripts
node quick-test.js
```

Sẽ:
- ✅ Test API connection
- ✅ Generate 1 sample SVG
- ✅ Save vào `test-output/sample.svg`

## Bước 2: Generate tất cả SVGs (2 phút)

```bash
node generate-svgs.js
```

Hoặc dùng npm scripts:

```bash
npm run generate
```

## Bước 3: Preview SVGs

Mở file `svg-viewer.html` trong browser:

```bash
# Windows
start svg-viewer.html

# Mac
open svg-viewer.html

# Linux
xdg-open svg-viewer.html
```

Sau đó:
1. Click "Load Folder"
2. Chọn tất cả SVG files trong `generated-svgs/`
3. Preview và chọn variations đẹp nhất

## Bước 4: Copy vào project

```bash
# Copy grade icons
cp generated-svgs/grades/kindergarten-1.svg ../frontend/public/assets/icons/grades/
cp generated-svgs/grades/grade-1-1.svg ../frontend/public/assets/icons/grades/
# ... copy các file khác

# Hoặc copy cả folder
cp -r generated-svgs/* ../frontend/public/assets/icons/
```

## Bước 5: Sử dụng trong code

### Replace emoji trong LandingPage.tsx

**Before:**
```tsx
const gradeCategories = [
  {
    id: 'mau-giao',
    name: 'Lớp mẫu giáo',
    icon: '🎨',  // ← Emoji
    courses: 3
  }
];
```

**After:**
```tsx
const gradeCategories = [
  {
    id: 'mau-giao',
    name: 'Lớp mẫu giáo',
    icon: '/assets/icons/grades/kindergarten-1.svg',  // ← SVG path
    courses: 3
  }
];
```

### Update render

**Before:**
```tsx
<div className="text-5xl mb-4">
  {category.icon}  {/* Emoji */}
</div>
```

**After:**
```tsx
<div className="w-16 h-16 mb-4">
  <img src={category.icon} alt={category.name} className="w-full h-full" />
</div>
```

## 🎯 Generate từng category

```bash
# Chỉ generate grade icons
npm run grades

# Chỉ generate subject icons
npm run subjects

# Chỉ generate feature icons
npm run features

# Chỉ generate decorative elements
npm run decorative
```

## 📝 Custom prompts

Edit `generate-svgs.js`, thêm prompts mới:

```javascript
const SVG_PROMPTS = {
  myIcons: [
    {
      name: 'custom-icon',
      prompt: 'Your detailed prompt here',
      style: 'flat illustration, modern'
    }
  ]
};
```

Rồi chạy:

```bash
node generate-svgs.js single myIcons
```

## ⚡ Tips

1. **Test trước**: Luôn chạy `quick-test.js` trước để check API
2. **Preview**: Dùng `svg-viewer.html` để xem tất cả variations
3. **Pick best**: Mỗi prompt có 4 variations, chọn cái đẹp nhất
4. **Optimize**: Có thể dùng SVGO để optimize size
5. **Backup**: Lưu generated SVGs vào Git LFS hoặc cloud

## 🐛 Troubleshooting

### API key không work?
→ Check lại key trong `generate-svgs.js` line 13

### Rate limit?
→ Tăng delay trong code (line 150): `setTimeout(resolve, 5000)`

### SVG không đẹp?
→ Chỉnh prompt, thêm keywords: "flat design", "modern", "clean"

---

**Ready?** Chạy `node quick-test.js` để bắt đầu! 🚀
