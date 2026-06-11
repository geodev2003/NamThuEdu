import { test, expect } from '@playwright/test';
import { snap, gotoApp, seedAuth, assertNoHorizontalScroll } from '../utils/helpers';

/**
 * PHASE 5.3 — Student portals (Kids / Teens / Adults).
 * Seed auth state để vào thẳng dashboard từng age-group + các trang con.
 * (Mock data on → dữ liệu hiển thị giả lập.)
 */

test.describe('Student — Teens', () => {
  test.beforeEach(async ({ page }) => { await seedAuth(page, 'student-teens'); });

  test('teens dashboard renders (teal theme)', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-teens-dashboard');
  });

  test('teens exam list (bài tập) loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens/bai-tap');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-teens-exams');
  });

  test('teens history (lịch sử thi) loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens/lich-su');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-teens-history');
  });

  test('teens progress (tiến độ) loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens/tien-do');
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('teens achievements (thành tích) loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens/thanh-tich');
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('teens leaderboard (bảng xếp hạng) loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens/bang-xep-hang');
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('teens dashboard no horizontal scroll', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/teens');
    await assertNoHorizontalScroll(page);
  });
});

test.describe('Student — Kids', () => {
  test.beforeEach(async ({ page }) => { await seedAuth(page, 'student-kids'); });

  test('kids dashboard renders (colorful theme)', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/kids');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-kids-dashboard');
  });
});

test.describe('Student — Adults', () => {
  test.beforeEach(async ({ page }) => { await seedAuth(page, 'student-adults'); });

  test('adults dashboard renders (professional theme)', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/adults');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-adults-dashboard');
  });

  test('adults exam browser loads', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/adults/de-thi');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'student-adults-exam-browser');
  });
});
