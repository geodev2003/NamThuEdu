#!/bin/bash
# Color Theme Replacement Script
# From Purple/Pink to Forest Green/Coral

echo "🎨 Replacing color theme: Purple/Pink → Forest Green/Coral"

# Define colors
OLD_PRIMARY="#7B5EA7"
NEW_PRIMARY="#1A5C45"
OLD_ACCENT="#E91E8C"
NEW_ACCENT="#FF6B5B"

# Find all TSX files
find frontend/src -name "*.tsx" -type f | while read file; do
  echo "Processing: $file"
  
  # Replace hex colors
  sed -i "s/$OLD_PRIMARY/$NEW_PRIMARY/g" "$file"
  sed -i "s/$OLD_ACCENT/$NEW_ACCENT/g" "$file"
  
  # Replace Tailwind classes
  sed -i 's/from-purple-600/bg-[#1A5C45]/g' "$file"
  sed -i 's/to-pink-600/bg-[#1A5C45]/g' "$file"
  sed -i 's/from-purple-/from-[#1A5C45]/g' "$file"
  sed -i 's/to-pink-/to-[#FF6B5B]/g' "$file"
  sed -i 's/from-indigo-/from-[#1A5C45]/g' "$file"
  sed -i 's/purple-600/[#1A5C45]/g' "$file"
  sed -i 's/pink-600/[#FF6B5B]/g' "$file"
  sed -i 's/indigo-600/[#1A5C45]/g' "$file"
  sed -i 's/text-purple-/text-[#1A5C45]/g' "$file"
  sed -i 's/text-pink-/text-[#FF6B5B]/g' "$file"
  sed -i 's/bg-purple-/bg-[#E8F5EF]/g' "$file"
  sed-i 's/bg-pink-/bg-[#FFD6D2]/g' "$file"
  sed -i 's/border-purple-/border-[#1A5C45]/g' "$file"
  sed -i 's/hover:text-purple-/hover:text-[#FF6B5B]/g' "$file"
  sed -i 's/hover:bg-purple-/hover:bg-[#E8F5EF]/g' "$file"
done

echo "✅ Color replacement complete!"
