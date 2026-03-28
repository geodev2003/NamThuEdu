import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  Clock,
  AlertCircle,
  Play,
  Search,
  Filter,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { getSkillColor, getSkillIcon, getSkillName } from "../../../../utils/skillHelpers";

type TestStatus = 'all' | 'pending' | 'in_progress' | 'completed';
type TestType = 'all' | 'IELTS' | 'VSTEP' | 'TOEIC';
type TestSkill = 'all' | 'listening' | 'reading' | 'writing' | 'speaking';

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";

function mergeVstepIntoSingleTest(items: any[]) {
  const vstepItems = items.filter((t) => String(t.exam_type || "").toUpperCase() === "VSTEP");
  if (vstepItems.length <= 1) return items;

  const nonVstep = items.filter((t) => String(t.exam_type || "").toUpperCase() !== "VSTEP");
  const status = vstepItems.some((t) => t.status === "in_progress")
    ? "in_progress"
    : vstepItems.some((t) => t.status === "pending")
    ? "pending"
    : "completed";

  const merged = {
    ...vstepItems[0],
    assignment_id: vstepItems[0]?.assignment_id,
    submission_id: vstepItems.find((t) => t.submission_id)?.submission_id,
    exam_title: "VSTEP Full Skills Test",
    exam_type: "VSTEP",
    exam_skill: "listening",
    exam_duration: vstepItems.reduce((sum, t) => sum + Number(t.exam_duration || 0), 0) || 179,
    total_questions: vstepItems.reduce((sum, t) => sum + Number(t.total_questions || 0), 0) || 80,
    attempts_allowed: Math.max(...vstepItems.map((t) => Number(t.attempts_allowed || 1))),
    attempts_used: Math.max(...vstepItems.map((t) => Number(t.attempts_used || 0))),
    is_urgent: vstepItems.some((t) => Boolean(t.is_urgent)),
    status,
  };

  return [...nonVstep, merged];
}

