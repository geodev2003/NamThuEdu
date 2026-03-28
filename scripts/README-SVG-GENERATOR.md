# 🎨 Quiver AI SVG Generator

Script để generate SVG illustrations cho NamThuEdu website sử dụng Quiver AI API.

## 📋 Thông tin

- **API**: Quiver AI (https://docs.quiver.ai)
- **API Key**: `sk_live_3W73ayHpD59vXF1WrfTfRn`
- **Model**: Arrow 1.0
- **Rate Limit**: 20 requests / 60 seconds
- **Cost**: 1 credit per SVG generated

## 🚀 Cách sử dụng

### 1. Cài đặt (nếu cần)

Script sử dụng Node.js built-in `fetch`, không cần install thêm package.

```bash
# Chỉ cần Node.js >= 18
node --version
```

### 2. Generate tất cả SVGs

```bash
node scripts/generate-svgs.js
```

Sẽ generate:
- 6 grade level icons (Mẫu giáo → Lớp 5)
- 4 subject icons (Toán, Văn, Anh, Khoa học)
- 4 feature icons (Learning, Competition, Community, Rewards)
- 3 decorative elements (Hero, Badge, Pattern)

**Total**: ~68 SVGs (17 prompts × 4 variations each)

### 3. Test với 1 prompt

```bash
node scripts/generate-svgs.js test "Colorful math icon with calculator"
```

### 4. Generate 1 category

```bash
# Chỉ generate grade icons
node scripts/generate-svgs.js single grades

# Chỉ generate subject icons
node scripts/generate-svgs.js single subjects

# Chỉ generate feature icons
node scripts/generate-svgs.js single features

# Chỉ generate decorative elements
node scripts/generate-svgs.js single decorative
```

## 📁 Output Structure

```
generated-svgs/
├── grades/
│   ├── kindergarten-1.svg
│   ├── kindergarten-2.svg
│   ├── kindergarten-3.svg
│   ├── kindergarten-4.svg
│   ├── grade-1-1.svg
│   ├── grade-1-2.svg
│   └── ...
├── subjects/
│   ├── math-1.svg
│   ├── math-2.svg
│   ├── vietnamese-1.svg
│   └── ...
├── features/
│   ├── personalized-learning-1.svg
│   ├── competition-1.svg
│   └── ...
└── decorative/
    ├── hero-illustration-1.svg
    ├── success-badge-1.svg
    └── ...
```

## 🎨 Prompts được generate

### Grade Level Icons (6 prompts)
1. **Kindergarten** - Colorful playful icon with crayons
2. **Grade 1** - Books and pencil, blue colors
3. **Grade 2** - Open book and apple, green colors
4. **Grade 3** - Notebook and pen, yellow-orange
5. **Grade 4** - Pencil and ruler, purple
6. **Grade 5** - Compass and protractor, indigo-blue

### Subject Icons (4 prompts)
1. **Math** - Numbers and calculator, blue gradient
2. **Vietnamese** - Book and Vietnamese letters, green
3. **English** - ABC letters and globe, purple
4. **Science** - Beaker and atom, orange

### Feature Icons (4 prompts)
1. **Personalized Learning** - Student and adaptive interface
2. **Competition** - Trophy and stars, gold-yellow
3. **Community** - People helping each other, green
4. **Rewards** - Gift box and coins, purple-pink

### Decorative Elements (3 prompts)
1. **Hero Illustration** - Students learning on laptops
2. **Success Badge** - Star and ribbon, gold-blue
3. **Study Pattern** - Seamless pattern with books

## ⚙️ Customization

### Thêm prompts mới

Edit file `generate-svgs.js`, thêm vào object `SVG_PROMPTS`:

```javascript
const SVG_PROMPTS = {
  // ... existing prompts
  
  myCategory: [
    {
      name: 'my-icon',
      prompt: 'Your detailed prompt here',
      style: 'flat illustration, modern, clean'
    }
  ]
};
```

### Thay đổi số variations

Mặc định generate 4 variations mỗi prompt. Để thay đổi:

```javascript
// Line ~90
body: JSON.stringify({
  prompt: `${prompt}. Style: ${style}`,
  n: 2, // Change from 4 to 2
  model: 'arrow-1.0'
})
```

### Thay đổi rate limit delay

Mặc định đợi 3 giây giữa các requests:

```javascript
// Line ~150
await new Promise(resolve => setTimeout(resolve, 3000)); // 3000ms = 3s
```

## 📊 Ước tính thời gian & chi phí

### Thời gian
- 1 prompt = ~3-5 giây (API call)
- Rate limit delay = 3 giây
- **Total**: ~17 prompts × 6 giây = ~102 giây (~2 phút)

### Chi phí (Credits)
- 1 prompt với n=4 = 4 credits
- **Total**: 17 prompts × 4 = 68 credits

## 🔧 Troubleshooting

### Error: API Key invalid
```
❌ Error: API Error: invalid_api_key
```
→ Check API key trong file `generate-svgs.js` line 13

### Error: Rate limit exceeded
```
❌ Error: API Error: Rate limit exceeded
```
→ Tăng delay giữa các requests (line 150)

### Error: Insufficient credits
```
❌ Error: API Error: insufficient credits
```
→ Mua thêm credits tại https://app.quiver.ai/billing

### SVG không đẹp
→ Chỉnh lại prompt, thêm chi tiết hơn:
- Thêm style keywords: "flat design", "modern", "minimalist"
- Thêm color keywords: "blue gradient", "vibrant colors"
- Thêm detail keywords: "simple", "clean", "professional"

## 💡 Tips

### 1. Prompt Engineering
- **Specific**: "Math icon with calculator and numbers" > "Math icon"
- **Style**: Luôn thêm style keywords (flat, modern, clean)
- **Colors**: Specify colors để consistent với theme
- **Simplicity**: "Simple flat design" cho icons, "detailed illustration" cho hero images

### 2. Chọn variations tốt nhất
Mỗi prompt generate 4 variations, chọn cái đẹp nhất:
- Check trong folder `generated-svgs/`
- Open SVG trong browser để preview
- Chọn variation phù hợp với design system

### 3. Optimize SVG
Sau khi generate, có thể optimize:
```bash
# Install SVGO
npm install -g svgo

# Optimize all SVGs
svgo -f generated-svgs/ -o optimized-svgs/
```

### 4. Convert to PNG (nếu cần)
```bash
# Install sharp-cli
npm install -g sharp-cli

# Convert SVG to PNG
sharp -i input.svg -o output.png --width 512
```

## 📝 Usage trong project

### 1. Copy SVGs vào project
```bash
# Copy vào frontend public folder
cp generated-svgs/grades/* frontend/public/assets/icons/grades/
cp generated-svgs/subjects/* frontend/public/assets/icons/subjects/
```

### 2. Sử dụng trong React
```tsx
// Direct import
import GradeIcon from '/assets/icons/grades/grade-1-1.svg';

// Or inline SVG
<img src="/assets/icons/grades/grade-1-1.svg" alt="Grade 1" />

// Or as background
<div style={{ backgroundImage: 'url(/assets/icons/grades/grade-1-1.svg)' }} />
```

### 3. Replace emoji trong LandingPage
```tsx
// Before
icon: '🎨'

// After
icon: '/assets/icons/grades/kindergarten-1.svg'
```

## 🎯 Next Steps

1. **Run script**: `node scripts/generate-svgs.js`
2. **Review SVGs**: Check `generated-svgs/` folder
3. **Pick best ones**: Chọn variations đẹp nhất
4. **Copy to project**: Move vào `frontend/public/assets/`
5. **Update code**: Replace emoji/icons với SVG paths
6. **Test**: Verify SVGs hiển thị đúng

## 📚 Resources

- [Quiver AI Docs](https://docs.quiver.ai)
- [Quiver AI Dashboard](https://app.quiver.ai)
- [SVG Optimization Guide](https://jakearchibald.github.io/svgomg/)
- [Prompt Engineering Tips](https://docs.quiver.ai/guides/prompting)

---

**Created**: 2026-03-25  
**API Key**: `sk_live_3W73ayHpD59vXF1WrfTfRn`  
**Status**: Ready to use ✅
