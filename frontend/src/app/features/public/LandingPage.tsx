 import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePageTitle, PAGE_TITLES } from "../../../hooks/usePageTitle";
import { publicApi, type PublicCourse, type PublicTest } from "../../../services/publicApi";
import { StickyContactBar, Header, ParticlesBackground, Footer } from "./components";
import { ArrowRight, Clock, Award } from "lucide-react";

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
  const [tests, setTests] = useState<PublicTest[]>([]);
  const [testsLoading, setTestsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setCoursesLoading(true);
        setTestsLoading(true);
        const [coursesResult, testsResult] = await Promise.all([
          publicApi.getCourses(),
          publicApi.getTests()
        ]);
        setCourses(coursesResult);
        setTests(testsResult.slice(0, 6));
      } finally {
        setCoursesLoading(false);
        setTestsLoading(false);
      }
    };
    loadData();
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

        {/* Tests Section - Neutral background */}
        <section className="bg-gray-50 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Đề thi & Đề kiểm tra nổi bật</h2>
              <p className="mt-3 text-lg text-slate-600">Thử sức với các bộ đề VSTEP, IELTS được cập nhật liên tục.</p>
            </div>

            {testsLoading ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-slate-500">Đang tải danh sách đề thi...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tests.map((test) => (
                  <div 
                    key={test.id} 
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">
                          {test.type || "VSTEP"}
                        </span>
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
                          {test.skill || "Mixed"}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-slate-800 line-clamp-2">{test.title}</h3>
                      <p className="mb-6 text-sm text-slate-600 line-clamp-2">{test.description || "Bài thi đánh giá năng lực tiêu chuẩn."}</p>
                    </div>

                    <div className="mt-auto">
                      <div className="mb-6 flex items-center gap-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4 text-orange-500" />
                          <span>{test.duration} phút</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="size-4 text-amber-500" />
                          <span>{test.total_score} điểm</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate("/dang-nhap")} 
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50 group-hover:bg-orange-500 group-hover:text-white"
                      >
                        Đăng nhập để làm bài
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section - White background */}
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Tính năng nổi bật</h2>
              <p className="mt-3 text-lg text-slate-600">Trải nghiệm học tập toàn diện với công nghệ hiện đại</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  💬
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Hỏi đáp cộng đồng</h3>
                <p className="text-sm text-slate-600">Đặt câu hỏi và nhận hỗ trợ từ giáo viên, cộng đồng học viên.</p>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  🏆
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Đấu trường tri thức</h3>
                <p className="text-sm text-slate-600">Thi đua hàng tuần, tăng động lực học tập với bảng xếp hạng.</p>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cuộc thi vui</h3>
                <p className="text-sm text-slate-600">Nhiệm vụ nhanh, phần thưởng hấp dẫn, học mà vui.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Orange gradient (DUY NHẤT) */}
        <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-white mb-3">Tham gia NamThuEdu ngay hôm nay!</h2>
                <p className="text-xl text-orange-50">Bắt đầu học thông minh hơn với hệ sinh thái giáo dục số toàn diện.</p>
              </div>
              <button 
                onClick={() => navigate("/dang-nhap")} 
                className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-orange-600 shadow-lg hover:bg-orange-50 hover:shadow-xl transition-all hover:-translate-y-1"
              >
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
