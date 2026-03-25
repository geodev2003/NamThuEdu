import { useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Bell,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Trophy,
  Clock,
  MoreVertical,
  Check,
  Trash2,
} from "lucide-react";
import { studentApi } from "../../../../services/studentApi";
import { Header } from "../../../components/shared/Header";
import { formatTimeAgo } from "../../../../utils/formatters";

type NotificationType = 'all' | 'assignment' | 'graded' | 'deadline' | 'message' | 'achievement';

export function NotificationList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<NotificationType>('all');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'notifications'],
    queryFn: () => studentApi.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => studentApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => studentApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => studentApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
    },
  });

  const notifications = (data as any)?.data?.data?.notifications || [];
  const unreadCount = (data as any)?.data?.data?.unread_count || 0;

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' ? true : notif.type === filter
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return ClipboardList;
      case 'graded': return CheckCircle;
      case 'deadline': return AlertCircle;
      case 'message': return MessageSquare;
      case 'achievement': return Trophy;
      default: return Bell;
    }
  };

  const tabs = [
    { key: 'all', label: t('student.notifications.tabs.all') },
    { key: 'assignment', label: t('student.notifications.tabs.assignments') },
    { key: 'graded', label: t('student.notifications.tabs.results') },
    { key: 'deadline', label: t('student.notifications.tabs.reminders') },
    { key: 'message', label: t('student.notifications.tabs.messages') },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#EEEEF3" }}>
      <Header breadcrumb={[t('breadcrumb.dashboard'), t('student.notifications.title')]} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1F1344", letterSpacing: "-0.03em" }}>
                {t('student.notifications.title')}
              </h1>
              {unreadCount > 0 && (
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "#EF4444",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {t('student.notifications.unreadCount', { count: unreadCount })}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
              Theo dõi các thông báo và cập nhật mới nhất
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:bg-blue-50"
              style={{
                border: "1px solid #2563EB",
                color: "#2563EB",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Check className="w-4 h-4" />
              {t('student.notifications.markAllRead')}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as NotificationType)}
              className="px-4 py-2 rounded-lg transition-all whitespace-nowrap"
              style={{
                background: filter === tab.key ? "#2563EB" : "white",
                color: filter === tab.key ? "white" : "#6B7280",
                border: `1px solid ${filter === tab.key ? "#2563EB" : "#E5E7EB"}`,
                fontWeight: filter === tab.key ? 600 : 500,
                fontSize: 13,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">{t('common.loading')}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: "#D1D5DB" }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>
              {t('student.notifications.empty.title')}
            </h3>
            <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8 }}>
              {t('student.notifications.empty.subtitle')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              const isUnread = !notif.is_read;

              return (
                <div
                  key={notif.id}
                  className="bg-white rounded-xl p-4 transition-all hover:shadow-md relative"
                  style={{
                    border: isUnread ? "1px solid #2563EB" : "1px solid #E5E7EB",
                    borderLeft: isUnread ? "4px solid #2563EB" : "4px solid #E5E7EB",
                    background: isUnread ? "#F0F9FF" : "white",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${notif.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: notif.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3
                          style={{
                            fontSize: 14,
                            fontWeight: isUnread ? 700 : 600,
                            color: "#1F1344",
                          }}
                        >
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: "#2563EB" }}
                            />
                          )}
                          <button
                            onClick={() => setOpenMenu(openMenu === notif.id ? null : notif.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-all"
                          >
                            <MoreVertical className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        {notif.action_url && (
                          <Link
                            to={notif.action_url}
                            onClick={() => !isUnread || markAsReadMutation.mutate(notif.id)}
                            className="px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                            style={{
                              background: notif.color,
                              color: "white",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {notif.action_label}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    {openMenu === notif.id && (
                      <div
                        className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                        style={{ minWidth: 160 }}
                      >
                        {isUnread && (
                          <button
                            onClick={() => {
                              markAsReadMutation.mutate(notif.id);
                              setOpenMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-all"
                            style={{ fontSize: 13, color: "#374151" }}
                          >
                            <Check className="w-4 h-4" />
                            {t('student.notifications.actions.markRead')}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            deleteNotificationMutation.mutate(notif.id);
                            setOpenMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 transition-all"
                          style={{ fontSize: 13, color: "#EF4444" }}
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('student.notifications.actions.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
