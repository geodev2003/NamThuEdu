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
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Layers,
  FileCheck,
  Grid3x3,
  List,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { getSkillColor, getSkillIcon } from "../../../../utils/skillHelpers";

type TestStatus = 'all' | 'pending' | 'in_progress' | 'completed';
type TestType = 'all' | 'IELTS' | 'VSTEP' | 'TOEIC';
type TestFormat = 'all' | 'FULL_4_SKILLS' | 'MINI_MOCK' | 'DIAGNOSTIC';
type ViewMode = 'grid' | 'list';

// Modern Blue/Cyan Theme
const PRIMARY = "#0EA5E9"; // Sky Blue
const PRIMARY_LIGHT = "#E0F2FE"; // Light Sky
const PRIMARY_MID = "#38BDF8"; // Bright Sky
const ACCENT = "#06B6D4"; // Cyan
const ACCENT_LIGHT = "#CFFAFE"; // Light Cyan

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

function getFormatMeta(format?: string) {
  const key = String(format || 'FULL_4_SKILLS').toUpperCase();
  if (key === 'MINI_MOCK') {
    return { label: 'Mini Mock', icon: Layers, color: '#06B6D4', bg: '#CFFAFE' };
  }
  if (key === 'DIAGNOSTIC') {
    return { label: 'Diagnostic', icon: Target, color: '#F59E0B', bg: '#FEF3C7' };
  }
  return { label: 'Full 4 Skills', icon: FileCheck, color: '#0EA5E9', bg: '#E0F2FE' };
}

