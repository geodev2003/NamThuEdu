import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router';
import { StudentLayout } from '../layouts/StudentLayout';

// ─── Existing pages ───────────────────────────────────────────────────────────
const StudentDashboard = lazy(() =>
  import('../features/student/dashboard/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const TestList = lazy(() =>
  import('../features/student/tests/TestList').then(m => ({ default: m.TestList })));
const PracticeList = lazy(() =>
  import('../features/student/practice/PracticeList').then(m => ({ default: m.PracticeList })));
const NotificationList = lazy(() =>
  import('../features/student/notifications/NotificationList').then(m => ({ default: m.NotificationList })));

// ─── New pages (gap-filled) ───────────────────────────────────────────────────
const TestTaking = lazy(() =>
  import('../features/student/test-taking/TestTaking').then(m => ({ default: m.TestTaking })));
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

// ─── Loading fallback ─────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div
      className="w-10 h-10 border-4 rounded-full animate-spin"
      style={{ borderColor: '#EDE9FE', borderTopColor: '#7C3AED' }}
    />
  </div>
);

// ─── Routes ───────────────────────────────────────────────────────────────────
export const studentRoutes: RouteObject = {
  path: '/',
  element: <StudentLayout />,
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
      path: 'thong-bao',
      element: <Suspense fallback={<LoadingFallback />}><NotificationList /></Suspense>,
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
    {
      path: 'tien-do',
      element: <Suspense fallback={<LoadingFallback />}><Progress /></Suspense>,
    },
    {
      path: 'ho-so',
      element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>,
    },
  ],
};

