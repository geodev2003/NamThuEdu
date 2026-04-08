import { Calendar, Clock3, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../../../../services/studentApi";

type ScheduleItem = {
  id: string;
  title: string;
  type: "lesson" | "test" | "practice";
  date: string;
  start: string;
  end: string;
  done?: boolean;
};

function normalize(items: any[]): ScheduleItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [
      { id: "s1", title: "Luyện Listening theo chủ đề", type: "practice", date: "Hôm nay", start: "19:00", end: "19:30" },
      { id: "s2", title: "Bài thi Reading mini mock", type: "test", date: "Ngày mai", start: "20:00", end: "21:00" },
      { id: "s3", title: "Ôn tập Writing task 2", type: "lesson", date: "Thứ 6", start: "19:30", end: "20:15", done: true },
    ];
  }
  return items.slice(0, 8).map((it, idx) => ({
    id: String(it.id ?? idx + 1),
    title: String(it.title ?? it.name ?? "Buổi học"),
    type: (it.type ?? "lesson") as "lesson" | "test" | "practice",
    date: String(it.date ?? "Sắp tới"),
    start: String(it.start ?? "19:00"),
    end: String(it.end ?? "19:45"),
    done: Boolean(it.done),
  }));
}

export function StudentSchedule() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "tests", "schedule"],
    queryFn: () => studentApi.getTests({ status: "pending" }),
  });

  const pending = (data as any)?.data?.data?.pending ?? [];
  const schedule = normalize(
    pending.map((t: any, idx: number) => ({
      id: t.assignment_id,
      title: t.exam_title,
      type: "test",
      date: idx === 0 ? "Hôm nay" : idx === 1 ? "Ngày mai" : "Tuần này",
      start: "19:00",
      end: "20:00",
      done: false,
    })),
  );

  if (isLoading) {
    return (
      <div className="py-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 space-y-5">
      <div className="rounded-3xl bg-white p-6" style={{ border: "1.5px solid #E5E7EB" }}>
        <div className="flex items-center gap-3">
          <Calendar className="w-7 h-7 text-sky-600" />
          <h1 className="text-2xl font-extrabold text-slate-800">Lịch học của tôi</h1>
        </div>
        <p className="text-sm text-slate-500 mt-2">Theo dõi buổi học, lịch luyện tập và bài thi sắp tới.</p>
      </div>

      <div className="space-y-3">
        {schedule.map((item) => {
          const icon =
            item.type === "test" ? <AlertCircle className="w-5 h-5 text-rose-500" /> :
            item.type === "practice" ? <Clock3 className="w-5 h-5 text-amber-500" /> :
            <BookOpen className="w-5 h-5 text-indigo-500" />;

          return (
            <div key={item.id} className="rounded-2xl bg-white p-4" style={{ border: "1.5px solid #F1F5F9" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date} • {item.start} - {item.end}</p>
                </div>
                {item.done ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                  </span>
                ) : (
                  <span className="text-xs font-bold text-sky-600">Sắp tới</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

