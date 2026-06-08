import { lazy, Suspense } from 'react';
import { Navigate, RouteObject, useLocation } from 'react-router';
import { ProtectedRoute } from '../../components/auth';
import { StudentLayout } from '../layouts/StudentLayout';
import { KidsLayout } from '../layouts/KidsLayout';
import { UnderConstruction } from '../components/shared';
import { StudentProtectedRoute } from './StudentProtectedRoute';
import { WaitingForClass } from '../features/student/WaitingForClass';
import { TakeExam } from '../features/student/exam';

// ─── Age Group Dashboards ─────────────────────────────────────────────────────
const KidsDashboard = lazy(() =>
  import('../features/student/kids/KidsDashboard').then(m => ({ default: m.KidsDashboard })));
const KidsPractice = lazy(() =>
  import('../features/student/kids/KidsPractice').then(m => ({ default: m.KidsPractice })));
const TeensDashboard = lazy(() =>
  import('../features/student/teens/TeensDashboard').then(m => ({ default: m.TeensDashboard })));
const AdultsDashboard = lazy(() =>
  import('../features/student/adults/AdultsDashboard').then(m => ({ default: m.AdultsDashboard })));

// ─── Existing pages ───────────────────────────────────────────────────────────
const StudentDashboard = lazy(() =>
  import('../features/student/dashboard/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const TestList = lazy(() =>
  import('../features/student/tests/TestList').then(m => ({ default: m.TestList })));
const PracticeList = lazy(() =>
  import('../features/student/practice/PracticeList').then(m => ({ default: m.PracticeList })));
const PracticeSession = lazy(() =>
  import('../features/student/practice/PracticeSession').then(m => ({ default: m.PracticeSession })));
const NotificationList = lazy(() =>
  import('../features/student/notifications/NotificationList').then(m => ({ default: m.NotificationList })));
const StudentLeaderboard = lazy(() =>
  import('../features/student/dashboard/StudentLeaderboard').then(m => ({ default: m.StudentLeaderboard })));
const StudentRewards = lazy(() =>
  import('../features/student/dashboard/StudentRewards').then(m => ({ default: m.StudentRewards })));
const StudentSchedule = lazy(() =>
  import('../features/student/dashboard/StudentSchedule').then(m => ({ default: m.StudentSchedule })));

const StudentExamBrowser = lazy(() =>
  import('../features/student/exams/StudentExamBrowser').then(m => ({ default: m.StudentExamBrowser })));
const StudentVstepExamPage = lazy(() =>
  import('../features/student/exams/StudentVstepExamPage').then(m => ({ default: m.StudentVstepExamPage })));
const VstepResultPage = lazy(() =>
  import('../features/student/exams/VstepResultPage').then(m => ({ default: m.VstepResultPage })));
const StudentIeltsExamPage = lazy(() =>
  import('../features/student/exams/ielts/StudentIeltsExamPage').then(m => ({ default: m.StudentIeltsExamPage })));
const StudentIeltsExamDetail = lazy(() =>
  import('../features/student/exams/ielts/StudentIeltsExamDetail').then(m => ({ default: m.StudentIeltsExamDetail })));

// ─── New pages (gap-filled) ───────────────────────────────────────────────────
const TestTaking = lazy(() =>
  import('../features/student/test-taking/TestTaking').then(m => ({ default: m.TestTaking })));
const ExamLobby = lazy(() =>
  import('../features/student/test-taking/ExamLobby').then(m => ({ default: m.ExamLobby })));
const ResultDetail = lazy(() =>
  import('../features/student/test-taking/ResultDetail').then(m => ({ default: m.ResultDetail })));
const AnswerReview = lazy(() =>
  import('../features/student/test-taking/AnswerReview').then(m => ({ default: m.AnswerReview })));
const TestHistory = lazy(() =>
  import('../features/student/tests/TestHistory').then(m => ({ default: m.TestHistory })));
const Progress = lazy(() =>
  import('../features/student/dashboard/Progress').then(m => ({ default: m.Progress })));
const Profile = lazy(() =>
  import('../features/student/dashboard/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() =>
  import('../features/student/settings').then(m => ({ default: m.Settings })));

// ─── Loading fallback ─────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div
      className="w-10 h-10 border-4 rounded-full animate-spin"
      style={{ borderColor: '#EDE9FE', borderTopColor: '#7C3AED' }}
    />
  </div>
);

function LegacyStudentRedirect() {
  const location = useLocation();
  const target = `${location.pathname.replace(/^\/hoc-sinh/, '/hoc-vien')}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
}

/**
 * Render dashboard phù hợp theo age_group của học viên hiện tại.
 * Kids → redirect sang URL kids riêng (vì layout khác hoàn toàn).
 * Teens / Adults → render dashboard tương ứng dưới StudentLayout chung.
 * Mặc định / chưa phân nhóm → StudentDashboard cũ.
 */
function AdaptiveDashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const ageGroup = user?.age_group;

  if (ageGroup === 'kids') {
    return <Navigate to="/hoc-vien/kids" replace />;
  }
  if (ageGroup === 'adults') {
    return <Suspense fallback={<LoadingFallback />}><AdultsDashboard /></Suspense>;
  }
  if (ageGroup === 'teens') {
    return <Suspense fallback={<LoadingFallback />}><TeensDashboard /></Suspense>;
  }
  return <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>;
}

// Protected Student Layout
function ProtectedStudentLayout() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout />
    </ProtectedRoute>
  );
}

// Protected Kids Layout
function ProtectedKidsLayout() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentProtectedRoute ageGroup="kids">
        <KidsLayout />
      </StudentProtectedRoute>
    </ProtectedRoute>
  );
}

// Protected Teens Layout (uses shared StudentLayout)
function ProtectedTeensLayout() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentProtectedRoute ageGroup="teens">
        <StudentLayout />
      </StudentProtectedRoute>
    </ProtectedRoute>
  );
}

// Protected Adults Layout (uses shared StudentLayout)
function ProtectedAdultsLayout() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentProtectedRoute ageGroup="adults">
        <StudentLayout />
      </StudentProtectedRoute>
    </ProtectedRoute>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export const studentRoutes: RouteObject = {
  path: '/hoc-vien',
  element: <ProtectedStudentLayout />,
  children: [
    {
      index: true,
      element: <AdaptiveDashboard />,
    },
    // Adult/professional endpoints (alias dưới /hoc-vien)
    {
      path: 'khoa-hoc',
      element: <Suspense fallback={<LoadingFallback />}><TestList /></Suspense>,
    },
    {
      path: 'thong-ke',
      element: <Suspense fallback={<LoadingFallback />}><Progress /></Suspense>,
    },
    {
      path: 'muc-tieu',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'chung-chi',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'cho-xep-lop',
      element: <WaitingForClass />,
    },
    // Exam routes
    {
      path: 'lam-bai/:examId',
      element: <Suspense fallback={<LoadingFallback />}><TakeExam /></Suspense>,
    },
    {
      path: 'de-thi',
      element: <Suspense fallback={<LoadingFallback />}><StudentExamBrowser /></Suspense>,
    },
    // Legacy routes (shared functionality)
    {
      path: 'bai-tap',
      element: <Suspense fallback={<LoadingFallback />}><TestList /></Suspense>,
    },
    {
      path: 'luyen-tap',
      element: <Suspense fallback={<LoadingFallback />}><PracticeList /></Suspense>,
    },
    {
      path: 'luyen-tap/:id',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/random',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/mistakes',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/new',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/custom',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'phong-cho/:id',
      element: <Suspense fallback={<LoadingFallback />}><ExamLobby /></Suspense>,
    },
    {
      path: 'lam-bai/:id',
      element: <Suspense fallback={<LoadingFallback />}><TestTaking /></Suspense>,
    },
    {
      path: 'lam-bai-vstep/:examId',
      element: <Suspense fallback={<LoadingFallback />}><StudentVstepExamPage /></Suspense>,
    },
    // ─── IELTS exam routes (full test + per-skill) ─────────────────────
    {
      path: 'de-thi/ielts/:examId',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamDetail /></Suspense>,
    },
    {
      path: 'lam-bai-ielts/:examId',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamPage fullTest /></Suspense>,
    },
    {
      path: 'lam-bai-ielts/:examId/listening',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamPage skill="listening" /></Suspense>,
    },
    {
      path: 'lam-bai-ielts/:examId/reading',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamPage skill="reading" /></Suspense>,
    },
    {
      path: 'lam-bai-ielts/:examId/writing',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamPage skill="writing" /></Suspense>,
    },
    {
      path: 'lam-bai-ielts/:examId/speaking',
      element: <Suspense fallback={<LoadingFallback />}><StudentIeltsExamPage skill="speaking" /></Suspense>,
    },
    {
      path: 'ket-qua/:id',
      element: <Suspense fallback={<LoadingFallback />}><ResultDetail /></Suspense>,
    },
    {
      path: 'ket-qua-vstep/:id',
      element: <Suspense fallback={<LoadingFallback />}><VstepResultPage /></Suspense>,
    },
    {
      path: 'dap-an/:id',
      element: <Suspense fallback={<LoadingFallback />}><AnswerReview /></Suspense>,
    },
    {
      path: 'lich-su',
      element: <Suspense fallback={<LoadingFallback />}><TestHistory /></Suspense>,
    },
    {
      path: 'tien-do',
      element: <Suspense fallback={<LoadingFallback />}><Progress /></Suspense>,
    },
    {
      path: 'ho-so',
      element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>,
    },
    {
      path: 'cai-dat',
      element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>,
    },
    {
      path: 'bang-xep-hang',
      element: <Suspense fallback={<LoadingFallback />}><StudentLeaderboard /></Suspense>,
    },
    {
      path: 'phan-thuong',
      element: <Suspense fallback={<LoadingFallback />}><StudentRewards /></Suspense>,
    },
    {
      path: 'lich-hoc',
      element: <Suspense fallback={<LoadingFallback />}><StudentSchedule /></Suspense>,
    },
    {
      path: '*',
      Component: UnderConstruction,
    },
  ],
};

// ─── KIDS ROUTES (6-12 tuổi) ─────────────────────────────────────────────────
export const kidsRoutes: RouteObject = {
  path: '/hoc-vien/kids',
  element: <ProtectedKidsLayout />,
  children: [
    {
      index: true,
      element: <Suspense fallback={<LoadingFallback />}><KidsDashboard /></Suspense>,
    },
    // Practice (landing + sessions)
    {
      path: 'luyen-tap',
      element: <Suspense fallback={<LoadingFallback />}><KidsPractice /></Suspense>,
    },
    {
      path: 'luyen-tap/random',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/mistakes',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/new',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/custom',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    {
      path: 'luyen-tap/:id',
      element: <Suspense fallback={<LoadingFallback />}><PracticeSession /></Suspense>,
    },
    // Tests (list + lobby + taking + results)
    {
      path: 'bai-tap',
      element: <Suspense fallback={<LoadingFallback />}><TestList /></Suspense>,
    },
    {
      path: 'phong-cho/:id',
      element: <Suspense fallback={<LoadingFallback />}><ExamLobby /></Suspense>,
    },
    {
      path: 'lam-bai/:id',
      element: <Suspense fallback={<LoadingFallback />}><TestTaking /></Suspense>,
    },
    {
      path: 'ket-qua/:id',
      element: <Suspense fallback={<LoadingFallback />}><ResultDetail /></Suspense>,
    },
    {
      path: 'dap-an/:id',
      element: <Suspense fallback={<LoadingFallback />}><AnswerReview /></Suspense>,
    },
    {
      path: 'lich-su',
      element: <Suspense fallback={<LoadingFallback />}><TestHistory /></Suspense>,
    },
    // Kids-only / placeholder
    {
      path: 'hoc-bai',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'huy-hieu',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'thanh-tich',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'ho-so',
      element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>,
    },
    {
      path: 'cai-dat',
      element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>,
    },
    {
      path: '*',
      element: <Navigate to="/hoc-vien/kids" replace />,
    },
  ],
};

// ─── TEENS ROUTES (13-17 tuổi) ───────────────────────────────────────────────
export const teensRoutes: RouteObject = {
  path: '/hoc-vien/teens',
  element: <ProtectedTeensLayout />,
  children: [
    {
      index: true,
      element: <Suspense fallback={<LoadingFallback />}><TeensDashboard /></Suspense>,
    },
    {
      path: 'lessons',
      element: <Suspense fallback={<LoadingFallback />}><TestList /></Suspense>,
    },
    {
      path: 'progress',
      element: <Suspense fallback={<LoadingFallback />}><Progress /></Suspense>,
    },
    {
      path: 'achievements',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'leaderboard',
      element: <Suspense fallback={<LoadingFallback />}><StudentLeaderboard /></Suspense>,
    },
    {
      path: 'notifications',
      element: <Suspense fallback={<LoadingFallback />}><NotificationList /></Suspense>,
    },
    {
      path: 'settings',
      element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>,
    },
    {
      path: '*',
      element: <Navigate to="/hoc-vien/teens" replace />,
    },
  ],
};

// ─── ADULTS ROUTES (18+ tuổi) ─────────────────────────────────────────────────
export const adultsRoutes: RouteObject = {
  path: '/hoc-vien/adults',
  element: <ProtectedAdultsLayout />,
  children: [
    {
      index: true,
      element: <Suspense fallback={<LoadingFallback />}><AdultsDashboard /></Suspense>,
    },
    {
      path: 'courses',
      element: <Suspense fallback={<LoadingFallback />}><TestList /></Suspense>,
    },
    {
      path: 'de-thi',
      element: <Suspense fallback={<LoadingFallback />}><StudentExamBrowser /></Suspense>,
    },
    {
      path: 'analytics',
      element: <Suspense fallback={<LoadingFallback />}><Progress /></Suspense>,
    },
    {
      path: 'goals',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'certifications',
      element: <Suspense fallback={<LoadingFallback />}><UnderConstruction /></Suspense>,
    },
    {
      path: 'schedule',
      element: <Suspense fallback={<LoadingFallback />}><StudentSchedule /></Suspense>,
    },
    {
      path: 'settings',
      element: <Suspense fallback={<LoadingFallback />}><Settings /></Suspense>,
    },
    {
      path: '*',
      element: <Navigate to="/hoc-vien/adults" replace />,
    },
  ],
};

export const studentLegacyRoutes: RouteObject = {
  path: '/hoc-sinh/*',
  element: <LegacyStudentRedirect />,
};
