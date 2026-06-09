import { test, expect } from '@playwright/test';
import { gotoApp, seedAuth, snap } from '../utils/helpers';

/**
 * PHASE 5.3 (flow) — Luồng làm bài học viên ở mức UI.
 *
 * App chạy mock data → ta xác minh các trang trong luồng làm bài render được
 * và điều hướng không vỡ: danh sách bài tập → (lobby) → làm bài → kết quả.
 * Các bước phụ thuộc dữ liệu động được bọc phòng thủ để không giòn.
 */
test.describe('Student exam-taking flow (UI)', () => {
  test.beforeEach(async ({ page }) => { await seedAuth(page, 'student-teens'); });

  test('exam list page renders with content or empty state', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/bai-tap');
    await expect(page.locator('#root')).not.toBeEmpty();
    // Có hoặc danh sách bài, hoặc empty-state — cả hai đều hợp lệ
    await snap(page, 'flow-exam-list');
  });

  test('exam lobby route renders for a sample id', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/phong-cho/1');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'flow-exam-lobby');
  });

  test('test-taking route renders for a sample id', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/lam-bai/1');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'flow-test-taking');
  });

  test('result detail route renders for a sample id', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/ket-qua/1');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'flow-result-detail');
  });

  test('answer review route renders for a sample id', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/dap-an/1');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'flow-answer-review');
  });

  test('notifications page renders', async ({ page }) => {
    await gotoApp(page, '/hoc-vien/thong-bao');
    await expect(page.locator('#root')).not.toBeEmpty();
    await snap(page, 'flow-notifications');
  });
});
