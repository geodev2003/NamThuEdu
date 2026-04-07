import { useTranslation } from "react-i18next";
import { Construction } from "lucide-react";

export function UnderConstruction() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Construction className="w-16 h-16 mx-auto text-[#6B7280] mb-4" />
        <h2 className="text-2xl font-bold text-[#111827] mb-2">
          {t("common.underConstruction", { defaultValue: "Trang này đang được phát triển." })}
        </h2>
        <p className="text-[#6B7280]">
          This page is coming soon.
        </p>
      </div>
    </div>
  );
}
