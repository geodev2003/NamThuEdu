/**
 * teacherRoutes — Tất cả route dành cho giáo viên.
 * Base path: "/giao-vien" — Layout: TeacherLayout (sidebar xanh dương).
 * 
 * ✅ Protected by authentication - requires teacher role
 */
import { lazy } from "react";
import { ProtectedRoute } from "../../components/auth";
import { TeacherLayout } from "../layouts/TeacherLayout";
import { Dashboard } from "../features/teacher/dashboard";
import { CourseDetail } from "../features/teacher/courses/CourseDetail";
import { ClassList, CreateClass, TransferClass, ClassStats } from "../features/teacher/classes";
import { StudentManagement, AddStudent, ImportStudents } from "../features/teacher/students";
import { Settings } from "../features/teacher/settings";
import { UnderConstruction } from "../components/shared";

// Course
import { CourseList } from "../features/teacher/courses/CourseList";
import { CreateCourse } from "../features/teacher/courses/CreateCourse";
import { EditCourse } from "../features/teacher/courses/EditCourse";
import { ManageStudents } from "../features/teacher/courses/ManageStudents";
import { CourseStats } from "../features/teacher/courses/CourseStats";

// Exam
import { AllExams } from "../features/teacher/exams/AllExams";
import CreateExam from "../features/teacher/exams/CreateExam";
import { CreateVSTEPExam } from "../features/teacher/exams/CreateVSTEPExam";
import { ExamDetail } from "../features/teacher/exams/ExamDetail";
import { ExamPreview } from "../features/teacher/exams/ExamPreview";
import { ExamPreviewNew } from "../features/teacher/exams/ExamPreviewNew";
import { VstepExamPreview } from "../features/teacher/exams/VstepExamPreview";
import { EditExam } from "../features/teacher/exams/EditExam";
import { ExamTemplates } from "../features/teacher/exams/ExamTemplates";
import { MyExams } from "../features/teacher/exams/MyExams";
import CreateKidsExam from "../features/teacher/exams/kids/CreateKidsExam";
import { CreateVstepReading } from "../features/teacher/exams/vstep/CreateVstepReading";
import { CreateVstepListening } from "../features/teacher/exams/vstep/CreateVstepListening";
import { CreateVstepWriting } from "../features/teacher/exams/vstep/CreateVstepWriting";
import { CreateVstepSpeaking } from "../features/teacher/exams/vstep/CreateVstepSpeaking";
import { CreateVstepFull } from "../features/teacher/exams/vstep/CreateVstepFull";
import { TestExamPlayer } from "../features/test";

// Assignment
import { AssignmentList } from "../features/teacher/assignments/AssignmentList";
import { AssignmentProgress } from "../features/teacher/assignments/AssignmentProgress";
import { AssignmentStats } from "../features/teacher/assignments/AssignmentStats";
import { CreateAssignment } from "../features/teacher/assignments/CreateAssignment";

// Practice
import { PracticeSessionList } from "../features/teacher/practice/PracticeSessionList";

// Grading
import { GradingQueue } from "../features/teacher/grading/GradingQueue";
import { GradingDetail } from "../features/teacher/grading/GradingDetail";
import { ClassReport } from "../features/teacher/grading/ClassReport";
import { GradingStats } from "../features/teacher/grading/GradingStats";

// Monitoring
import { LiveMonitoring } from "../features/teacher/monitoring/LiveMonitoring";
import { StudentDetail } from "../features/teacher/monitoring/StudentDetail";
import { ConnectionHistory } from "../features/teacher/monitoring/ConnectionHistory";
import { RealtimeStats } from "../features/teacher/monitoring/RealtimeStats";

// Blog
import { BlogList } from "../features/teacher/blog/BlogList";
import { CreatePost } from "../features/teacher/blog/CreatePost";
import { PostDetail } from "../features/teacher/blog/PostDetail";
import { ContentStats } from "../features/teacher/blog/ContentStats";
import { Categories } from "../features/teacher/blog/Categories";

// Reports
import { ReportsOverview } from "../features/teacher/reports/ReportsOverview";
import { StudentProgress } from "../features/teacher/reports/StudentProgress";
import { ResultsAnalysis } from "../features/teacher/reports/ResultsAnalysis";
import { ExportReports } from "../features/teacher/reports/ExportReports";

// Protected Teacher Layout
function ProtectedTeacherLayout() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <TeacherLayout />
    </ProtectedRoute>
  );
}

