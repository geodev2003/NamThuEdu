import { useState, useEffect } from 'react';
import { BarChart3, BookOpen, Target, Clock, TrendingUp, Award, Users, Calendar } from 'lucide-react';
import axios from 'axios';

interface GamificationData {
  coins: {
    total: number;
    lifetime: number;
    spent: number;
  };
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
  badges: {
    earned: number;
  };
  achievements: {
    completed: number;
    total: number;
    percentage: number;
  };
}

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend,
  color 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  subtitle: string;
  trend?: string;
  color: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        {trend && (
          <div className="text-right">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50'
            }`}>
              {trend}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

const ProgressChart = ({ 
  title, 
  current, 
  total, 
  color 
}: { 
  title: string; 
  current: number; 
  total: number; 
  color: string;
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm text-gray-500">{current}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">{Math.round(percentage)}% completed</p>
    </div>
  );
};

export function AdultsDashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/student/gamification/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.status === 'success') {
          setGamificationData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const data = gamificationData;
  const studyHours = Math.round((data?.stats.study_time_minutes || 0) / 60);
  const overallProgress = data ? Math.min(100, ((data.stats.lessons_completed + data.stats.exams_taken) / 70) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.uName || 'Professional'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.class?.name || 'Continue your professional development journey'}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-lg font-bold text-orange-600">
                  {data?.stats.total_points > 2000 ? 'Expert' : 
                   data?.stats.total_points > 1000 ? 'Advanced' : 
                   data?.stats.total_points > 500 ? 'Intermediate' : 'Beginner'}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg border border-orange-200">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-lg font-bold text-orange-700">{data?.coins.total || 0} Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={BarChart3}
            title="Overall Progress"
            value={`${Math.round(overallProgress)}%`}
            subtitle="Course completion rate"
            trend={overallProgress > 0 ? `+${Math.round(overallProgress / 10)}%` : '0%'}
            color="#EA580C"
          />

          <MetricCard
            icon={BookOpen}
            title="Completed Lessons"
            value={data?.stats.lessons_completed || 0}
            subtitle={`${data?.stats.exams_taken || 0} assessments taken`}
            trend={`${data?.stats.lessons_completed || 0}/50 lessons`}
            color="#0EA5E9"
          />

          <MetricCard
            icon={Target}
            title="Average Score"
            value={`${Math.round(data?.stats.average_score || 0)}%`}
            subtitle="Performance across all assessments"
            trend={data?.stats.average_score > 80 ? 'Excellent' : data?.stats.average_score > 60 ? 'Good' : 'Improving'}
            color="#10B981"
          />

          <MetricCard
            icon={Clock}
            title="Study Time"
            value={`${studyHours}h`}
            subtitle="Total learning hours this month"
            trend={`${data?.streak.current || 0} day streak`}
            color="#8B5CF6"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Learning Progress */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
            </div>
            
            <div className="space-y-6">
              <ProgressChart
                title="Course Completion"
                current={data?.stats.lessons_completed || 0}
                total={50}
                color="#EA580C"
              />
              
              <ProgressChart
                title="Assessments Completed"
                current={data?.stats.exams_taken || 0}
                total={20}
                color="#0EA5E9"
              />
              
              <ProgressChart
                title="Practice Sessions"
                current={data?.stats.practice_sessions || 0}
                total={30}
                color="#10B981"
              />
              
              <ProgressChart
                title="Achievements Unlocked"
                current={data?.achievements.completed || 0}
                total={data?.achievements.total || 10}
                color="#8B5CF6"
              />
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Performance</h2>
            </div>
            
            <div className="space-y-6">
              {/* Score Distribution */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Score Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-bold text-lg text-gray-900">{Math.round(data?.stats.average_score || 0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Points</span>
                    <span className="font-bold text-lg text-gray-900">{data?.stats.total_points || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Badges Earned</span>
                    <span className="font-bold text-lg text-gray-900">{data?.badges.earned || 0}</span>
                  </div>
                </div>
              </div>

              {/* Study Consistency */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Study Consistency</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="font-bold text-lg text-orange-600">{data?.streak.current || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Longest Streak</span>
                    <span className="font-bold text-lg text-gray-900">{data?.streak.longest || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Days</span>
                    <span className="font-bold text-lg text-gray-900">{data?.streak.total_active_days || 0}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    📊 View Detailed Analytics
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    📚 Continue Learning Path
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    🎯 Set Learning Goals
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    📈 Generate Progress Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Continue Course</h3>
                <p className="text-sm text-gray-500">Resume where you left off</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Take Assessment</h3>
                <p className="text-sm text-gray-500">Test your knowledge</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Study Groups</h3>
                <p className="text-sm text-gray-500">Join peer discussions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Schedule</h3>
                <p className="text-sm text-gray-500">Plan your learning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg shadow-sm p-8 text-center border border-orange-200">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">
              {data?.streak.current && data.streak.current > 0 ? '🔥' : '🎯'}
            </div>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
              {data?.streak.current && data.streak.current > 0 
                ? `${data.streak.current} Day Learning Streak!`
                : "Ready to advance your career?"}
            </h2>
            <p className="text-orange-600 text-lg mb-6">
              {data?.streak.current && data.streak.current > 0
                ? "Consistency is key to professional growth. Keep up the excellent work!"
                : "Invest in yourself with structured learning designed for working professionals."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-lg text-sm font-semibold">
                📊 Professional Analytics
              </span>
              <span className="px-4 py-2 bg-red-200 text-red-800 rounded-lg text-sm font-semibold">
                🎯 Goal-Oriented Learning
              </span>
              <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-lg text-sm font-semibold">
                📈 Career Development
              </span>
              <span className="px-4 py-2 bg-green-200 text-green-800 rounded-lg text-sm font-semibold">
                🏆 Industry Recognition
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
