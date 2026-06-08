import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  FileText,
  User,
  type LucideIcon,
} from 'lucide-react';
import {
  AGE_GROUP_CATALOG,
  type AgeGroupCatalog,
  type ExamTypeOption,
  type ExamSkillKey,
  buildCreatorUrl,
} from './examCatalog';

/**
 * Wizard "Tạo đề thi" V2.
 *
 * Flow động: số bước phụ thuộc vào nhóm tuổi đã chọn.
 *  - Kids / Teens (chỉ 1 examType)  → 2 bước: chọn nhóm → preview & xác nhận.
 *  - Adults (nhiều examType)        → 3 bước: nhóm → loại đề → preview.
 *
 * Khi loại đề có nhiều kỹ năng (VSTEP, IELTS), radio chọn kỹ năng nằm INLINE
 * trong card chọn loại đề — không tách thành step riêng nữa.
 */
type StepKey = 'ageGroup' | 'examType' | 'confirm';

const ICON_MAP = Icons as unknown as Record<string, LucideIcon>;

const resolveIcon = (name: string, fallback: LucideIcon = FileText): LucideIcon => {
  const found = ICON_MAP[name];
  return typeof found === 'object' || typeof found === 'function' ? (found as LucideIcon) ?? fallback : fallback;
};

export function CreateExamSetup() {
  const navigate = useNavigate();

  const [ageGroup, setAgeGroup] = useState<AgeGroupCatalog | null>(null);
  const [examType, setExamType] = useState<ExamTypeOption | null>(null);
  const [skill, setSkill] = useState<ExamSkillKey | null>(null);
  const [stepIdx, setStepIdx] = useState(0);

  // Tính danh sách bước theo lựa chọn hiện tại — dynamic stepper.
  const steps: { key: StepKey; label: string }[] = useMemo(() => {
    const arr: { key: StepKey; label: string }[] = [
      { key: 'ageGroup', label: 'Nhóm học viên' },
    ];
    if (ageGroup && ageGroup.examTypes.length > 1) {
      arr.push({ key: 'examType', label: 'Loại đề thi' });
    }
    arr.push({ key: 'confirm', label: 'Xác nhận' });
    return arr;
  }, [ageGroup]);

  const currentStep = steps[stepIdx]?.key ?? 'ageGroup';

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePickAgeGroup = (g: AgeGroupCatalog) => {
    setAgeGroup(g);
    // Khi chỉ có 1 examType, auto-select & nhảy thẳng sang Confirm.
    if (g.examTypes.length === 1) {
      const only = g.examTypes[0];
      setExamType(only);
      setSkill(only.needsSkill ? (only.skills?.[0]?.value ?? 'mixed') : null);
      // 2 bước: ageGroup -> confirm  (index 0 -> 1)
      setStepIdx(1);
      return;
    }
    setExamType(null);
    setSkill(null);
    setStepIdx(1);
  };

  const handlePickExamType = (t: ExamTypeOption) => {
    setExamType(t);
    setSkill(t.needsSkill ? (t.skills?.[0]?.value ?? 'mixed') : null);
    // 3 bước: ageGroup(0) -> examType(1) -> confirm(2)
    setStepIdx(2);
  };

  const handleConfirm = () => {
    if (!ageGroup || !examType) return;
    navigate(
      buildCreatorUrl({
        ageGroup: ageGroup.key,
        examType,
        skill: skill ?? undefined,
      })
    );
  };

  const goBack = () => {
    if (stepIdx === 0) {
      navigate(-1);
      return;
    }
    // Khi chỉ có 2 bước (Kids/Teens), từ Confirm quay về step ageGroup → reset chọn.
    if (steps.length === 2 && stepIdx === 1) {
      setAgeGroup(null);
      setExamType(null);
      setSkill(null);
      setStepIdx(0);
      return;
    }
    if (currentStep === 'confirm' && steps.length === 3) {
      setStepIdx(1);
      return;
    }
    if (currentStep === 'examType') {
      setExamType(null);
      setSkill(null);
      setAgeGroup(null);
      setStepIdx(0);
      return;
    }
    setStepIdx(stepIdx - 1);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 sticky top-0 z-30 bg-white/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900">Tạo đề thi mới</h1>
            <p className="text-xs text-slate-500">
              {steps.length === 2
                ? 'Hai bước nhanh — chọn nhóm học viên rồi tạo'
                : 'Ba bước ngắn — chọn nhóm, chọn loại đề, xác nhận'}
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <Stepper steps={steps} current={stepIdx} ageGroup={ageGroup} examType={examType} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {currentStep === 'ageGroup' && (
          <StepAgeGroup onPick={handlePickAgeGroup} selected={ageGroup} />
        )}
        {currentStep === 'examType' && ageGroup && (
          <StepExamType
            ageGroup={ageGroup}
            selected={examType}
            skill={skill}
            onPickType={handlePickExamType}
            onSkillChange={setSkill}
          />
        )}
        {currentStep === 'confirm' && ageGroup && examType && (
          <StepConfirm
            ageGroup={ageGroup}
            examType={examType}
            skill={skill}
            onSkillChange={setSkill}
            onConfirm={handleConfirm}
            onBack={goBack}
          />
        )}
      </main>
    </div>
  );
}

