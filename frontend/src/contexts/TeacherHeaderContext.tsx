import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * TeacherHeaderContext — quản lý Header dùng chung cho TOÀN BỘ trang giáo viên.
 *
 * Trước đây mỗi trang tự render <Header>, dẫn tới nhiều trang thiếu header
 * (mất chuông thông báo). Giờ Header nằm 1 nơi ở TeacherLayout; mỗi trang chỉ
 * cần khai báo breadcrumb/action qua hook usePageHeader(). Các trang full-bleed
 * (editor đề thi, chấm bài) tự dựng header riêng → gọi useHideTeacherHeader().
 */

export interface TeacherHeaderAction {
  label: string;
  onClick: () => void;
}

export interface TeacherHeaderConfig {
  breadcrumb: string | string[];
  action?: TeacherHeaderAction;
}

interface TeacherHeaderContextValue {
  config: TeacherHeaderConfig | null;
  hidden: boolean;
  setConfig: (cfg: TeacherHeaderConfig | null) => void;
  setHidden: (v: boolean) => void;
}

const TeacherHeaderContext = createContext<TeacherHeaderContextValue | null>(null);

export function TeacherHeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TeacherHeaderConfig | null>(null);
  const [hidden, setHidden] = useState(false);

  const value = useMemo(
    () => ({ config, hidden, setConfig, setHidden }),
    [config, hidden],
  );

  return (
    <TeacherHeaderContext.Provider value={value}>
      {children}
    </TeacherHeaderContext.Provider>
  );
}

export function useTeacherHeaderContext(): TeacherHeaderContextValue {
  const ctx = useContext(TeacherHeaderContext);
  if (!ctx) {
    throw new Error("useTeacherHeaderContext must be used within TeacherHeaderProvider");
  }
  return ctx;
}

/**
 * Khai báo breadcrumb/action cho Header chung từ bên trong 1 trang.
 *
 * @example
 * usePageHeader({ breadcrumb: ["Dashboard", "Ngân hàng đề"], action: {...} });
 */
export function usePageHeader(cfg: TeacherHeaderConfig) {
  const { setConfig } = useTeacherHeaderContext();
  // Serialize để so sánh ổn định, tránh set lại mỗi render
  const key = JSON.stringify({
    breadcrumb: cfg.breadcrumb,
    label: cfg.action?.label ?? null,
  });

  useEffect(() => {
    setConfig(cfg);
    return () => setConfig(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/**
 * Ẩn Header chung cho các trang full-bleed (editor đề thi, chấm bài...) vì các
 * trang này tự dựng thanh header riêng full chiều ngang.
 */
export function useHideTeacherHeader() {
  const { setHidden } = useTeacherHeaderContext();
  useEffect(() => {
    setHidden(true);
    return () => setHidden(false);
  }, [setHidden]);
}
