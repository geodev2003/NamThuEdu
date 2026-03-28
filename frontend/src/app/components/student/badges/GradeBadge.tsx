interface GradeBadgeProps {
  grade: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export function GradeBadge({ grade, score, size = 'md', showScore = false }: GradeBadgeProps) {
  const getGradeColor = (g: string) => {
    if (g.startsWith('A')) return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
    if (g.startsWith('B')) return { bg: '#DBEAFE', text: '#1E40AF', border: '#2563EB' };
    if (g.startsWith('C')) return { bg: '#FEF3C7', text: '#78350F', border: '#F59E0B' };
    return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
  };

  const sizeStyles = {
    sm: { px: 'px-2', py: 'py-0.5', text: 'text-xs' },
    md: { px: 'px-3', py: 'py-1', text: 'text-sm' },
    lg: { px: 'px-4', py: 'py-1.5', text: 'text-base' },
  };

  const colors = getGradeColor(grade);
  const styles = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg ${styles.px} ${styles.py} ${styles.text}`}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `2px solid ${colors.border}`,
        fontWeight: 700,
      }}
    >
      {grade}
      {showScore && score !== undefined && (
        <span style={{ opacity: 0.8 }}>({score})</span>
      )}
    </span>
  );
}
