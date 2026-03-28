/**
 * Adaptive Dashboard
 * 
 * Main dashboard component that switches between age-specific variants
 * based on the user's age group theme
 */

import { useQuery } from '@tanstack/react-query';
import { useAgeGroup } from '../../../../hooks/useAgeGroup';
import { studentApi } from '../../../../services/studentApi';
import { DashboardKids, DashboardTeens, DashboardAdults } from './variants';

export function AdaptiveDashboard() {
  const { ageGroup } = useAgeGroup();

  // Fetch dashboard data
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['student', 'progress'],
    queryFn: () => studentApi.getProgress(),
  });

  const { data: testsData, isLoading: testsLoading } = useQuery({
    queryKey: ['student', 'tests', 'pending'],
    queryFn: () => studentApi.getTests({ status: 'pending' }),
  });

  const isLoading = progressLoading || testsLoading;

  // Transform data for dashboard variants
  const progress = (progressData as any)?.data?.data;
  const pendingTests = (testsData as any)?.data?.data?.pending || [];

  const stats = {
    pendingTests: pendingTests.length,
    averageScore: progress?.overview?.average_score || 0,
    totalTests: progress?.overview?.total_tests || 0,
    recentScore: progress?.overview?.recent_score || 0,
    streak: progress?.streak?.current_streak || 0,
    xp: progress?.gamification?.xp || 1240,
    level: progress?.gamification?.level || 5,
    badges: progress?.gamification?.badges_count || 12,
    rank: progress?.leaderboard?.rank || 15,
    totalUsers: progress?.leaderboard?.total_users || 150,
    completionRate: progress?.overview?.completion_rate || 85,
    studyTime: progress?.time_tracking?.total_hours || 24,
    certificates: progress?.achievements?.certificates || 3,
    goalsCompleted: progress?.goals?.completed || 8,
    totalGoals: progress?.goals?.total || 10,
  };

  // Render age-appropriate dashboard
  switch (ageGroup) {
    case 'kids':
      return <DashboardKids stats={stats} isLoading={isLoading} />;
    
    case 'teens':
      return <DashboardTeens stats={stats} isLoading={isLoading} />;
    
    case 'adults':
      return <DashboardAdults stats={stats} isLoading={isLoading} />;
    
    default:
      // Default to teens if age group not set
      return <DashboardTeens stats={stats} isLoading={isLoading} />;
  }
}
