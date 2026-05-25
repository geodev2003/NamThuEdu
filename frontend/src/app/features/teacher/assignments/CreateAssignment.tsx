import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Search, Calendar, Clock, Users, School,
  CheckCircle2, AlertCircle, Send, BookOpen, ChevronRight,
  ChevronLeft, Minus, Plus, Tag, Hash, Loader2,
} from "lucide-react";
import { api } from "../../../../services/api";

interface Exam {
  id: string;
  title: string;
  type: string;
  skill?: string;
  duration: number;
  totalQuestions: number;
  purpose?: string;
  ageGroup?: string;
}

interface ClassItem {
  id: string;
  name: string;
  studentCount: number;
  ageGroup?: string;
}

interface StudentItem {
  id: string;
  name: string;
  avatar: string;
  className?: string;
  ageGroup?: string;
}

const TYPE_COLORS: Record<string, string> = {
  Reading: "bg-blue-100 text-blue-700",
  Listening: "bg-purple-100 text-purple-700",
  Writing: "bg-emerald-100 text-emerald-700",
  Speaking: "bg-rose-100 text-rose-700",
  Grammar: "bg-amber-100 text-amber-700",
  Vocabulary: "bg-cyan-100 text-cyan-700",
};

const AGE_LABELS: Record<string, string> = {
  kids: "Thiếu nhi",
  teens: "Thiếu niên",
  adults: "Người lớn",
  all: "Tất cả",
};

const SKILL_LABELS: Record<string, string> = {
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
};

const SKILL_COLORS: Record<string, string> = {
  listening: "bg-purple-100 text-purple-700",
  reading: "bg-blue-100 text-blue-700",
  writing: "bg-emerald-100 text-emerald-700",
  speaking: "bg-rose-100 text-rose-700",
};

const AGE_COLORS: Record<string, string> = {
  kids: "bg-pink-100 text-pink-700",
  teens: "bg-indigo-100 text-indigo-700",
  adults: "bg-teal-100 text-teal-700",
  all: "bg-gray-100 text-gray-600",
};

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return (words.length >= 2 ? words[words.length - 1] : words[0]).substring(0, 2).toUpperCase();
}

