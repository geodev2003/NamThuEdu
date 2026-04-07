 import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../hooks/usePageTitle";
import { publicApi, type PublicCourse } from "../../../services/publicApi";
import { StickyContactBar, Header, ParticlesBackground, Footer } from "./components";
import { ArrowRight } from "lucide-react";

type CourseGroup = {
  title: string;
  items: PublicCourse[];
};

function toGroupTitle(input?: string | null) {
  if (!input) return "Khóa học nổi bật";
  const lower = input.toLowerCase();
  if (lower.includes("ielts")) return "Luyện thi IELTS";
  if (lower.includes("toeic")) return "Luyện thi TOEIC";
  if (lower.includes("giao")) return "Tiếng Anh giao tiếp";
  if (lower.includes("kids") || lower.includes("thiếu nhi")) return "Tiếng Anh thiếu nhi";
  return input;
}

export function LandingPage() {
  const navigate = useNavigate();
  usePageTitle(PAGE_TITLES.LANDING);
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        const result = await publicApi.getCourses();
        setCourses(result);
      } finally {
        setCoursesLoading(false);
      }
    };
    loadCourses();
  }, []);

  const courseGroups = useMemo<CourseGroup[]>(() => {
    const map = new Map<string, PublicCourse[]>();
    for (const c of courses) {
      const key = toGroupTitle(c.category?.caName || c.cType || c.cName);
      const list = map.get(key) ?? [];
      list.push(c);
      map.set(key, list);
    }
    return Array.from(map.entries())
      .slice(0, 4)
      .map(([title, items]) => ({ title, items: items.slice(0, 6) }));
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-slate-900" style={{ fontFamily: "Inter, 'Segoe UI', sans-serif" }}>
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-200 via-amber-100 to-orange-100 px-4 py-14 text-slate-800">
          {/* Particles Background - Extended height */}
          <div className="absolute inset-0 z-0" style={{ height: 'calc(100% + 200px)' }}>
            <ParticlesBackground />
          </div>
          
          {/* Existing blur effects (keep for depth) */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute right-20 top-16 h-56 w-56 rounded-full bg-orange-100/50 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 z-20">
            <div className="space-y-7">
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
                Giải pháp chuyển đổi
                <br />
                số giáo dục toàn diện
              </h1>
              <p className="max-w-2xl text-lg text-slate-700 lg:text-2xl">
                Khai thác tối đa công nghệ để học nhanh hơn, rõ tiến độ hơn và tối ưu kết quả học tập.
              </p>

            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              <div className="w-full max-w-xl rounded-3xl border border-orange-200 bg-white/25 p-6 shadow-lg backdrop-blur-md">
                <p className="mb-4 text-sm font-bold uppercase tracking-wide text-orange-700">Bạn là ai?</p>
                <p className="mb-5 text-xs text-slate-600">Chọn vai trò để bắt đầu</p>
                
                <div className="grid gap-3">
                  {/* Học viên Button - Direct to login */}
                  <button 
                    onClick={() => navigate("/dang-nhap")}
                    className="cursor-pointer rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-sm">
                        🎓
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-700">Học viên</p>
                        <p className="text-xs text-slate-600">Thiếu nhi, Thiếu niên, Người lớn</p>
                      </div>
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Giáo viên Button */}
                  <button 
                    onClick={() => navigate("/giao-vien/dang-nhap")}
                    className="cursor-pointer rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-sm">
                        👩‍🏫
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-purple-700">Giáo viên</p>
                        <p className="text-xs text-slate-600">Quản lý lớp học & học viên</p>
                      </div>
                      <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-0 py-8">
            <div className="mx-auto max-w-[96rem] px-4 lg:px-6">
              <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <img src="/images/landing-promo-banner.png" alt="Thông báo tuyển sinh" className="h-64 w-full object-cover md:h-[28rem] lg:h-[34rem]" />
              </div>
            </div>
          </section>

        <section className="bg-[#fbeee7] px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">Kho học liệu số toàn diện</h2>
              <p className="mt-2 text-slate-600">Khóa học được lấy từ backend và chia theo nhóm để học sinh chọn nhanh.</p>
            </div>

            {coursesLoading ? (
              <div className="rounded-2xl border border-orange-100 bg-white p-8 text-center text-slate-500">Đang tải khóa học...</div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {courseGroups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-xl font-bold text-orange-700">{group.title}</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((course) => (
                        <div key={course.cId} className="rounded-xl border border-slate-200 p-3">
                          <p className="line-clamp-2 min-h-[42px] text-sm font-semibold text-slate-800">{course.cName}</p>
                          <p className="mt-1 text-xs text-slate-500">{course.cSchedule || "Lịch linh hoạt"}</p>
                          <button onClick={() => navigate("/dang-ky")} className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700">
                            Xem thêm <ArrowRight className="inline size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#fff7f0] px-4 py-12">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Hỏi đáp cộng đồng</h3>
              <p className="mt-2 text-sm text-slate-600">Đặt câu hỏi và nhận hỗ trợ từ giáo viên.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Đấu trường tri thức</h3>
              <p className="mt-2 text-sm text-slate-600">Thi đua hàng tuần, tăng động lực học tập.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">Cuộc thi vui</h3>
              <p className="mt-2 text-sm text-slate-600">Nhiệm vụ nhanh, phần thưởng hấp dẫn.</p>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12">
          <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-8 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-3xl font-bold">Tham gia NamThuEdu ngay hôm nay!</h3>
                <p className="mt-2 text-orange-50">Bắt đầu học thông minh hơn với hệ sinh thái giáo dục số toàn diện.</p>
              </div>
              <button onClick={() => navigate("/dang-nhap")} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600">
                Trải nghiệm ngay
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <StickyContactBar onRegisterConsult={() => navigate("/dang-ky")} />
    </div>
  );
}
