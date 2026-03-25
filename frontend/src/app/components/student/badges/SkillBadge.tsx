import { getSkillColor, getSkillIcon, getSkillName } from "../../../../utils/skillHelpers";

interface SkillBadgeProps {
  skill: 'listening' | 'reading' | 'writing' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'solid' | 'outline' | 'subtle';
}

export function SkillBadge({ 
  skill, 
  size = 'md', 
  showIcon = false, 
  variant = 'subtle' 
}: SkillBadgeProps) {
  const color = getSkillColor(skill);
  const Icon = getSkillIcon(skill);
  const name = getSkillName(skill);

  const sizeStyles = {
    sm: { px: 'px-2', py: 'py-0.5', text: 'text-xs', icon: 'w-3 h-3' },
    md: { px: 'px-3', py: 'py-1', text: 'text-sm', icon: 'w-3.5 h-3.5' },
    lg: { px: 'px-4', py: 'py-1.5', text: 'text-base', icon: 'w-4 h-4' },
  };

  const variantStyles = {
    solid: {
      background: color,
      color: 'white',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: color,
      border: `2px solid ${color}`,
    },
    subtle: {
      background: `${color}15`,
      color: color,
      border: 'none',
    },
  };

  const styles = sizeStyles[size];
  const varStyle = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md ${styles.px} ${styles.py} ${styles.text}`}
      style={{
        background: varStyle.background,
        color: varStyle.color,
        border: varStyle.border,
        fontWeight: 600,
      }}
    >
      {showIcon && <Icon className={styles.icon} />}
      {name}
    </span>
  );
}