export function TestList() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<TestStatus>('pending');
  const [type, setType] = useState<TestType>('all');
  const [format, setFormat] = useState<TestFormat>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'tests', status, type],
    queryFn: () => studentApi.getTests({ 
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type,
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

  const filteredTests = currentTests.filter(test => {
    const bySearch = search ? test.exam_title.toLowerCase().includes(search.toLowerCase()) : true;
    const byFormat = format === 'all' ? true : String(test.exam_format || 'FULL_4_SKILLS').toUpperCase() === format;
    return bySearch && byFormat;
  });

  const tabs = [
    { key: 'all', label: 'Tất cả', count: normalizedTests.length, icon: ClipboardList },
    { key: 'pending', label: 'Chưa làm', count: normalizedTests.filter((x: any) => x.status === 'pending').length, icon: Clock },
    { key: 'in_progress', label: 'Đang làm', count: normalizedTests.filter((x: any) => x.status === 'in_progress').length, icon: Play },
    { key: 'completed', label: 'Hoàn thành', count: normalizedTests.filter((x: any) => x.status === 'completed').length, icon: CheckCircle },
  ];

  // Calculate stats
  const stats = {
    total: normalizedTests.length,
    pending: normalizedTests.filter((x: any) => x.status === 'pending').length,
    urgent: normalizedTests.filter((x: any) => x.is_urgent && x.status !== 'completed').length,
    completed: normalizedTests.filter((x: any) => x.status === 'completed').length,
  };

  const hasActiveFilters = type !== 'all' || format !== 'all' || search !== '';

  return (
    <div className="py-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Hero Section with Stats */}
      <div className="relative overflow-hidden rounded-3xl p-8"
           style={{
             background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_MID} 50%, ${ACCENT} 100%)`,
           }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
             style={{ background: "rgba(255,255,255,0.3)" }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
             style={{ background: "rgba(255,255,255,0.5)" }} />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                Bài tập của tôi
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
                Quản lý và hoàn thành các bài tập được giao
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: viewMode === 'grid' ? "rgba(255,255,255,0.25)" : "transparent",
                  color: "#fff",
                }}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: viewMode === 'list' ? "rgba(255,255,255,0.25)" : "transparent",
                  color: "#fff",
                }}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Tổng bài tập", value: stats.total, icon: ClipboardList, color: "#fff" },
              { label: "Chưa làm", value: stats.pending, icon: Clock, color: "#FCD34D" },
              { label: "Cần gấp", value: stats.urgent, icon: AlertCircle, color: "#FCA5A5" },
              { label: "Hoàn thành", value: stats.completed, icon: Award, color: "#86EFAC" },
            ].map((stat) => (
              <div key={stat.label}
                   className="p-4 rounded-2xl backdrop-blur-sm"
                   style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{ background: "rgba(255,255,255,0.2)" }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key as TestStatus)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all whitespace-nowrap group"
              style={{
                background: status === tab.key ? PRIMARY : "#fff",
                color: status === tab.key ? "#fff" : "#6B7280",
                border: `2px solid ${status === tab.key ? PRIMARY : "#E0F2FE"}`,
                fontWeight: 700,
                fontSize: 15,
                boxShadow: status === tab.key ? `0 8px 24px ${PRIMARY}30` : "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (status !== tab.key) {
                  e.currentTarget.style.background = PRIMARY_LIGHT;
                  e.currentTarget.style.borderColor = `${PRIMARY}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (status !== tab.key) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#E0F2FE";
                }
              }}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    background: status === tab.key ? "rgba(255,255,255,0.25)" : "#F3F4F6",
                    color: status === tab.key ? "#fff" : "#374151",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Filters Bar */}
      <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-xl rounded-2xl p-4"
           style={{ border: "2px solid #E0F2FE", boxShadow: "0 4px 24px rgba(14,165,233,0.08)" }}>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all"
              style={{ fontSize: 15, background: "#F9FAFB", border: "2px solid transparent", color: "#1F1344", fontWeight: 500 }}
              onFocus={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = PRIMARY;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${PRIMARY}15`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = "#F9FAFB";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-all"
            style={{ background: showFilters ? PRIMARY : "#F3F4F6", color: showFilters ? "#fff" : "#374151" }}
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* Filters (Desktop always visible, Mobile toggle) */}
          <div className={`flex items-center gap-3 ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TestType)}
              className="px-5 py-3.5 rounded-xl outline-none transition-all cursor-pointer font-semibold"
              style={{ fontSize: 14, background: type !== 'all' ? PRIMARY_LIGHT : "#F9FAFB", border: `2px solid ${type !== 'all' ? PRIMARY : "#E0F2FE"}`, color: type !== 'all' ? PRIMARY : "#374151" }}
            >
              <option value="all">Tất cả loại</option>
              <option value="IELTS">IELTS</option>
              <option value="VSTEP">VSTEP</option>
              <option value="TOEIC">TOEIC</option>
            </select>

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as TestFormat)}
              className="px-5 py-3.5 rounded-xl outline-none transition-all cursor-pointer font-semibold"
              style={{ fontSize: 14, background: format !== 'all' ? PRIMARY_LIGHT : "#F9FAFB", border: `2px solid ${format !== 'all' ? PRIMARY : "#E0F2FE"}`, color: format !== 'all' ? PRIMARY : "#374151" }}
            >
              <option value="all">Tất cả dạng</option>
              <option value="FULL_4_SKILLS">Full 4 kỹ năng</option>
              <option value="MINI_MOCK">Mini mock</option>
              <option value="DIAGNOSTIC">Diagnostic</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setType('all');
                  setFormat('all');
                  setSearch('');
                }}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all hover:bg-red-50"
                style={{ color: "#EF4444", border: "2px solid #FEE2E2" }}
              >
                <X className="w-4 h-4" />
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 600 }}>
            Hiển thị <span style={{ color: PRIMARY, fontWeight: 800 }}>{filteredTests.length}</span> bài tập
            {hasActiveFilters && <span> (đã lọc)</span>}
          </p>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
          : "space-y-4"}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className={viewMode === 'grid' ? "h-80" : "h-32"} 
                 style={{ background: "#F9FAFB", borderRadius: 24, border: "2px solid #E0F2FE" }}>
              <div className="animate-pulse h-full" />
            </div>
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl" style={{ border: "2px dashed #E5E7EB" }}>
           <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${PRIMARY_LIGHT}, #BAE6FD)` }}>
              <CheckCircle className="w-12 h-12" style={{ color: PRIMARY }} />
           </div>
           <h3 style={{ fontSize: 22, fontWeight: 900, color: "#1F1344", marginBottom: 8 }}>
             {hasActiveFilters ? "Không tìm thấy bài tập" : "Tuyệt vời! Không còn bài tập nào"}
           </h3>
           <p style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 24 }}>
             {hasActiveFilters 
               ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
               : "Hãy thử luyện tập thêm để nâng cao kỹ năng nhé"}
           </p>
           {hasActiveFilters && (
             <button
               onClick={() => {
                 setType('all');
                 setFormat('all');
                 setSearch('');
               }}
               className="px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
               style={{ background: PRIMARY, color: "#fff" }}
             >
               Xóa bộ lọc
             </button>
           )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
           {filteredTests.map((test) => {
              const formatMeta = getFormatMeta(test.exam_format);
              const Icon = formatMeta.icon;
              const color = formatMeta.color;
              const isUrgent = test.is_urgent;
              const canStart = test.attempts_used < test.attempts_allowed;
              const isCompleted = test.status === 'completed';
              const progress = test.attempts_allowed > 0 ? (test.attempts_used / test.attempts_allowed) * 100 : 0;

              return (
                <div key={test.assignment_id} 
                     className="relative bg-white rounded-3xl p-6 transition-all duration-300 group"
                     style={{
                        border: "2px solid #E0F2FE",
                        boxShadow: "0 4px 20px rgba(14,165,233,0.04)"
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 16px 40px ${color}20`;
                        e.currentTarget.style.borderColor = `${color}60`;
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.04)";
                        e.currentTarget.style.borderColor = "#E0F2FE";
                     }}>
                   
                   {/* Urgent Badge */}
                   {isUrgent && !isCompleted && (
                      <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-2 rounded-xl animate-pulse"
                           style={{ background: "#FEF2F2", color: "#DC2626", border: "2px solid #FCA5A5", boxShadow: "0 4px 12px rgba(220,38,38,0.2)" }}>
                         <AlertCircle className="w-4 h-4" />
                         <span style={{ fontSize: 12, fontWeight: 900 }}>URGENT</span>
                      </div>
                   )}

                   {/* Icon with gradient background */}
                   <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${color}15, ${color}25)` }}>
                      <Icon className="w-8 h-8" style={{ color }} />
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                           style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }} />
                   </div>

                   {/* Title */}
                   <h3 className="line-clamp-2 mb-3" 
                       style={{ fontSize: 18, fontWeight: 800, color: "#1F1344", lineHeight: 1.4, minHeight: 50 }}>
                      {test.exam_title}
                   </h3>

                   {/* Labels */}
                   <div className="flex flex-wrap gap-2 mb-5">
                     <span className="px-3 py-1.5 rounded-lg text-xs font-bold" 
                           style={{ background: formatMeta.bg, color: color }}>
                       {formatMeta.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold" 
                            style={{ background: "#F3F4F6", color: "#4B5563" }}>
                         {test.exam_type}
                      </span>
                      {test.exam_skill && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize"
                              style={{ background: `${getSkillColor(test.exam_skill)}15`, color: getSkillColor(test.exam_skill) }}>
                          {test.exam_skill}
                        </span>
                      )}
                   </div>

                   {/* Stats Grid */}
                   <div className="space-y-3 mb-5 p-4 rounded-2xl" style={{ background: "#F9FAFB" }}>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6B7280" }}>
                           <ClipboardList className="w-4 h-4" /> Câu hỏi
                         </span>
                         <span className="font-bold" style={{ color: "#1F1344" }}>{test.total_questions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6B7280" }}>
                           <Clock className="w-4 h-4" /> Thời gian
                         </span>
                         <span className="font-bold" style={{ color: "#1F1344" }}>{test.exam_duration} phút</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6B7280" }}>
                           <BookOpen className="w-4 h-4" /> Lần làm
                         </span>
                         <span className="font-bold" style={{ color: "#1F1344" }}>{test.attempts_used}/{test.attempts_allowed}</span>
                      </div>
                   </div>

                   {/* Progress Bar */}
                   {test.attempts_allowed > 0 && (
                     <div className="mb-5">
                       <div className="flex items-center justify-between mb-2">
                         <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Tiến độ</span>
                         <span style={{ fontSize: 12, fontWeight: 800, color: PRIMARY }}>{Math.round(progress)}%</span>
                       </div>
                       <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                         <div className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${color}, ${color}CC)`
                              }} />
                       </div>
                     </div>
                   )}

                   {/* Action Button */}
                   {isCompleted ? (
                      <Link to={`/ket-qua/${test.submission_id}`}
                            className="w-full flex justify-between items-center px-5 py-4 rounded-xl font-bold transition-all hover:scale-[1.02]"
                            style={{ background: "#F0FDF4", color: "#16A34A", border: "2px solid #86EFAC" }}>
                         <span className="flex items-center gap-2">
                           <CheckCircle className="w-5 h-5" />
                           Đã hoàn thành
                         </span>
                         <ArrowRight className="w-5 h-5" />
                      </Link>
                   ) : (
                      <Link to={`/phong-cho/${test.assignment_id}`}
                            className={`w-full flex justify-between items-center px-5 py-4 rounded-xl font-bold transition-all ${canStart ? 'hover:scale-[1.02]' : 'opacity-50 cursor-not-allowed'}`}
                            style={{ background: color, color: "#fff", boxShadow: `0 4px 16px ${color}40` }}
                            onClick={(e) => !canStart && e.preventDefault()}>
                         <span className="flex items-center gap-2">
                           <Play className="w-5 h-5 fill-current" />
                           {test.attempts_used > 0 ? "Tiếp tục làm" : "Làm bài ngay"}
                         </span>
                         <ArrowRight className="w-5 h-5" />
                      </Link>
                   )}
                </div>
              );
           })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
           {filteredTests.map((test) => {
              const formatMeta = getFormatMeta(test.exam_format);
              const Icon = formatMeta.icon;
              const color = formatMeta.color;
              const isUrgent = test.is_urgent;
              const canStart = test.attempts_used < test.attempts_allowed;
              const isCompleted = test.status === 'completed';
              const progress = test.attempts_allowed > 0 ? (test.attempts_used / test.attempts_allowed) * 100 : 0;

              return (
                <div key={test.assignment_id}
                     className="relative bg-white rounded-2xl p-5 transition-all duration-300 group"
                     style={{
                        border: "2px solid #E0F2FE",
                        boxShadow: "0 2px 12px rgba(14,165,233,0.04)"
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 24px ${color}15`;
                        e.currentTarget.style.borderColor = `${color}40`;
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,165,233,0.04)";
                        e.currentTarget.style.borderColor = "#E0F2FE";
                     }}>
                  
                  <div className="flex items-center gap-5">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background: `${color}15` }}>
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate mb-1" style={{ fontSize: 17, color: "#1F1344" }}>
                            {test.exam_title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" 
                                  style={{ background: formatMeta.bg, color: color }}>
                              {formatMeta.label}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" 
                                  style={{ background: "#F3F4F6", color: "#4B5563" }}>
                              {test.exam_type}
                            </span>
                            {isUrgent && !isCompleted && (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                                    style={{ background: "#FEF2F2", color: "#DC2626" }}>
                                <AlertCircle className="w-3 h-3" />
                                URGENT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-6 text-sm mt-3">
                        <span className="flex items-center gap-1.5 font-medium" style={{ color: "#6B7280" }}>
                          <ClipboardList className="w-4 h-4" />
                          {test.total_questions} câu
                        </span>
                        <span className="flex items-center gap-1.5 font-medium" style={{ color: "#6B7280" }}>
                          <Clock className="w-4 h-4" />
                          {test.exam_duration} phút
                        </span>
                        <span className="flex items-center gap-1.5 font-medium" style={{ color: "#6B7280" }}>
                          <BookOpen className="w-4 h-4" />
                          {test.attempts_used}/{test.attempts_allowed} lần
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {test.attempts_allowed > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                            <div className="h-full rounded-full transition-all"
                                 style={{ 
                                   width: `${progress}%`,
                                   background: `linear-gradient(90deg, ${color}, ${color}CC)`
                                 }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <Link to={`/ket-qua/${test.submission_id}`}
                              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all hover:scale-105"
                              style={{ background: "#F0FDF4", color: "#16A34A" }}>
                           <CheckCircle className="w-5 h-5" />
                           Xem kết quả
                        </Link>
                      ) : (
                        <Link to={`/phong-cho/${test.assignment_id}`}
                              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${canStart ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                              style={{ background: color, color: "#fff" }}
                              onClick={(e) => !canStart && e.preventDefault()}>
                           <Play className="w-5 h-5 fill-current" />
                           {test.attempts_used > 0 ? "Tiếp tục" : "Làm bài"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
           })}
        </div>
      )}
    </div>
  );
}
