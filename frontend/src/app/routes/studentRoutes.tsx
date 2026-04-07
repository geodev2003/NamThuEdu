import { lazy, Suspense } from 'react';
import { Navigate, RouteObject, useLocation } from 'react-router';
import { ProtectedRoute } from '../../components/auth';
import { StudentLayout } from '../layouts/StudentLayout';
import { UnderConstruction } from '../components/shared';

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

// ─── New pages (gap-filled) ───────────────────────────────────────────────────
const TestTaking = lazy(() =>
  import('../features/student/test-taking/TestTaking').then(m => ({ default: m.TestTaking })));
const TestTakingVSTEP = lazy(() =>
  import('../features/student/test-taking/TestTakingVSTEP').then(m => ({ default: m.TestTakingVSTEP })));
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

// Protected Student Layout
function ProtectedStudentLayout() {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout />
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
      element: <Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>,
    },
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
      path: 'thong-bao',
      element: <Suspense fallback={<LoadingFallback />}><NotificationList /></Suspense>,
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
      path: 'lam-bai-vstep/:id',
      element: <Suspense fallback={<LoadingFallback />}><TestTakingVSTEP /></Suspense>,
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

export const studentLegacyRoutes: RouteObject = {
  path: '/hoc-sinh/*',
  element: <LegacyStudentRedirect />,
};
