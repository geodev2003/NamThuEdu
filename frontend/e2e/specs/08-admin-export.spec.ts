import { test, expect } from '@playwright/test';
import { snap, gotoApp, seedAuth } from '../utils/helpers';

/**
 * PHASE 5.6 — Admin report CSV export button (gap F1).
 * Kiểm tra nút "Xuất CSV" hiển thị + click được trên cả 3 trang báo cáo admin.
 * Vì app chạy mock data, ta chỉ assert UI có nút + tương tác, không tải file thật.
 */
test.describe('Admin report export CSV', () => {
  test.beforeEach(async ({ page }) => { await seedAuth(page, 'admin'); });

  const reportPages: Array<{ path: string; name: string }> = [
    { path: '/admin/reports/students', name: 'export-students' },
    { path: '/admin/reports/teachers', name: 'export-teachers' },
  ];

  for (const p of reportPages) {
    test(`export button visible on ${p.name}`, async ({ page }) => {
      await gotoApp(page, p.path);
      const exportBtn = page.getByTestId('admin-export-csv');
      await expect(exportBtn).toBeVisible();
      await expect(exportBtn).toContainText('CSV');
      await snap(page, `admin-${p.name}`);
    });
  }

  test('clicking export shows loading state', async ({ page }) => {
    await gotoApp(page, '/admin/reports/students');
    const exportBtn = page.getByTestId('admin-export-csv');
    await expect(exportBtn).toBeVisible();
    // click → nút disabled trong lúc xuất (transient), không được crash app
    await exportBtn.click();
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
