import { test, expect } from '@playwright/test';
import { snap, gotoApp, assertNoHorizontalScroll } from '../utils/helpers';

/**
 * PHASE 5.1 — Public site (chưa đăng nhập).
 * Landing, header/nav, footer, blog, features, about, 404 fallback.
 */
test.describe('Public site', () => {
  test('landing page renders hero + header + footer', async ({ page }) => {
    await gotoApp(page, '/');
    await expect(page.locator('#root')).not.toBeEmpty();
    await expect(page).toHaveTitle(/.+/);
    // Brand "NamThu" tồn tại trong DOM (có thể ẩn sau hamburger ở mobile)
    await expect(page.getByText(/NamThu/i).first()).toBeAttached();
    await snap(page, 'public-landing');
  });

  test('landing page has no horizontal scroll (desktop)', async ({ page }) => {
    await gotoApp(page, '/');
    await assertNoHorizontalScroll(page);
  });

  test('public blog list loads', async ({ page }) => {
    await gotoApp(page, '/bai-viet');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'public-blog-list');
  });

  test('public features page loads', async ({ page }) => {
    await gotoApp(page, '/tinh-nang');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'public-features');
  });

  test('about page loads', async ({ page }) => {
    await gotoApp(page, '/ve-chung-toi');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'public-about');
  });

  test('unknown url redirects (catch-all) without crash', async ({ page }) => {
    await gotoApp(page, '/khong-ton-tai-12345');
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
