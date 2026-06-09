import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatScore,
  formatPercentage,
  formatTimeAgo,
} from './formatters';

describe('formatDuration', () => {
  it('formats minutes:seconds when under an hour', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(600)).toBe('10:00');
  });

  it('formats hours:minutes:seconds when over an hour', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
    expect(formatDuration(7325)).toBe('2:02:05');
  });
});

describe('formatScore', () => {
  it('formats with default 1 decimal', () => {
    expect(formatScore(8)).toBe('8.0');
    expect(formatScore(7.456)).toBe('7.5');
  });

  it('respects custom decimals', () => {
    expect(formatScore(7.456, 2)).toBe('7.46');
    expect(formatScore(10, 0)).toBe('10');
  });
});

describe('formatPercentage', () => {
  it('computes percentage with 1 decimal and % suffix', () => {
    expect(formatPercentage(3, 5)).toBe('60.0%');
    expect(formatPercentage(50, 50)).toBe('100.0%');
    expect(formatPercentage(0, 10)).toBe('0.0%');
  });
});

describe('formatTimeAgo', () => {
  it('returns "vừa xong" for future timestamps (vi)', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    expect(formatTimeAgo(future, 'vi')).toBe('vừa xong');
  });

  it('returns "just now" for future timestamps (en)', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    expect(formatTimeAgo(future, 'en')).toBe('just now');
  });
});
