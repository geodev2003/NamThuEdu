import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export function formatDate(date: string | Date, locale: string = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'vi' ? vi : enUS;
  return format(dateObj, 'PPP', { locale: localeObj });
}

export function formatTime(date: string | Date, locale: string = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
}

export function formatDateTime(date: string | Date, locale: string = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'vi' ? vi : enUS;
  return format(dateObj, 'PPP HH:mm', { locale: localeObj });
}

export function formatTimeAgo(date: string | Date, locale: string = 'vi'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localeObj = locale === 'vi' ? vi : enUS;
  // Timestamp ở tương lai (do lệch timezone dữ liệu cũ) → coi như vừa xong,
  // tránh hiển thị vô lý kiểu "khoảng 7 giờ nữa".
  if (dateObj.getTime() > Date.now()) {
    return locale === 'vi' ? 'vừa xong' : 'just now';
  }
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: localeObj });
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatScore(score: number, decimals: number = 1): string {
  return score.toFixed(decimals);
}

export function formatPercentage(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1) + '%';
}

export function formatNumber(num: number, locale: string = 'vi'): string {
  return new Intl.NumberFormat(locale).format(num);
}
