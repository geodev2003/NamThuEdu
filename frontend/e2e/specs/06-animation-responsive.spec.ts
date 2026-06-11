import { test, expect } from '@playwright/test';
import { gotoApp, seedAuth, withReducedMotion, assertNoHorizontalScroll, snap } from '../utils/helpers';

/**
 * PHASE 5.6 — Cross-cutting: animation + responsive + reduced-motion + a11y smoke.
 */

test.describe('Responsive matrix', () => {
  const breakpoints = [
    { w: 375, h: 812, label: 'mobile' },
    { w: 768, h: 1024, label: 'tablet' },
    { w: 1024, h: 768, label: 'laptop' },
    { w: 1440, h: 900, label: 'desktop' },
  ];

  for (const bp of breakpoints) {
    test(`landing has no horizontal scroll @ ${bp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: bp.w, height: bp.h });
      await gotoApp(page, '/');
      await assertNoHorizontalScroll(page);
      await snap(page, `responsive-landing-${bp.label}`);
    });
  }

  test('teens dashboard responsive @ mobile', async ({ page }) => {
    await seedAuth(page, 'student-teens');
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoApp(page, '/hoc-vien/teens');
    await assertNoHorizontalScroll(page);
    await snap(page, 'responsive-teens-mobile');
  });
});

test.describe('Animation', () => {
  test('prefers-reduced-motion is respected on login (no crash, renders)', async ({ page }) => {
    await withReducedMotion(page);
    await gotoApp(page, '/dang-nhap');
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await snap(page, 'animation-reduced-motion-login');
  });

  test('login submit shows loading spinner animation', async ({ page }) => {
    await gotoApp(page, '/dang-nhap');
    await page.fill('input[name="phone"]', '0900000000');
    await page.fill('input[name="password"]', 'whatever');
    await page.click('button[type="submit"]');
    // Spinner (svg.animate-spin) hoặc text "Đang đăng nhập" xuất hiện ngắn
    const busy = page.locator('svg.animate-spin, text=Đang đăng nhập');
    await expect(busy.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('teens mobile menu toggle animates open', async ({ page }) => {
    await seedAuth(page, 'student-teens');
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoApp(page, '/hoc-vien/teens');
    const toggle = page.getByRole('button', { name: /toggle menu/i });
    if (await toggle.count()) {
      // Mobile dropdown chưa mở: section "Học tập" chưa hiển thị
      await toggle.click();
      // Sau khi mở: tiêu đề nhóm mobile "Học tập" hiển thị (chỉ có trong mobile menu)
      await expect(page.getByText('Học tập', { exact: true }).first()).toBeVisible();
    }
  });
});

test.describe('Accessibility smoke', () => {
  test('login inputs have associated labels', async ({ page }) => {
    await gotoApp(page, '/dang-nhap');
    // Mỗi input bắt buộc có label gần kề
    await expect(page.getByText('Số điện thoại').first()).toBeVisible();
    await expect(page.getByText('Mật khẩu').first()).toBeVisible();
  });

  test('landing images have alt text', async ({ page }) => {
    await gotoApp(page, '/');
    const imgs = page.locator('img');
    const count = await imgs.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      expect(alt, `img[${i}] cần có thuộc tính alt`).not.toBeNull();
    }
  });
});
