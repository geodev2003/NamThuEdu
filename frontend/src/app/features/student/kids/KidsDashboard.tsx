import { useState, useEffect } from 'react';
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

// Kids Components
const CoinDisplay = ({ coins }: { coins: number }) => {
  return (
    <div className="flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full border-4 border-yellow-400 shadow-lg">
      <span className="text-4xl animate-bounce">🪙</span>
      <span className="text-3xl font-bold text-yellow-700">{coins}</span>
    </div>
  );
};

const KidsStatsCard = ({ 
  icon, 
  title, 
  value, 
  message, 
  color,
  bgColor 
}: { 
  icon: string; 
  title: string; 
  value: string | number; 
  message: string;
  color: string;
  bgColor: string;
}) => {
  return (
    <div className={`${bgColor} border-4 ${color} rounded-3xl shadow-2xl p-6 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-6xl">{icon}</span>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-4xl font-bold text-purple-600">{value}</p>
        </div>
      </div>
      <p className="text-lg text-gray-700 font-semibold">{message}</p>
    </div>
  );
};

const ProgressBar = ({ 
  label, 
  current, 
  total, 
  color = "blue" 
}: { 
  label: string; 
  current: number; 
  total: number; 
  color?: string;
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const stars = Math.ceil(percentage / 20);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">{label}</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-3xl">
              {i < stars ? '⭐' : '⚪'}
            </span>
          ))}
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
        <div 
          className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 transition-all duration-1000 flex items-center justify-center`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        >
          <span className="text-white font-bold text-lg">{Math.round(percentage)}%</span>
        </div>
      </div>
      <p className="text-lg text-center font-bold text-purple-600">
        {percentage >= 80 ? "Xuất sắc! Bạn làm rất tốt! 🌟" : 
         percentage >= 60 ? "Tốt lắm! Tiếp tục phát huy nhé! 💪" : 
         "Bạn đang cố gắng! Cố lên nhé! 😊"}
      </p>
    </div>
  );
};

export function KidsDashboard() {
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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-8xl animate-spin">🎨</div>
          <p className="text-3xl font-bold text-purple-600">
            Đang tải... Chờ chút nhé! 🚀
          </p>
        </div>
      </div>
    );
  }

  const data = gamificationData;
  const streakDays = data?.streak.current || 0;
  const totalLessons = data?.stats.lessons_completed || 0;
  const totalBadges = data?.badges.earned || 0;
  const coins = data?.coins.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header với Coins */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-400">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">😊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Xin chào {user?.uName || 'bạn nhỏ'}! 🎉
                </h1>
                <p className="text-xl text-gray-600">Hôm nay bạn học gì nhỉ? ✨</p>
              </div>
            </div>
            <CoinDisplay coins={coins} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KidsStatsCard
            icon="📚"
            title="Bài học"
            value={totalLessons}
            message={totalLessons > 0 ? "Bạn học giỏi quá! 🌟" : "Hãy bắt đầu học nhé! 📖"}
            color="border-blue-400"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          />
          
          <KidsStatsCard
            icon="🏆"
            title="Huy hiệu"
            value={totalBadges}
            message={totalBadges > 0 ? "Tuyệt vời! Bạn có nhiều huy hiệu! 🎊" : "Làm bài để nhận huy hiệu! 🎯"}
            color="border-orange-400"
            bgColor="bg-gradient-to-br from-orange-100 to-yellow-200"
          />
          
          <KidsStatsCard
            icon="🔥"
            title="Chuỗi ngày"
            value={`${streakDays} ngày`}
            message={streakDays > 0 ? "Bạn học đều đặn quá! 💪" : "Hãy học mỗi ngày nhé! 📅"}
            color="border-red-400"
            bgColor="bg-gradient-to-br from-red-100 to-pink-200"
          />
          
          <KidsStatsCard
            icon="⭐"
            title="Điểm số"
            value={data?.stats.total_points || 0}
            message={data?.stats.total_points ? "Điểm số cao quá! 🚀" : "Làm bài để nhận điểm! 🎯"}
            color="border-purple-400"
            bgColor="bg-gradient-to-br from-purple-100 to-indigo-200"
          />
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Learning Progress */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">📈</span>
              <h2 className="text-3xl font-bold text-gray-900">Tiến độ học tập</h2>
            </div>
            
            <div className="space-y-6">
              <ProgressBar
                label="Bài học hoàn thành"
                current={data?.stats.lessons_completed || 0}
                total={50} // Giả sử có 50 bài học
                color="blue"
              />
              
              <ProgressBar
                label="Bài kiểm tra"
                current={data?.stats.exams_taken || 0}
                total={20} // Giả sử có 20 bài kiểm tra
                color="green"
              />
            </div>
          </div>

          {/* Achievements Progress */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">🎯</span>
              <h2 className="text-3xl font-bold text-gray-900">Thành tích</h2>
            </div>
            
            <div className="space-y-6">
              <ProgressBar
                label="Thành tích đạt được"
                current={data?.achievements.completed || 0}
                total={data?.achievements.total || 10}
                color="purple"
              />
              
              <div className="text-center space-y-4">
                <div className="text-6xl">🏅</div>
                <p className="text-2xl font-bold text-purple-600">
                  {data?.achievements.completed || 0} / {data?.achievements.total || 10} thành tích
                </p>
                <p className="text-lg text-gray-700">
                  {(data?.achievements.completed || 0) > 0 
                    ? "Bạn đang làm rất tốt! Tiếp tục nhé! 🌟" 
                    : "Hãy hoàn thành bài học để mở khóa thành tích! 🎁"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="
            bg-gradient-to-r from-blue-400 to-purple-500 
            text-white text-2xl font-bold 
            rounded-3xl p-8 
            shadow-2xl border-4 border-blue-300
            hover:scale-105 hover:shadow-3xl 
            transition-all duration-200
            min-h-[120px]
          ">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl">📚</span>
              <span>Học bài mới! 🚀</span>
            </div>
          </button>
          
          <button className="
            bg-gradient-to-r from-green-400 to-blue-500 
            text-white text-2xl font-bold 
            rounded-3xl p-8 
            shadow-2xl border-4 border-green-300
            hover:scale-105 hover:shadow-3xl 
            transition-all duration-200
            min-h-[120px]
          ">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl">🎮</span>
              <span>Luyện tập! 💪</span>
            </div>
          </button>
          
          <button className="
            bg-gradient-to-r from-yellow-400 to-orange-500 
            text-white text-2xl font-bold 
            rounded-3xl p-8 
            shadow-2xl border-4 border-yellow-300
            hover:scale-105 hover:shadow-3xl 
            transition-all duration-200
            min-h-[120px]
          ">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl">🏆</span>
              <span>Xem huy hiệu! ✨</span>
            </div>
          </button>
        </div>

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-3xl shadow-2xl p-8 border-4 border-pink-400 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Bạn đang làm rất tốt!
          </h2>
          <p className="text-xl text-purple-600">
            {streakDays > 0 
              ? `Bạn đã học ${streakDays} ngày liên tiếp! Tuyệt vời! 🔥`
              : "Hãy học mỗi ngày để xây dựng chuỗi ngày học tập nhé! 📅"}
          </p>
        </div>
      </div>
    </div>
  );
}
