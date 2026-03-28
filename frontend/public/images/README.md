# Images Folder

## Banner Image

Place your orange banner image here as `banner.png`

**File**: `banner.png`  
**Location**: `frontend/public/images/banner.png`  
**Recommended size**: 1200x675px (16:9 aspect ratio)  
**Format**: PNG or JPG

### How to use the banner image:

1. Save your orange banner image as `banner.png` in this folder
2. The HeroSection component will automatically use it
3. Uncomment the `<img>` tag in `HeroSection.tsx` to display the actual image

### Current implementation:

The HeroSection currently shows a placeholder with orange gradient that mimics your banner design. Once you add the actual `banner.png` file, uncomment these lines in `HeroSection.tsx`:

```tsx
<img 
  src="/images/banner.png" 
  alt="Tuyển sinh khóa học tiếng Anh"
  className="w-full h-auto"
/>
```

And remove or comment out the placeholder div.
