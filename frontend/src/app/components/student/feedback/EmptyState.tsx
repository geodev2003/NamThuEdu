import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
      <Icon className="w-16 h-16 mx-auto mb-4" style={{ color: "#D1D5DB" }} />
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{
            background: "#2563EB",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
