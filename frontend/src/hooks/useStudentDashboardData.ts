/**
 * useStudentDashboardData
 *
 * Hook dùng chung cho TeensDashboard và AdultsDashboard.
 *
 * Trích xuất phần data fetching trùng lặp giữa hai dashboard:
 *   - gamification/overview, in-progress, upcoming, reminders, tests/pending,
 *     analytics/skills, analytics/today
 *
 * Lưu ý:
 * - Không thay đổi shape dữ liệu so với code cũ — các component giữ nguyên
 *   cách đọc state.
 * - Dùng Promise.allSettled để 1 endpoint fail không sập cả dashboard
 *   (giữ nguyên hành vi cũ).
 * - dismissReminder được expose để UI gọi khi học viên đóng reminder.
 */

import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  studentApi,
  type InProgressTest,
  type UpcomingTest,
  type TeacherReminder,
  type TestAssignment,
  type TodayActivity,
} from '../services/studentApi';

export interface GamificationData {
  coins: { total: number; lifetime: number; spent: number };
  stats: {
    lessons_completed: number;
    exams_taken: number;
    practice_sessions: number;
    total_points: number;
    average_score: number;
    study_time_minutes: number;
  };
  streak: {
    current: number;
    longest: number;
    last_activity: string | null;
    total_active_days: number;
  };
  badges: { earned: number };
  achievements: { completed: number; total: number; percentage: number };
}

export type SkillStats = Record<
  string,
  { attempts: number; average_score: number; best_score: number }
>;

export interface UseStudentDashboardDataOptions {
  /**
   * Hàm filter pending assignments (chạy sau khi nhận về danh sách từ server).
   * Mặc định không lọc gì.
   */
  filterPending?: (a: TestAssignment) => boolean;
  /** Số ngày nhìn về phía trước cho upcoming. Mặc định 30. */
  upcomingDays?: number;
}

export interface UseStudentDashboardDataReturn {
  loading: boolean;
  error: string | null;
  gam: GamificationData | null;
  inProgress: InProgressTest[];
  upcoming: UpcomingTest[];
  reminders: TeacherReminder[];
  pendingAssignments: TestAssignment[];
  skillStats: SkillStats | null;
  today: TodayActivity | null;
  /** Loại bỏ một reminder khỏi state sau khi dismiss thành công. */
  dismissReminder: (reminderId: number) => Promise<void>;
}

export function useStudentDashboardData(
  options: UseStudentDashboardDataOptions = {},
): UseStudentDashboardDataReturn {
  const { filterPending, upcomingDays = 30 } = options;

  const [gam, setGam] = useState<GamificationData | null>(null);
  const [inProgress, setInProgress] = useState<InProgressTest[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingTest[]>([]);
  const [reminders, setReminders] = useState<TeacherReminder[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<TestAssignment[]>([]);
  const [skillStats, setSkillStats] = useState<SkillStats | null>(null);
  const [today, setToday] = useState<TodayActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [gamRes, inProgRes, upcomingRes, remindersRes, testsRes, skillsRes, todayRes] =
          await Promise.allSettled([
            api.get('/student/gamification/overview'),
            studentApi.getInProgressTests(),
            studentApi.getUpcomingTests({ days: upcomingDays }),
            studentApi.getReminders(),
            studentApi.getTests({ status: 'pending' }),
            api.get('/student/analytics/skills'),
            studentApi.getTodayActivity(),
          ]);

        if (!mounted) return;

        if (gamRes.status === 'fulfilled' && (gamRes.value as any)?.data?.status === 'success') {
          setGam((gamRes.value as any).data.data);
        } else {
          setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.');
        }

        if (
          inProgRes.status === 'fulfilled' &&
          (inProgRes.value as any)?.data?.status === 'success'
        ) {
          setInProgress((inProgRes.value as any).data.data || []);
        }

        if (
          upcomingRes.status === 'fulfilled' &&
          (upcomingRes.value as any)?.data?.status === 'success'
        ) {
          setUpcoming((upcomingRes.value as any).data.data || []);
        }

        if (
          remindersRes.status === 'fulfilled' &&
          (remindersRes.value as any)?.data?.status === 'success'
        ) {
          const payload = (remindersRes.value as any).data.data;
          setReminders(Array.isArray(payload?.reminders) ? payload.reminders : []);
        }

        if (testsRes.status === 'fulfilled') {
          const d = (testsRes.value as any)?.data?.data;
          const list: TestAssignment[] = Array.isArray(d?.pending) ? d.pending : [];
          setPendingAssignments(filterPending ? list.filter(filterPending) : list);
        }

        if (
          skillsRes.status === 'fulfilled' &&
          (skillsRes.value as any)?.data?.status === 'success'
        ) {
          setSkillStats((skillsRes.value as any).data.data || null);
        }

        if (
          todayRes.status === 'fulfilled' &&
          (todayRes.value as any)?.data?.status === 'success'
        ) {
          setToday((todayRes.value as any).data.data || null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chạy 1 lần khi mount, đồng nhất với hành vi cũ ở 2 dashboard

  const dismissReminder = async (reminderId: number) => {
    try {
      await studentApi.dismissReminder(reminderId);
      setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    } catch {
      /* silent — UI có thể retry */
    }
  };

  return {
    loading,
    error,
    gam,
    inProgress,
    upcoming,
    reminders,
    pendingAssignments,
    skillStats,
    today,
    dismissReminder,
  };
}
