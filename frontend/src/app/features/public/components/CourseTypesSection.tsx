import { useNavigate } from "react-router";
import { ArrowRight, Check, BookOpen, Globe, Users } from "lucide-react";

const courses = [
  {
    id: "vstep",
    badge: "Quốc gia",
    Icon: BookOpen,
    title: "VSTEP",
    subtitle: "Chứng chỉ tiếng Anh quốc gia",
    description:
      "Luyện thi VSTEP B1, B2, C1 theo chuẩn Bộ GD&ĐT — đầy đủ 4 kỹ năng Nghe, Nói, Đọc, Viết.",
    highlights: [
      "Đề thi sát chuẩn Bộ GD&ĐT",
      "Chấm điểm tự động + AI Writing",
      "Phù hợp sinh viên & người đi làm",
      "Trình độ B1 → C1",
    ],
    imgPosition: "0% 0%",
    mobileBg: "from-orange-50 to-amber-100",
  },
  {
    id: "ielts",
    badge: "Quốc tế",
    Icon: Globe,
    title: "IELTS",
    subtitle: "Chứng chỉ tiếng Anh quốc tế",
    description:
      "Luyện thi IELTS Academic & General Training từ band 4.0 đến 8.5+. Phản hồi chi tiết theo từng kỹ năng.",
    highlights: [
      "Academic & General Training",
      "Band score 4.0 → 8.5+",
      "Writing & Speaking có AI feedback",
      "Đề thi Cambridge chuẩn quốc tế",
    ],
    imgPosition: "0% 50%",
    mobileBg: "from-sky-50 to-blue-100",
  },
  {
    id: "kids",
    badge: "6 – 18 tuổi",
    Icon: Users,
    title: "Tiếng Anh thiếu niên",
    subtitle: "Dành cho học sinh 6 – 18 tuổi",
    description:
      "Lộ trình theo lứa tuổi: Cambridge Starters/Movers/Flyers (6–11), KET/PET (12–15), IELTS chuẩn bị (16–18).",
    highlights: [
      "6–11 tuổi: Cambridge Starters → Flyers",
      "12–15 tuổi: KET / PET",
      "16–18 tuổi: IELTS chuẩn bị",
      "Giao diện thân thiện, có gamification",
    ],
    imgPosition: "0% 100%",
    mobileBg: "from-emerald-50 to-teal-100",
  },
];

export function CourseTypesSection() {
  const navigate = useNavigate();

  return (
    <section id="khoa-hoc" className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-500">
            Chương trình học
          </p>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Khóa học phù hợp mọi đối tượng
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
            Từ học sinh tiểu học đến người đi làm — NamThuEdu có lộ trình riêng cho từng mục tiêu.
          </p>
        </div>

        {/* Banner rows */}
        <div className="flex flex-col gap-5">
          {courses.map((course) => {
            const Icon = course.Icon;
            return (
              <div
                key={course.id}
                className={`group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${course.mobileBg}`}
                style={{ minHeight: "200px" }}
              >
                {/* Background image */}
                <img
                  src="/images/3type.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 hidden md:block"
                  style={{ objectPosition: course.imgPosition }}
                />

                {/* Text overlay — left side */}
                <div className="relative z-10 flex h-full flex-col justify-center px-5 py-3 max-w-full md:max-w-[55%]">
                  {/* Icon + Title + Badge */}
                  <div className="mb-1 flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                      <span className="rounded-full border border-orange-200 bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-orange-600 backdrop-blur-sm">
                        {course.badge}
                      </span>
                    </div>
                  </div>

                  <p className="mb-1 text-xs font-semibold text-orange-500">{course.subtitle}</p>
                  <p className="mb-1.5 text-sm leading-snug text-slate-600">{course.description}</p>

                  {/* Highlights */}
                  <ul className="mb-2.5 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                    {course.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
                        <span className="text-xs text-slate-600">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => navigate("/dang-nhap")}
                    className="relative overflow-hidden group/btn flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-orange-400 bg-white/90 px-3 py-1.5 text-sm font-semibold text-orange-600 backdrop-blur-sm transition-all duration-200"
                  >
                    <span className="absolute inset-0 bg-orange-500 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 flex items-center gap-1.5 group-hover/btn:text-white transition-colors duration-300">
                      Bắt đầu luyện thi
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
