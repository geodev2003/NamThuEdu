import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Award, BookOpenCheck, Clock3 } from "lucide-react";

const icons = [Award, BookOpenCheck, Clock3] as const;

export function TeacherHighlights() {
  const { t } = useTranslation();

  return (
    <section id="teacher-highlights" className="bg-white px-4 py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("landing.guest.teachers.title")}</h2>
          <p className="mt-3 text-lg text-slate-600">{t("landing.guest.teachers.subtitle")}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item, index) => {
            const Icon = icons[index];
            return (
              <Card key={item} className="border-sky-100 bg-white shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-sky-100">
                    <Icon className="size-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-lg">{t(`landing.guest.teachers.items.${item}.name`)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">{t(`landing.guest.teachers.items.${item}.role`)}</p>
                  <p>{t(`landing.guest.teachers.items.${item}.cert`)}</p>
                  <p>{t(`landing.guest.teachers.items.${item}.exp`)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
