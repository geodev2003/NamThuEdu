/**
 * IeltsPlayModeConfig — Cho phép teacher cấu hình 2 chế độ chơi:
 *   • Practice: học viên chọn từng phần, có thể giới hạn thời gian
 *   • Full test: học viên làm liên tục cả đề, ra điểm band
 *
 * UI: Card lớn với toggle, mô tả rõ ràng, preview thời gian / số câu.
 */
import { Target, Trophy, Check, Info, Clock } from "lucide-react";
import type { IeltsSkill } from "../structure";
import { IELTS_STRUCTURE } from "../structure";

export interface PlayModeConfig {
  practice_enabled: boolean;
  full_test_enabled: boolean;
  /** Các tuỳ chọn thời gian (phút) cho Practice mode. null = không giới hạn */
  time_limit_options: (number | null)[];
}

interface Props {
  skill: IeltsSkill;
  value: PlayModeConfig;
  onChange: (next: PlayModeConfig) => void;
}

const ALL_TIME_OPTIONS: (number | null)[] = [null, 5, 10, 15, 20, 30, 45, 60, 75, 90];

export function IeltsPlayModeConfig({ skill, value, onChange }: Props) {
  const structure = IELTS_STRUCTURE[skill];

  const toggleTimeOption = (opt: number | null) => {
    const exists = value.time_limit_options.some((x) => x === opt);
    const next = exists
      ? value.time_limit_options.filter((x) => x !== opt)
      : [...value.time_limit_options, opt].sort((a, b) => {
          if (a === null) return -1;
          if (b === null) return 1;
          return a - b;
        });
    onChange({ ...value, time_limit_options: next });
  };

  const isAtLeastOneEnabled = value.practice_enabled || value.full_test_enabled;

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Chế độ chơi cho học viên</h2>
        <p className="text-sm text-gray-500 mt-1">
          Cấu hình cách học viên có thể làm đề thi này. Khuyến nghị bật cả 2 để học
          viên linh hoạt luyện tập từng phần hoặc thi thử nguyên đề.
        </p>
      </div>

      {/* ── Validation warning ── */}
      {!isAtLeastOneEnabled && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
          <Info className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">
            Phải bật ít nhất một chế độ chơi. Nếu không, học viên sẽ không thể làm đề
            này.
          </p>
        </div>
      )}

      {/* ── Practice mode card ── */}
      <ModeCard
        title="Luyện tập"
        subtitle="Học viên chọn từng phần để làm riêng"
        icon={Target}
        accent="#10B981"
        accentBg="#ECFDF5"
        enabled={value.practice_enabled}
        onToggle={(v) => onChange({ ...value, practice_enabled: v })}
        details={
          <>
            <Bullet>
              Học viên có thể chọn 1 hoặc nhiều {structure.parts.length}{" "}
              {skill === "reading"
                ? "passages"
                : skill === "writing"
                  ? "tasks"
                  : skill === "speaking"
                    ? "parts"
                    : "sections"}{" "}
              để luyện tập độc lập.
            </Bullet>
            <Bullet>
              Có thể chọn giới hạn thời gian hoặc làm bài không giới hạn.
            </Bullet>
            <Bullet>Phù hợp khi học viên muốn tập trung vào kỹ năng yếu.</Bullet>

            {/* Time limit options */}
            {value.practice_enabled && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Tuỳ chọn thời gian (học viên có thể chọn)
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TIME_OPTIONS.map((opt) => {
                    const selected = value.time_limit_options.some((x) => x === opt);
                    const label = opt === null ? "Không giới hạn" : `${opt} phút`;
                    return (
                      <button
                        key={String(opt)}
                        type="button"
                        onClick={() => toggleTimeOption(opt)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          selected
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 inline mr-1" />}
                        {label}
                      </button>
                    );
                  })}
                </div>
                {value.time_limit_options.length === 0 && (
                  <p className="text-xs text-orange-500 mt-2">
                    Cảnh báo: Chưa chọn tuỳ chọn nào — học viên sẽ không thấy dropdown
                    chọn thời gian.
                  </p>
                )}
              </div>
            )}
          </>
        }
      />

      {/* ── Full test mode card ── */}
      <ModeCard
        title="Làm full test"
        subtitle="Học viên làm liên tục cả đề như thi thật"
        icon={Trophy}
        accent="#F59E0B"
        accentBg="#FFFBEB"
        enabled={value.full_test_enabled}
        onToggle={(v) => onChange({ ...value, full_test_enabled: v })}
        details={
          <>
            <Bullet>
              Học viên làm tất cả {structure.parts.length}{" "}
              {skill === "reading"
                ? "passages"
                : skill === "writing"
                  ? "tasks"
                  : skill === "speaking"
                    ? "parts"
                    : "sections"}{" "}
              liên tục.
            </Bullet>
            <Bullet>
              Thời gian cố định: <b>{structure.duration} phút</b>. Không được pause
              giữa chừng.
            </Bullet>
            <Bullet>
              Hệ thống sẽ quy đổi điểm sang IELTS Band Score (0–9, làm tròn 0.5).
            </Bullet>
            <Bullet>Phù hợp để học viên mô phỏng kỳ thi thật.</Bullet>
          </>
        }
      />
    </div>
  );
}

// ─── Mode Card (reusable) ──────────────────────────────────────────────────
function ModeCard({
  title,
  subtitle,
  icon: Icon,
  accent,
  accentBg,
  enabled,
  onToggle,
  details,
}: {
  title: string;
  subtitle: string;
  icon: any;
  accent: string;
  accentBg: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  details: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border bg-white transition-all ${
        enabled ? "border-gray-200 shadow-sm" : "border-gray-100 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0"
            style={{ background: accentBg, color: accent }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
            enabled ? "" : "bg-gray-200"
          }`}
          style={enabled ? { background: accent } : undefined}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Details (collapsed when disabled) */}
      {enabled && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <div className="space-y-2">{details}</div>
        </div>
      )}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-gray-600">
      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
