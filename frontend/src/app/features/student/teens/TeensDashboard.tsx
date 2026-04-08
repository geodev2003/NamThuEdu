import { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Award, Zap, Target, Clock, Trophy, Star } from 'lucide-react';
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

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  color,
  bgColor 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  subtitle: string;
  trend?: string;
  color: string;
  bgColor: string;
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-md p-5 border-t-4 ${color} hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-gray-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
};

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = "#6366f1" 
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export function TeensDashboard() {
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-indigo-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const data = gamificationData;
  const overallProgress = data ? Math.min(100, ((data.stats.lessons_completed + data.stats.exams_taken) / 70) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Hey {user?.uName || 'Student'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.class?.name || 'Ready to level up your skills?'}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-lg font-bold text-indigo-600">
                  {data?.stats.total_points > 1000 ? 'Advanced' : 
                   data?.stats.total_points > 500 ? 'Intermediate' : 'Beginner'}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400">
                <span className="text-2xl">🪙</span>
                <span className="text-xl font-bold text-yellow-700">{data?.coins.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            title="Total Score"
            value={data?.stats.total_points || 0}
            subtitle="Points earned"
            trend={data?.stats.total_points ? `+${Math.round(data.stats.total_points / 10)}%` : '0%'}
            color="border-indigo-500"
            bgColor="bg-white"
          />

          <StatCard
            icon={BookOpen}
            title="Lessons Done"
            value={data?.stats.lessons_completed || 0}
            subtitle={`${data?.stats.exams_taken || 0} exams taken`}
            trend={`${data?.stats.lessons_completed || 0}/50`}
            color="border-purple-500"
            bgColor="bg-white"
          />

          <StatCard
            icon={Award}
            title="Achievements"
            value={data?.badges.earned || 0}
            subtitle="Badges earned"
            trend={data?.badges.earned ? 'New!' : 'Start learning!'}
            color="border-pink-500"
            bgColor="bg-white"
          />

          <StatCard
            icon={Zap}
            title="Streak"
            value={data?.streak.current || 0}
            subtitle="Days in a row"
            trend={`${data?.streak.current || 0} day${(data?.streak.current || 0) !== 1 ? 's' : ''}`}
            color="border-orange-500"
            bgColor="bg-white"
          />
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Overall Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <ProgressRing percentage={overallProgress} color="#6366f1" />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {overallProgress >= 80 ? "Excellent work! 🌟" : 
                   overallProgress >= 60 ? "Great progress! 💪" : 
                   overallProgress >= 30 ? "Keep it up! 📈" : "Just getting started! 🚀"}
                </p>
                <p className="text-sm text-gray-500">
                  {data?.stats.lessons_completed || 0} lessons • {data?.stats.exams_taken || 0} exams
                </p>
              </div>
            </div>
          </div>

          {/* Study Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">Study Stats</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Study Time</span>
                <span className="font-bold text-lg">{Math.round((data?.stats.study_time_minutes || 0) / 60)}h</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-bold text-lg">{Math.round(data?.stats.average_score || 0)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Practice Sessions</span>
                <span className="font-bold text-lg">{data?.stats.practice_sessions || 0}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {data?.achievements.completed || 0} of {data?.achievements.total || 10} achievements
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data?.achievements.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                📚 Continue Learning
              </button>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                🎮 Practice Mode
              </button>
              
              <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                🏆 View Achievements
              </button>
              
              <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                📊 Progress Report
              </button>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-lg p-8 text-center border border-indigo-200">
          <div className="text-4xl mb-4">
            {data?.streak.current && data.streak.current > 0 ? '🔥' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            {data?.streak.current && data.streak.current > 0 
              ? `${data.streak.current} Day Streak! Keep it going! 🔥`
              : "Ready to start your learning streak? 💪"}
          </h2>
          <p className="text-indigo-600 text-lg">
            {data?.streak.current && data.streak.current > 0
              ? "You're on fire! Don't break the chain - study today to keep your streak alive!"
              : "Start studying today to begin building your learning streak!"}
          </p>
        </div>
      </div>
    </div>
  );
}
