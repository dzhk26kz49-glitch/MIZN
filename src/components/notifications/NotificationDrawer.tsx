import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, Briefcase, ShieldAlert, Trash2 } from 'lucide-react';

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-start">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col justify-between text-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="font-extrabold text-base text-slate-100">مركزي الإشعارات والتنبيهات</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              تحديد الكل كُمقروء
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto text-slate-700" />
              <p>لا توجد إشعارات جديدة حالياً.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                  n.isRead
                    ? 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 block font-mono">
                  {new Date(n.createdAt).toLocaleTimeString('ar-IQ')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
          منصة MIZN تقوم بتحديث حالة طلبيتك تلقائياً
        </div>
      </div>
    </div>
  );
};
