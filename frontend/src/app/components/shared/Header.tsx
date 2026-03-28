import { Bell, Plus, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  breadcrumb: string | string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ breadcrumb, action }: HeaderProps) {
  const { t } = useTranslation();
  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];

  return (
    <div className="h-20 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            )}
            <span
              className={
                index === crumbs.length - 1
                  ? "text-[#1F2937] font-semibold"
                  : "text-[#6B7280]"
              }
              style={{ fontSize: "14px" }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-10 px-5 rounded-lg shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98]"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </Button>
        )}

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
            aria-label={t("header.notifications")}
          >
            <Bell className="w-5 h-5 text-[#6B7280]" />
            <Badge className="absolute -top-1 -right-1 bg-[#EF4444] text-white w-[18px] h-[18px] flex items-center justify-center rounded-full p-0 border-2 border-white"
              style={{ fontSize: "11px", fontWeight: 700 }}>
              3
            </Badge>
          </button>
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 hover:bg-[#F3F4F6] rounded-[20px] px-3 py-1.5 transition-colors">
          <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-semibold">
            NT
          </div>
          <span className="text-[#374151] hidden md:block" style={{ fontSize: "14px", fontWeight: 500 }}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
