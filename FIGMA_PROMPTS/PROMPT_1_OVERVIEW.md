# 🎨 FIGMA PROMPT 1/6 - PROJECT OVERVIEW & DESIGN SYSTEM

## 📋 PROJECT OVERVIEW

**Project**: NamThu Education - Teacher Dashboard  
**Platform**: Web Application (Desktop & Tablet)  
**Users**: English Teachers (Ages 25-50)  
**Style**: Modern, Professional, Clean, Educational  

---

## 🎨 COLOR PALETTE

### Primary Colors
```
Blue Primary: #2563EB (Buttons, Links, Active)
Blue Hover: #1D4ED8
Blue Light: #DBEAFE (Backgrounds)
```

### Secondary Colors
```
Green: #10B981 (Success, Young Learners)
Orange: #F59E0B (Warnings, Pending)
Red: #EF4444 (Errors, Delete)
```

### Neutral Colors
```
Gray 900: #111827 (Text primary)
Gray 700: #374151 (Text secondary)
Gray 500: #6B7280 (Text tertiary)
Gray 300: #D1D5DB (Borders)
Gray 100: #F3F4F6 (Backgrounds)
White: #FFFFFF
```

### Cambridge Colors
```
Young Learners: #10B981 (Green)
Main Suite: #2563EB (Blue)
International: #EF4444 (Red)
```

---

## 📝 TYPOGRAPHY

### Font Family
```
Primary: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI"
```

### Headings
```
H1: Inter Bold, 32px, #1F2937
H2: Inter SemiBold, 24px, #374151
H3: Inter SemiBold, 20px, #4B5563
H4: Inter Medium, 16px, #6B7280
```

### Body Text
```
Regular: Inter Regular, 14px, #6B7280
Small: Inter Regular, 12px, #9CA3AF
```

### Buttons
```
Inter Medium, 14px
```

---

## 📐 SPACING SYSTEM

```
XS: 4px
SM: 8px
MD: 16px
LG: 24px
XL: 32px
XXL: 48px
```

---

## 🎯 BORDER RADIUS

```
Small: 4px (Inputs, small buttons)
Medium: 8px (Cards, buttons)
Large: 12px (Modals, large cards)
Full: 9999px (Avatars, badges)
```

---

## 💫 SHADOWS

```
Small: 0 1px 2px rgba(0,0,0,0.05)
Medium: 0 4px 6px rgba(0,0,0,0.1)
Large: 0 10px 15px rgba(0,0,0,0.1)
```

---

## 🎯 COMPONENT LIBRARY

### Buttons

**Primary Button**
```
Background: #2563EB
Text: White
Padding: 12px 24px
Border Radius: 8px
Hover: #1D4ED8
Shadow: 0 1px 2px rgba(0,0,0,0.05)
```

**Secondary Button**
```
Background: White
Text: #2563EB
Border: 1px solid #2563EB
Padding: 12px 24px
Border Radius: 8px
Hover: Background #DBEAFE
```

**Icon Button**
```
Size: 40px × 40px
Icon: 20px
Background: Transparent
Hover: Gray 100
Border Radius: 8px
```

### Cards

**Standard Card**
```
Background: White
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover State:
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Transform: translateY(-2px)
- Transition: 200ms ease
```

### Form Elements

**Input Field**
```
Height: 44px
Border: 1px solid #D1D5DB
Border Radius: 8px
Padding: 12px 16px
Font: Inter Regular, 14px

Focus State:
- Border: #2563EB
- Shadow: 0 0 0 3px rgba(37,99,235,0.1)
```

**Select Dropdown**
```
Same as Input Field
Arrow icon: 16px on right
Padding right: 40px
```

**Textarea**
```
Min Height: 120px
Resize: vertical
Same styling as Input
```

### Badges

**Status Badges**
```
Active: 
- Background: #10B981
- Text: White
- Height: 24px
- Padding: 4px 12px
- Border Radius: 12px

Pending:
- Background: #F59E0B
- Text: White

Inactive:
- Background: #6B7280
- Text: White
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Desktop */
@media (min-width: 1440px) {
  - Sidebar: 280px
  - Stats: 4 columns
  - Templates: 3 columns
}

/* Laptop */
@media (min-width: 1024px) and (max-width: 1439px) {
  - Sidebar: 240px
  - Stats: 2×2 grid
  - Templates: 2 columns
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  - Sidebar: Collapsible
  - Stats: 2 columns
  - Templates: 2 columns
}

/* Mobile */
@media (max-width: 767px) {
  - Bottom nav
  - Stats: 1 column
  - Templates: 1 column
}
```

---

## 🎨 DESIGN PRINCIPLES

1. **Clean & Professional**: Minimal clutter, focus on content
2. **Consistent**: Use design system components
3. **Accessible**: WCAG 2.1 AA compliance
4. **Responsive**: Mobile-first approach
5. **User-Friendly**: Clear hierarchy, easy navigation

---

**Next**: PROMPT 2 - Dashboard & Navigation