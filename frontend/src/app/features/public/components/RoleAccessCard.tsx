import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, ShieldCheck, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

const roleCards = [
  { key: "student", path: "/dang-ky", icon: User },
  { key: "teacher", path: "/giao-vien/dang-nhap", icon: Users },
  { key: "admin", path: "/admin/login", icon: ShieldCheck },
];

export function RoleAccessCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="border-sky-100 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
          {t("landing.guest.roles.title")}
        </CardTitle>
        <CardDescription className="text-sm">{t("landing.guest.roles.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {roleCards.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => navigate(role.path)}
              className="group w-full rounded-lg border border-sky-100 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/40"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-lg bg-sky-100 p-2 transition-colors group-hover:bg-sky-200">
                  <Icon className="size-5 text-sky-600" />
                </div>
                <span className="text-base font-bold">{t(`landing.guest.roles.items.${role.key}.title`)}</span>
              </div>
              <p className="mb-2 text-sm leading-relaxed text-slate-600">{t(`landing.guest.roles.items.${role.key}.desc`)}</p>
              <span className="flex items-center gap-1 text-sm font-bold text-orange-600 group-hover:text-orange-700">
                {t(`landing.guest.roles.items.${role.key}.cta`)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