// ── Stepper (dynamic) ─────────────────────────────────────────────────────────
function Stepper({
  steps,
  current,
  ageGroup,
  examType,
}: {
  steps: { key: StepKey; label: string }[];
  current: number;
  ageGroup: AgeGroupCatalog | null;
  examType: ExamTypeOption | null;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const isActive = current === i;
        const isDone = current > i;
        const detail =
          s.key === 'ageGroup'
            ? ageGroup?.label
            : s.key === 'examType'
              ? examType?.name
              : undefined;
        return (
          <div key={s.key} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div
                  className={`text-xs font-bold ${
                    isActive ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  Bước {i + 1}
                </div>
                <div
                  className={`text-xs ${isActive ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}
                >
                  {detail || s.label}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded-full ${
                  current > i ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Age group ─────────────────────────────────────────────────────────
function StepAgeGroup({
  onPick,
  selected,
}: {
  onPick: (g: AgeGroupCatalog) => void;
  selected: AgeGroupCatalog | null;
}) {
  return (
    <section>
      <header className="text-center mb-10">
        <Sparkles className="w-7 h-7 text-blue-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900">Đề thi này dành cho ai?</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Chọn nhóm học viên trước để gợi ý loại đề và dạng câu hỏi phù hợp
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGE_GROUP_CATALOG.map((g) => {
          const Icon = resolveIcon(g.iconName, User);
          const isSelected = selected?.key === g.key;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => onPick(g)}
              style={
                isSelected
                  ? { borderColor: g.iconColor, boxShadow: `0 4px 16px -8px ${g.iconColor}66` }
                  : undefined
              }
              className={`group text-left rounded-2xl border-2 bg-white p-6 transition-all cursor-pointer ${
                isSelected ? '' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${g.iconColor}1A`, color: g.iconColor }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{g.label}</h3>
              <p className="text-sm font-semibold text-slate-500">{g.range}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{g.description}</p>
              <p className="text-xs font-semibold text-slate-400 mt-4">
                {g.examTypes.length === 1
                  ? '1 loại đề chuyên dụng'
                  : `${g.examTypes.length} loại đề`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Step 2: Exam type (single column, inline skill picker) ───────────────────
function StepExamType({
  ageGroup,
  selected,
  skill,
  onPickType,
  onSkillChange,
}: {
  ageGroup: AgeGroupCatalog;
  selected: ExamTypeOption | null;
  skill: ExamSkillKey | null;
  onPickType: (t: ExamTypeOption) => void;
  onSkillChange: (s: ExamSkillKey) => void;
}) {
  return (
    <section className="max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-sm text-slate-500 mb-1">
          Đề cho học viên <span className="font-semibold text-slate-700">{ageGroup.label}</span>{' '}
          ({ageGroup.range})
        </p>
        <h2 className="text-2xl font-bold text-slate-900">Loại đề bạn muốn tạo là gì?</h2>
        <p className="text-sm text-slate-600 mt-1">
          Mỗi loại có giao diện soạn riêng tối ưu cho cấu trúc đề đó
        </p>
      </header>

      <div className="space-y-4">
        {ageGroup.examTypes.map((t) => {
          const Icon = resolveIcon(t.iconName);
          const isSelected = selected?.value === t.value;
          return (
            <div
              key={t.value}
              style={
                isSelected
                  ? { borderColor: t.themeColor, boxShadow: `0 6px 20px -10px ${t.themeColor}66` }
                  : undefined
              }
              className={`rounded-2xl border-2 bg-white transition-all overflow-hidden ${
                isSelected ? '' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => onPickType(t)}
                className="w-full text-left p-6 flex items-start gap-5 cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${t.themeColor}1A`, color: t.themeColor }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                    {t.badge && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${t.themeColor}1A`,
                          color: t.themeColor,
                        }}
                      >
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{t.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Icons.Clock className="w-3.5 h-3.5" />
                      {t.duration}
                    </span>
                    {t.needsSkill && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icons.Layers className="w-3.5 h-3.5" />
                        {t.skills?.length ?? 0} kỹ năng
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-slate-300 flex-shrink-0 mt-2 transition-transform"
                  style={isSelected ? { color: t.themeColor, transform: 'translateX(2px)' } : undefined}
                />
              </button>

              {/* Inline skill picker — chỉ hiện khi card được chọn & cần skill */}
              {isSelected && t.needsSkill && t.skills && t.skills.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <p className="text-xs font-bold text-slate-600 mb-2">Chọn kỹ năng:</p>
                  <div className="flex flex-wrap gap-2">
                    {t.skills.map((s) => {
                      const active = skill === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => onSkillChange(s.value)}
                          style={
                            active
                              ? {
                                  backgroundColor: t.themeColor,
                                  borderColor: t.themeColor,
                                }
                              : undefined
                          }
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            active
                              ? 'text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Step 3: Confirm — preview card ────────────────────────────────────────────
function StepConfirm({
  ageGroup,
  examType,
  skill,
  onSkillChange,
  onConfirm,
  onBack,
}: {
  ageGroup: AgeGroupCatalog;
  examType: ExamTypeOption;
  skill: ExamSkillKey | null;
  onSkillChange: (s: ExamSkillKey) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const Icon = resolveIcon(examType.iconName);
  const skillLabel = examType.skills?.find((s) => s.value === skill)?.label;

  return (
    <section className="max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Xem lại trước khi tạo</h2>
        <p className="text-sm text-slate-600 mt-1">
          Kiểm tra thông tin bên dưới rồi bấm tạo để mở giao diện soạn đề
        </p>
      </header>

      {/* Preview card */}
      <article className="rounded-3xl border-2 bg-white overflow-hidden shadow-sm" style={{ borderColor: `${examType.themeColor}33` }}>
        {/* Banner */}
        <div
          className="px-6 py-5 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${examType.themeColor}15 0%, ${examType.themeColor}05 100%)`,
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: examType.themeColor, color: '#fff' }}
          >
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">{examType.name}</h3>
              {skillLabel && skill !== 'mixed' && (
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: examType.themeColor, color: '#fff' }}
                >
                  {skillLabel}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {examType.tagline ?? examType.description}
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100">
          <PreviewItem
            iconName="Users"
            label="Đối tượng"
            value={`${ageGroup.label} · ${ageGroup.range}`}
            color={examType.themeColor}
          />
          <PreviewItem
            iconName="Clock"
            label="Thời lượng"
            value={examType.duration}
            color={examType.themeColor}
          />
          {examType.highlights?.map((h) => (
            <PreviewItem
              key={h.label}
              iconName={h.iconName}
              label={h.label}
              value={h.value}
              color={examType.themeColor}
            />
          ))}
        </div>

        {/* Inline skill switcher (nếu vẫn muốn đổi ở step Confirm) */}
        {examType.needsSkill && examType.skills && examType.skills.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/60">
            <p className="text-xs font-bold text-slate-600 mb-2">Kỹ năng:</p>
            <div className="flex flex-wrap gap-2">
              {examType.skills.map((s) => {
                const active = skill === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onSkillChange(s.value)}
                    style={
                      active
                        ? {
                            backgroundColor: examType.themeColor,
                            borderColor: examType.themeColor,
                          }
                        : undefined
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      active
                        ? 'text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* CTA */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{ backgroundColor: examType.themeColor }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Bắt đầu tạo đề
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

function PreviewItem({
  iconName,
  label,
  value,
  color,
}: {
  iconName: string;
  label: string;
  value: string;
  color: string;
}) {
  const Icon = resolveIcon(iconName);
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </div>
        <div className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">{value}</div>
      </div>
    </div>
  );
}
