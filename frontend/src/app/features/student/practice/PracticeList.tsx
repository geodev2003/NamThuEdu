import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Zap,
  Target,
  Shuffle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { getSkillColor, getSkillIcon, getSkillName } from "../../../../utils/skillHelpers";

type SkillFilter = 'all' | 'listening' | 'reading' | 'writing' | 'speaking';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";

export function PracticeList() {
  const [skill, setSkill] = useState<SkillFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'practice', 'topics'],
    queryFn: () => studentApi.getPracticeTopics(),
  });

  const topics = (data as any)?.data?.data?.topics || [];

  const filteredTopics = topics.filter((topic: any) => {
    if (skill !== 'all' && topic.skill !== skill) return false;
    if (difficulty !== 'all' && topic.difficulty !== difficulty) return false;
    return true;
  });

  const quickActions = [
    { icon: Shuffle, title: "Luyện ngẫu nhiên", desc: "10 câu hỏi tổng hợp", color: "#8B5CF6", path: "/luyen-tap/random?count=10", bg: "#F5F3FF" },
    { icon: AlertCircle, title: "Ôn lại lỗi sai", desc: "Các câu hay sai gần đây", color: "#EF4444", path: "/luyen-tap/mistakes", bg: "#FEF2F2" },
    { icon: BookOpen, title: "Khám phá mới", desc: "Các chủ đề chưa học", color: "#10B981", path: "/luyen-tap/new", bg: "#F0FDF4" },
    { icon: Target, title: "Tạo bộ đề riêng", desc: "Tuỳ biến cấp độ và số lượng", color: "#F59E0B", path: "/luyen-tap/custom", bg: "#FFFBEB" },
  ];

  const skillTabs = [
    { key: 'all', label: "Tất cả kỹ năng" },
    { key: 'listening', label: "Nghe (Listening)" },
    { key: 'reading', label: "Đọc (Reading)" },
    { key: 'writing', label: "Viết (Writing)" },
    { key: 'speaking', label: "Nói (Speaking)" },
  ];

  const getDifficultyColor = (diff: string) => {
    if (diff === 'easy') return { text: '#10B981', bg: '#D1FAE5' };
    if (diff === 'medium') return { text: '#2563EB', bg: '#DBEAFE' };
    if (diff === 'hard') return { text: '#EF4444', bg: '#FEE2E2' };
    return { text: '#6B7280', bg: '#F3F4F6' };
  };

  return (
    <div className="py-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F1344", letterSpacing: "-0.03em" }}>
          Khu vực Luyện tập
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
          Tự do rèn luyện thông qua kho đề khổng lồ trên hệ thống
        </p>
      </div>

      {/* Quick Actions (Grid 1 -> 2 -> 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.path}
                className="group p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "#fff", border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 30px ${action.color}15`;
                  e.currentTarget.style.borderColor = `${action.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02)";
                  e.currentTarget.style.borderColor = "#F0EEFF";
                }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: action.bg }}>
               <action.icon className="w-6 h-6" style={{ color: action.color }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1F1344", marginBottom: 4 }}>{action.title}</h3>
            <p style={{ fontSize: 13, color: "#6B7280" }}>{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8" style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 8px 32px rgba(124,58,237,0.04)" }}>
         <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-8">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F1344" }}>Chủ đề luyện tập</h2>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
              {skillTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSkill(tab.key as SkillFilter)}
                  className="px-4 py-2 rounded-xl whitespace-nowrap transition-all"
                  style={{
                    background: skill === tab.key ? PURPLE : "#F3F4F6",
                    color: skill === tab.key ? "#fff" : "#6B7280",
                    fontWeight: skill === tab.key ? 700 : 600,
                    fontSize: 14,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
         </div>

         {/* Topics Grid */}
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
               {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
         ) : filteredTopics.length === 0 ? (
            <div className="text-center py-20">
               <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <p className="font-bold text-gray-500 text-lg">Không tìm thấy chủ đề phù hợp</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
               {filteredTopics.map((topic: any) => {
                  const Icon = getSkillIcon(topic.skill);
                  const color = getSkillColor(topic.skill);
                  const diffColor = getDifficultyColor(topic.difficulty);
                  const progress = topic.total_questions > 0 ? (topic.completed_questions / topic.total_questions) * 100 : 0;
                  const isLocked = topic.is_locked;

                  return (
                    <div key={topic.id} className="group flex flex-col justify-between p-5 rounded-3xl transition-all"
                         style={{
                           background: isLocked ? "#F9FAFB" : "#fff",
                           border: "1.5px solid",
                           borderColor: isLocked ? "#F3F4F6" : "#F0EEFF",
                           opacity: isLocked ? 0.7 : 1
                         }}>
                       <div>
                          <div className="flex justify-between items-start mb-4">
                             <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                                {isLocked ? <Lock className="w-5 h-5 text-gray-400" /> : <Icon className="w-5 h-5" style={{ color }} />}
                             </div>
                             <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: diffColor.bg, color: diffColor.text }}>
                                {topic.difficulty}
                             </span>
                          </div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F1344", marginBottom: 8 }} className="line-clamp-2 h-12">
                             {topic.name}
                          </h3>

                          {/* Progress */}
                          <div className="mb-6">
                            <div className="flex justify-between text-xs mb-2">
                               <span className="text-gray-500 font-semibold">{topic.completed_questions}/{topic.total_questions} câu</span>
                               <span style={{ color: color, fontWeight: 800 }}>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden bg-gray-100">
                               <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: color }} />
                            </div>
                          </div>
                       </div>

                       {/* Footer Action */}
                       <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-xs font-semibold text-gray-400">
                             ~{topic.estimated_time} phút
                          </span>
                          {!isLocked && (
                             <Link to={`/luyen-tap/${topic.id}`}
                                   className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                   style={{ background: `${color}15`, color: color }}>
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                             </Link>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
         )}
      </div>
    </div>
  );
}
