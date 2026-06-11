/**
 * adminPreviewRoutes — Route "Xem trước đề" cho admin.
 *
 * Khác các route admin thường: KHÔNG bọc trong AdminLayout (sidebar) mà render
 * full-screen đúng UI học viên sẽ thấy khi thi. Vẫn bảo vệ bằng
 * ProtectedRoute requiredRole="admin".
 *
 * Base path: "/admin/de-thi/xem/*"
 *  - kids/:examId            → ExamPreview (kids/Cambridge YLE)
 *  - vstep/:examId           → VstepExamPreview (4 skill)
 *  - ielts/:skill/:examId    → IeltsPreviewPage
 *  - ielts/:skill/thu/:examId → IeltsTestPreviewPage (demo làm bài, chỉ xem)
 *  - thpt/:examId            → AdminThptPreview
 */
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "../../components/auth";

const ExamPreview = lazy(() =>
  import("../features/teacher/exams/ExamPreview").then((m) => ({ default: m.ExamPreview }))
);
const VstepExamPreview = lazy(() =>
  import("../features/teacher/exams/VstepExamPreview").then((m) => ({ default: m.VstepExamPreview }))
);
const IeltsPreviewPage = lazy(() =>
  import("../features/teacher/exams/ielts/IeltsPreviewPage").then((m) => ({ default: m.IeltsPreviewPage }))
);
const IeltsTestPreviewPage = lazy(() =>
  import("../features/teacher/exams/ielts/IeltsTestPreviewPage").then((m) => ({ default: m.IeltsTestPreviewPage }))
);
const AdminThptPreview = lazy(() =>
  import("../features/admin/courses/preview/AdminThptPreview").then((m) => ({ default: m.AdminThptPreview }))
);

const BACK_TO = "/admin/courses";

function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        {children}
      </Suspense>
    </ProtectedRoute>
  );
}

export const adminPreviewRoutes = {
  path: "/admin/de-thi/xem",
  children: [
    {
      path: "kids/:examId",
      element: (
        <AdminGuard>
          <ExamPreview admin backTo={BACK_TO} />
        </AdminGuard>
      ),
    },
    {
      path: "vstep/:examId",
      element: (
        <AdminGuard>
          <VstepExamPreview admin backTo={BACK_TO} />
        </AdminGuard>
      ),
    },
    {
      path: "ielts/:skill/:examId",
      element: (
        <AdminGuard>
          <IeltsPreviewPage admin backTo={BACK_TO} />
        </AdminGuard>
      ),
    },
    {
      // Demo làm bài IELTS (bấm "LUYỆN TẬP" từ trang xem trước) — chỉ xem, không lưu
      path: "ielts/:skill/thu/:examId",
      element: (
        <AdminGuard>
          <IeltsTestPreviewPage admin />
        </AdminGuard>
      ),
    },
    {
      path: "thpt/:examId",
      element: (
        <AdminGuard>
          <AdminThptPreview />
        </AdminGuard>
      ),
    },
  ],
};
