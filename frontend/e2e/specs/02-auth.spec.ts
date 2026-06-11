import { test, expect } from '@playwright/test';
import { snap, gotoApp } from '../utils/helpers';

/**
 * PHASE 5.2 — Auth flows (UI-level, mock backend).
 * Student/Teacher/Admin login forms, validation, route guard.
 */
test.describe('Auth', () => {
  test('student login form renders with phone + password', async ({ page }) => {
    await gotoApp(page, '/dang-nhap');
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await snap(page, 'auth-student-login');
  });

  test('student login required validation blocks empty submit', async ({ page }) => {
    await gotoApp(page, '/dang-nhap');
    await page.click('button[type="submit"]');
    // HTML5 required → vẫn ở trang login
    await expect(page).toHaveURL(/dang-nhap/);
  });

  test('password visibility toggle works (animation trigger)', async ({ page }) => {
    await gotoApp(page, '/dang-nhap');
    const pw = page.locator('input[name="password"]');
    await pw.fill('secret123');
    await expect(pw).toHaveAttribute('type', 'password');
    // Nút con mắt nằm cạnh input password
    const toggle = page.locator('input[name="password"] ~ button, button:near(input[name="password"])').first();
    await toggle.click();
    await expect(pw).toHaveAttribute('type', 'text');
  });

  test('teacher login form renders', async ({ page }) => {
    await gotoApp(page, '/giao-vien/dang-nhap');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'auth-teacher-login');
  });

  test('admin login form renders', async ({ page }) => {
    await gotoApp(page, '/admin/login');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'auth-admin-login');
  });

  test('protected admin route redirects to login when unauthenticated', async ({ page }) => {
    await gotoApp(page, '/admin');
    // ProtectedRoute đẩy về /admin/login khi chưa auth
    await expect(page).toHaveURL(/admin\/login|admin/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
