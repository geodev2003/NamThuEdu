import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import type { PublicCourse } from "../../../../services/publicApi";

type CourseFilterTabsProps = {
  courses: PublicCourse[];
};

const matchesFilter = (course: PublicCourse, filter: string) => {
  if (filter === "all") return true;

  const haystack = `${course.cName ?? ""} ${course.cType ?? ""} ${course.category?.caName ?? ""} ${
    course.category?.caType ?? ""
  }`.toLowerCase();

  if (filter === "ielts") return haystack.includes("ielts");
  if (filter === "toeic") return haystack.includes("toeic");
  if (filter === "communication") return haystack.includes("giao tiếp") || haystack.includes("communication");
  if (filter === "kids") return haystack.includes("kids") || haystack.includes("trẻ em") || haystack.includes("thiếu nhi");

  return true;
};

export function CourseFilterTabs({ courses }: CourseFilterTabsProps) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = useMemo(
    () => [
      { id: "all", label: t("landing.guest.courses.filters.all") },
      { id: "ielts", label: t("landing.guest.courses.filters.ielts") },
      { id: "toeic", label: t("landing.guest.courses.filters.toeic") },
      { id: "communication", label: t("landing.guest.courses.filters.communication") },
      { id: "kids", label: t("landing.guest.courses.filters.kids") },
    ],
    [t]
  );

  const filteredCourses = useMemo(
    () => courses.filter((course) => matchesFilter(course, activeFilter)),
    [courses, activeFilter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeFilter === filter.id
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          {t("landing.guest.courses.emptyFiltered")}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <Card key={course.cId} className="border-sky-100 bg-white shadow-sm">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex rounded-md bg-sky-100 px-2 py-1 text-xs font-semibold uppercase text-sky-700">
                    {course.category?.caName || t("landing.guest.courses.general")}
                  </span>
                  <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {course.cStatus || "active"}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-lg">{course.cName}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  {course.cDescription || t("landing.guest.courses.noDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold">{t("landing.guest.courses.time")}:</span>{" "}
                  {course.cTime || t("landing.guest.courses.updating")}
                </p>
                <p>
                  <span className="font-semibold">{t("landing.guest.courses.schedule")}:</span>{" "}
                  {course.cSchedule || t("landing.guest.courses.updating")}
                </p>
                <p>
                  <span className="font-semibold">{t("landing.guest.courses.seats")}:</span>{" "}
                  {course.cNumberOfStudent ?? t("landing.guest.courses.updating")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