export function CreateAssignment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedExamId = searchParams.get('exam_id');

  const [step, setStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [assignmentType, setAssignmentType] = useState<"class" | "student">("student");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [examSearch, setExamSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingExams(true);
    api.get("/teacher/exams")
      .then((res: any) => {
        const list = res?.data?.data ?? res?.data ?? [];
        const arr = Array.isArray(list) ? list : [];
        const mapped: Exam[] = arr.map((e: any) => ({
          id: String(e.eId ?? e.id),
          title: e.eTitle ?? e.title ?? "—",
          type: e.eType ?? e.type ?? "—",
          duration: e.eDuration_minutes ?? e.duration ?? 0,
          totalQuestions: e.questions_count ?? e.totalQuestions ?? 0,
          purpose: e.ePurpose ?? e.purpose,
          skill: e.eSkill ?? e.skill,
          ageGroup: e.age_group,
        }));
        setExams(mapped);
        // Auto-select exam if exam_id param present
        if (preselectedExamId) {
          const found = mapped.find(e => e.id === preselectedExamId);
          if (found) {
            setSelectedExam(found);
            setStep(2);
          }
        }
      })
      .catch(() => setExams([]))
      .finally(() => setLoadingExams(false));
  }, [preselectedExamId]);

  useEffect(() => {
    setLoadingTargets(true);
    setSelectedTargets([]);
    if (assignmentType === "class") {
      api.get("/teacher/classes")
        .then((res: any) => {
          const list = res?.data?.data ?? res?.data ?? [];
          const arr = Array.isArray(list) ? list : [];
          setClasses(arr.map((c: any) => ({
            id: String(c.cId ?? c.id),
            name: c.cName ?? c.name ?? "—",
            studentCount: c.current_student_count ?? c.student_count ?? c.studentCount ?? 0,
            ageGroup: c.age_group,
          })));
        })
        .catch(() => setClasses([]))
        .finally(() => setLoadingTargets(false));
    } else {
      api.get("/teacher/students?paginate=false")
        .then((res: any) => {
          const raw = res?.data?.data;
          const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
          setStudents(arr.map((s: any) => ({
            id: String(s.uId ?? s.id),
            name: s.uName ?? s.name ?? "—",
            avatar: initials(s.uName ?? s.name ?? "?"),
            className: s.class_name ?? s.className,
            ageGroup: s.age_group,
          })));
        })
        .catch(() => setStudents([]))
        .finally(() => setLoadingTargets(false));
    }
  }, [assignmentType]);

  const practiceExams = exams.filter(
    (e) => e.purpose === "practice" || (e.skill && e.skill !== "mixed")
  );
  const examTypes = ["all", ...Array.from(new Set(practiceExams.map((e) => e.type).filter(Boolean)))];

  const filteredExams = practiceExams.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(examSearch.toLowerCase());
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const filteredTargets = assignmentType === "class"
    ? classes.filter((c) => c.name.toLowerCase().includes(targetSearch.toLowerCase()))
    : students.filter((s) => s.name.toLowerCase().includes(targetSearch.toLowerCase()));

  const toggleTarget = (id: string) =>
    setSelectedTargets((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSubmit = async () => {
    if (!selectedExam || selectedTargets.length === 0 || !deadline) return;
    setSubmitting(true);
    setError(null);
    try {
      await Promise.all(
        selectedTargets.map((targetId) =>
          api.post(`/teacher/exams/${selectedExam.id}/assign`, {
            taTarget_type: assignmentType,
            taTarget_id: Number(targetId),
            taDeadline: deadline,
            taMax_attempt: maxAttempts,
          })
        )
      );
      navigate("/giao-vien/bai-tap");
    } catch {
      setError("Giao bài thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = [
    !!selectedExam,
    selectedTargets.length > 0,
    !!deadline,
  ];
  const isComplete = canProceed.every(Boolean);

  const STEPS = [
    { id: 1, label: "Chọn bài tập", icon: BookOpen },
    { id: 2, label: "Chọn đối tượng", icon: Users },
    { id: 3, label: "Cài đặt & Giao", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/giao-vien/bai-tap")}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Giao bài thi mới</h1>
            <p className="text-xs text-gray-500">Tạo assignment cho học sinh hoặc lớp học</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || submitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isComplete && !submitting
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Giao bài
        </button>
      </div>

      {/* ── Step indicator ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-0">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => {
                  if (s.id < step || canProceed[s.id - 2] !== false) setStep(s.id);
                }}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-all ${
                  step === s.id ? "text-indigo-700" : step > s.id ? "text-indigo-400" : "text-gray-400"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  step > s.id ? "bg-indigo-600 text-white" : step === s.id ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${step === s.id ? "text-indigo-700" : step > s.id ? "text-indigo-400" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${step > s.id ? "bg-indigo-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── Main step content (2/3) ── */}
        <div className="lg:col-span-2 space-y-0">

          {/* ══ STEP 1: Exam ══ */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Chọn bài tập</h3>
                  <p className="text-xs text-gray-500">Chọn bài tập theo kỹ năng muốn giao</p>
                </div>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm đề thi..."
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-50"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {examTypes.map((tp) => (
                    <button key={tp} onClick={() => setTypeFilter(tp)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${typeFilter === tp ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"}`}>
                      {tp === "all" ? "Tất cả" : tp}
                    </button>
                  ))}
                </div>
                {loadingExams ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-indigo-400" /></div>
                ) : filteredExams.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-10">Không tìm thấy đề thi</p>
                ) : (
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredExams.map((exam) => {
                      const sel = selectedExam?.id === exam.id;
                      const tc = TYPE_COLORS[exam.type] ?? "bg-gray-100 text-gray-600";
                      const ac = exam.ageGroup ? (AGE_COLORS[exam.ageGroup] ?? AGE_COLORS.all) : null;
                      return (
                        <div key={exam.id} onClick={() => setSelectedExam(exam)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${sel ? "border-indigo-500 bg-indigo-50/60" : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30"}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sel ? "bg-indigo-600" : "bg-gray-100"}`}>
                            <BookOpen className={`w-4 h-4 ${sel ? "text-white" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{exam.title}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tc}`}>{exam.type}</span>
                              {exam.skill && SKILL_LABELS[exam.skill] && (
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${SKILL_COLORS[exam.skill] ?? "bg-gray-100 text-gray-600"}`}>{SKILL_LABELS[exam.skill]}</span>
                              )}
                              {ac && exam.ageGroup && (
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ac}`}>{AGE_LABELS[exam.ageGroup] ?? exam.ageGroup}</span>
                              )}
                              <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Clock className="w-3 h-3" />{exam.duration} phút</span>
                              <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Hash className="w-3 h-3" />{exam.totalQuestions} câu</span>
                            </div>
                          </div>
                          {sel && <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button onClick={() => selectedExam && setStep(2)} disabled={!selectedExam}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedExam ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  Tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 2 ══ */}
          {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div><h3 className="text-base font-bold text-gray-900">Chọn đối tượng</h3><p className="text-xs text-gray-500">Chọn học viên cụ thể hoặc giao theo lớp</p></div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5">
                    {([ ["student", "Cá nhân"], ["class", "Theo lớp (giao tất cả)"] ] as Array<["class"|"student", string]>).map(([val, label]) => (
                      <button key={val} onClick={() => setAssignmentType(val)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${assignmentType === val ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      {val === "student" ? <Users className="w-4 h-4" /> : <School className="w-4 h-4" />}{label}
                    </button>
                  ))}
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder={assignmentType === "class" ? "Tìm lớp học..." : "Tìm học viên..."}
                    value={targetSearch} onChange={(e) => setTargetSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-50" />
                </div>
                {loadingTargets ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-indigo-400" /></div>
                ) : filteredTargets.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-10">Không tìm thấy</p>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {assignmentType === "class"
                      ? (filteredTargets as ClassItem[]).map((cls) => {
                          const sel = selectedTargets.includes(cls.id);
                          const ac = cls.ageGroup ? (AGE_COLORS[cls.ageGroup] ?? AGE_COLORS.all) : null;
                          return (
                            <div key={cls.id} onClick={() => toggleTarget(cls.id)}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${sel ? "border-indigo-500 bg-indigo-50/60" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sel ? "bg-indigo-600" : "bg-gray-100"}`}>
                                <School className={`w-4 h-4 ${sel ? "text-white" : "text-gray-500"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{cls.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500">{cls.studentCount} học viên</span>
                                  {ac && cls.ageGroup && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${ac}`}>{AGE_LABELS[cls.ageGroup] ?? cls.ageGroup}</span>}
                                </div>
                              </div>
                              {sel && <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                            </div>
                          );
                        })
                      : (filteredTargets as StudentItem[]).map((stu) => {
                          const sel = selectedTargets.includes(stu.id);
                          const ac = stu.ageGroup ? (AGE_COLORS[stu.ageGroup] ?? AGE_COLORS.all) : null;
                          return (
                            <div key={stu.id} onClick={() => toggleTarget(stu.id)}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${sel ? "border-indigo-500 bg-indigo-50/60" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
                              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{stu.avatar}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{stu.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {stu.className && <span className="text-xs text-gray-500 truncate">{stu.className}</span>}
                                  {ac && stu.ageGroup && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${ac}`}>{AGE_LABELS[stu.ageGroup] ?? stu.ageGroup}</span>}
                                </div>
                              </div>
                              {sel && <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button onClick={() => selectedTargets.length > 0 && setStep(3)} disabled={selectedTargets.length === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedTargets.length > 0 ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  Tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3 ══ */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">3</div>
                <div><h3 className="text-base font-bold text-gray-900">Cài đặt & Giao</h3><p className="text-xs text-gray-500">Thiết lập hạn nộp và số lượt làm bài</p></div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-500" /> Hạn nộp bài
                  </label>
                  <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-50" />
                  {deadline && (
                    <p className="text-xs text-gray-500 mt-1.5">Hạn nộp: {new Date(deadline).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-3">
                    <Clock className="w-4 h-4 text-indigo-500" /> Số lần làm bài tối đa
                  </label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setMaxAttempts((n) => Math.max(1, n - 1))} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold text-indigo-600">{maxAttempts}</span>
                      <p className="text-xs text-gray-400 mt-0.5">lần</p>
                    </div>
                    <button onClick={() => setMaxAttempts((n) => Math.min(10, n + 1))} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 5].map((n) => (
                      <button key={n} onClick={() => setMaxAttempts(n)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${maxAttempts === n ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
                        {n} lần
                      </button>
                    ))}
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button onClick={handleSubmit} disabled={!deadline || submitting}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${deadline && !submitting ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Giao bài
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Summary sidebar ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-[73px]">
            <p className="text-sm font-bold text-gray-900 mb-4">Tóm tắt</p>
            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-3 rounded-xl ${selectedExam ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 border border-gray-200"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedExam ? "bg-indigo-600" : "bg-gray-200"}`}>
                  {selectedExam ? <CheckCircle2 className="w-4 h-4 text-white" /> : <BookOpen className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Đề thi</p>
                  {selectedExam ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900 truncate">{selectedExam.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TYPE_COLORS[selectedExam.type] ?? "bg-gray-100 text-gray-600"}`}>{selectedExam.type}</span>
                        <span className="text-[10px] text-gray-400">{selectedExam.duration}p · {selectedExam.totalQuestions}câu</span>
                      </div>
                    </>
                  ) : <p className="text-xs text-gray-400">Chưa chọn đề</p>}
                </div>
              </div>
              <div className={`flex items-start gap-3 p-3 rounded-xl ${selectedTargets.length > 0 ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedTargets.length > 0 ? "bg-emerald-500" : "bg-gray-200"}`}>
                  {selectedTargets.length > 0 ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Users className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Đối tượng</p>
                  {selectedTargets.length > 0
                    ? <p className="text-sm font-semibold text-gray-900">{selectedTargets.length} {assignmentType === "class" ? "lớp" : "học viên"}</p>
                    : <p className="text-xs text-gray-400">Chưa chọn đối tượng</p>}
                </div>
              </div>
              <div className={`flex items-start gap-3 p-3 rounded-xl ${deadline ? "bg-violet-50 border border-violet-200" : "bg-gray-50 border border-gray-200"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${deadline ? "bg-violet-500" : "bg-gray-200"}`}>
                  {deadline ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Calendar className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Hạn nộp</p>
                  {deadline
                    ? <p className="text-sm font-semibold text-gray-900">{new Date(deadline).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                    : <p className="text-xs text-gray-400">Chưa đặt hạn nộp</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Số lượt làm</p>
                  <p className="text-sm font-bold text-gray-900">{maxAttempts} lần</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Hoàn thành</span><span>{canProceed.filter(Boolean).length}/3</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${(canProceed.filter(Boolean).length / 3) * 100}%` }} />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={!isComplete || submitting}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${isComplete && !submitting ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Giao bài ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