export const teacherRoutes = {
  path: "/giao-vien",
  Component: ProtectedTeacherLayout,
  children: [
    // Dashboard
    { index: true, Component: Dashboard },

    // Học viên
    { path: "students", Component: StudentManagement },
    { path: "students/them-moi", Component: AddStudent },
    { path: "students/import", Component: ImportStudents },

    // Lớp học
    { path: "lop-hoc", Component: ClassList },
    { path: "lop-hoc/danh-sach", Component: ClassList },
    { path: "lop-hoc/tao-moi", Component: CreateClass },
    { path: "lop-hoc/chuyen-lop", Component: TransferClass },
    { path: "lop-hoc/thong-ke", Component: ClassStats },

    // Khóa học
    { path: "khoa-hoc", Component: CourseList },
    { path: "khoa-hoc/tao-moi", Component: CreateCourse },
    { path: "khoa-hoc/quan-ly-students", Component: ManageStudents },
    { path: "khoa-hoc/thong-ke", Component: CourseStats },
    { path: "khoa-hoc/:courseId", Component: CourseDetail },
    { path: "khoa-hoc/:courseId/chinh-sua", Component: EditCourse },

    // Ngân hàng đề
    { path: "de-thi", Component: AllExams },
    { path: "de-thi/tat-ca", Component: AllExams },
    { path: "de-thi/tao-moi", Component: CreateExam },
    { path: "de-thi/tao-moi/:examId", Component: CreateExam }, // With exam ID
    { path: "de-thi/tao-thu-cong", Component: lazy(() => import("@/app/features/teacher/exams/CreateExamManual").then(m => ({ default: m.CreateExamManual }))) },
    { path: "de-thi/import", Component: lazy(() => import("@/app/features/teacher/exams/ImportExam").then(m => ({ default: m.ImportExam }))) },
    { path: "de-thi/kids/tao-moi", Component: CreateKidsExam },
    { path: "de-thi/kids/tao-moi/:examId", Component: CreateKidsExam },
    { path: "de-thi/vstep/reading/tao-moi", Component: CreateVstepReading }, // NEW: VSTEP Reading
    { path: "de-thi/vstep/listening/tao-moi", Component: CreateVstepListening }, // NEW: VSTEP Listening
    { path: "de-thi/vstep/writing/tao-moi", Component: CreateVstepWriting }, // NEW: VSTEP Writing
    { path: "de-thi/vstep/speaking/tao-moi", Component: CreateVstepSpeaking }, // NEW: VSTEP Speaking
    { path: "de-thi/vstep/full/tao-moi", Component: CreateVstepFull }, // NEW: VSTEP Full Test (4 skills)
    { path: "de-thi/mau-de", Component: ExamTemplates },
    { path: "de-thi/cua-toi", Component: MyExams },
    { path: "de-thi/:examId", Component: ExamDetail },
    { path: "de-thi/:examId/vstep", Component: VstepExamPreview }, // VSTEP exam preview
    { path: "de-thi/:examId/xem", Component: ExamPreview },
    { path: "de-thi/:examId/xem-moi", Component: ExamPreviewNew }, // NEW: Test shared component
    { path: "de-thi/:examId/chinh-sua", Component: EditExam },
    { path: "test-exam/:examId", Component: TestExamPlayer }, // TEST: Drag & drop testing

    // Giao bài thi
    { path: "bai-tap", Component: AssignmentList },
    { path: "bai-tap/danh-sach", Component: AssignmentList },
    { path: "bai-tap/:assignmentId/tien-do", Component: AssignmentProgress },
    { path: "bai-tap/thong-ke", Component: AssignmentStats },
    { path: "bai-tap/giao-moi", Component: CreateAssignment },

    // Luyện tập
    { path: "luyen-tap", Component: PracticeSessionList },
    { path: "luyen-tap/theo-chu-de", Component: PracticeSessionList },
    { path: "luyen-tap/theo-mau", Component: PracticeSessionList },
    { path: "luyen-tap/ngau-nhien", Component: PracticeSessionList },

    // Chấm bài
    { path: "cham-diem", Component: GradingQueue },
    { path: "cham-diem/:submissionId", Component: GradingDetail },
    { path: "cham-diem/bao-cao-lop", Component: ClassReport },
    { path: "cham-diem/thong-ke", Component: GradingStats },

    // Giám sát trực tiếp
    { path: "giam-sat-truc-tiep", Component: LiveMonitoring },
    { path: "giam-sat-truc-tiep/:studentId", Component: StudentDetail },
    { path: "giam-sat-truc-tiep/lich-su", Component: ConnectionHistory },
    { path: "giam-sat-truc-tiep/thong-ke", Component: RealtimeStats },

    // Blog & Bài viết
    { path: "bai-viet", Component: BlogList },
    { path: "bai-viet/tao-moi", Component: CreatePost },
    { path: "bai-viet/danh-muc", Component: Categories },
    { path: "bai-viet/thong-ke", Component: ContentStats },
    { path: "bai-viet/:postId", Component: PostDetail },
    { path: "bai-viet/:postId/chinh-sua", Component: CreatePost },

    // Báo cáo
    { path: "bao-cao", Component: ReportsOverview },
    { path: "bao-cao/tien-do-students", Component: StudentProgress },
    { path: "bao-cao/phan-tich", Component: ResultsAnalysis },
    { path: "bao-cao/xuat-bao-cao", Component: ExportReports },

    // Cài đặt
    { path: "cai-dat", Component: Settings },

    // Catch-all
    { path: "*", Component: UnderConstruction },
  ],
};