export function TestList() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<TestStatus>('pending');
  const [type, setType] = useState<TestType>('all');
  const [skill, setSkill] = useState<TestSkill>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'tests', status, type, skill],
    queryFn: () => studentApi.getTests({ 
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type,
      skill: skill === 'all' ? undefined : skill,
    }),
  });

  const allTests = (data as any)?.data?.data;
  const pending = (allTests?.pending || []).map((t: any) => ({ ...t, status: 'pending' }));
  const inProgress = (allTests?.in_progress || []).map((t: any) => ({ ...t, status: 'in_progress' }));
  const completed = (allTests?.completed || []).map((t: any) => ({ ...t, status: 'completed' }));

  const normalizedTests = mergeVstepIntoSingleTest([...pending, ...inProgress, ...completed]);

  const currentTests = status === 'all'
    ? normalizedTests
    : normalizedTests.filter((t: any) => t.status === status);

  const filteredTests = currentTests.filter(test =>
    search ? test.exam_title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const tabs = [
    { key: 'all', label: t('common.all'), count: normalizedTests.length },
    { key: 'pending', label: t('student.tests.available'), count: normalizedTests.filter((x: any) => x.status === 'pending').length },
    { key: 'in_progress', label: t('student.tests.inProgress'), count: normalizedTests.filter((x: any) => x.status === 'in_progress').length },
    { key: 'completed', label: t('student.tests.completed'), count: normalizedTests.filter((x: any) => x.status === 'completed').length },
  ];

  return (
    <div className="py-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F1344", letterSpacing: "-0.03em" }}>
          Bài tập của tôi
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
          Danh sách các bài tập giáo viên giao cần hoàn thành
        </p>
      </div>

      {/* Control Panel (Filters & Search) */}
      <div className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
           style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key as TestStatus)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap"
              style={{
                background: status === tab.key ? PURPLE : "transparent",
                color: status === tab.key ? "#fff" : "#6B7280",
                border: status === tab.key ? "none" : "1.5px solid transparent",
                fontWeight: status === tab.key ? 700 : 600,
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                if (status !== tab.key) e.currentTarget.style.background = PURPLE_LIGHT;
              }}
              onMouseLeave={(e) => {
                if (status !== tab.key) e.currentTarget.style.background = "transparent";
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    background: status === tab.key ? "rgba(255,255,255,0.2)" : "#E5E7EB",
                    color: status === tab.key ? "#fff" : "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Select */}
        <div className="flex items-center gap-3">
          <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder={t('common.search') + "..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
              style={{ fontSize: 14, background: "#F9FAFB", border: "1.5px solid #F0EEFF", color: "#1F1344" }}
              onFocus={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = PURPLE;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${PURPLE}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "#F9FAFB";
                e.currentTarget.style.borderColor = "#F0EEFF";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as TestType)}
            className="px-4 py-2.5 rounded-xl outline-none transition-all cursor-pointer"
            style={{ fontSize: 14, fontWeight: 600, background: "#F9FAFB", border: "1.5px solid #F0EEFF", color: "#374151" }}
          >
            <option value="all">Loại bài</option>
            <option value="IELTS">IELTS</option>
            <option value="VSTEP">VSTEP</option>
          </select>

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value as TestSkill)}
            className="px-4 py-2.5 rounded-xl outline-none transition-all cursor-pointer"
            style={{ fontSize: 14, fontWeight: 600, background: "#F9FAFB", border: "1.5px solid #F0EEFF", color: "#374151" }}
          >
            <option value="all">Kỹ năng</option>
            <option value="listening">Nghe</option>
            <option value="reading">Đọc</option>
            <option value="writing">Viết</option>
            <option value="speaking">Nói</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-white animate-pulse" style={{ border: "1.5px solid #F0EEFF" }} />
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl" style={{ border: "1.5px dashed #E5E7EB" }}>
           <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4" style={{ background: PURPLE_LIGHT }}>
              <CheckCircle className="w-10 h-10" style={{ color: PURPLE }} />
           </div>
           <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F1344" }}>Tuyệt vời! Bạn không còn bài tập nào.</h3>
           <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8 }}>Hãy thử luyện tập thêm để nâng cao kỹ năng nhé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
           {filteredTests.map((test) => {
              const Icon = getSkillIcon(test.exam_skill);
              const color = getSkillColor(test.exam_skill);
              const isUrgent = test.is_urgent;
              const canStart = test.attempts_used < test.attempts_allowed;
              const isCompleted = test.status === 'completed';

              return (
                <div key={test.assignment_id} className="relative bg-white rounded-3xl p-6 transition-all duration-300 group hover:-translate-y-1"
                     style={{
                        border: "1.5px solid #F0EEFF",
                        boxShadow: "0 4px 20px rgba(124,58,237,0.03)"
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 12px 32px ${color}15`;
                        e.currentTarget.style.borderColor = `${color}40`;
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.03)";
                        e.currentTarget.style.borderColor = "#F0EEFF";
                     }}>
                   
                   {/* Urgent Badge */}
                   {isUrgent && !isCompleted && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                           style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                         <AlertCircle className="w-3.5 h-3.5" />
                         <span style={{ fontSize: 11, fontWeight: 800 }}>SẮP HẾT HẠN</span>
                      </div>
                   )}

                   {/* Icon */}
                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: `${color}15` }}>
                      <Icon className="w-7 h-7" style={{ color }} />
                   </div>

                   {/* Title */}
                   <h3 className="line-clamp-2" style={{ fontSize: 18, fontWeight: 800, color: "#1F1344", lineHeight: 1.4, height: 50, marginBottom: 8 }}>
                      {test.exam_title}
                   </h3>

                   {/* Labels */}
                   <div className="flex gap-2 mb-6">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: `${color}15`, color: color }}>
                         {getSkillName(test.exam_skill)}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "#F3F4F6", color: "#4B5563" }}>
                         {test.exam_type}
                      </span>
                   </div>

                   {/* Stats Area */}
                   <div className="space-y-3 mb-6 p-4 rounded-2xl" style={{ background: "#F9FAFB" }}>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm text-gray-500">
                           <ClipboardList className="w-4 h-4" /> Số câu hỏi
                         </span>
                         <span className="font-bold text-gray-700">{test.total_questions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm text-gray-500">
                           <Clock className="w-4 h-4" /> Thời gian
                         </span>
                         <span className="font-bold text-gray-700">{test.exam_duration} phút</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm text-gray-500">
                           <BookOpen className="w-4 h-4" /> Số lần làm
                         </span>
                         <span className="font-bold text-gray-700">{test.attempts_used}/{test.attempts_allowed}</span>
                      </div>
                   </div>

                   {/* Action Footer */}
                   {isCompleted ? (
                      <Link to={`/ket-qua/${test.submission_id}`}
                            className="w-full flex justify-between items-center px-5 py-3.5 rounded-xl font-bold transition-opacity hover:opacity-90"
                            style={{ background: "#F0FDF4", color: "#16A34A" }}>
                         <span>Đã hoàn thành</span>
                         <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                   ) : (
                      <Link to={`/lam-bai/${test.assignment_id}`}
                            className={`w-full flex justify-between items-center px-5 py-3.5 rounded-xl font-bold transition-opacity ${canStart ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
                            style={{ background: color, color: "#fff" }}
                            onClick={(e) => !canStart && e.preventDefault()}>
                         <span>{test.attempts_used > 0 ? "Tiếp tục làm" : "Làm bài ngay"}</span>
                         <Play className="w-5 h-5 ml-2 fill-current" />
                      </Link>
                   )}
                </div>
              );
           })}
        </div>
      )}
    </div>
  );
}
