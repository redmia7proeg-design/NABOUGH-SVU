import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, FileText, MessageSquare, Calendar, Megaphone } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'academic' | 'schedule' | 'community' | 'system'>('all');

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.category === filter
  );

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'academic':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'system':
      default:
        return <Megaphone className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>مركز الإشعارات والتنبيهات</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تابع مستجدات المحاضرات، تنبيهات مواعيد الامتحانات، وتفاعلات المجتمع الأكاديمي
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          الكل ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('academic')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'academic' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          أكاديمي
        </button>
        <button
          onClick={() => setFilter('schedule')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          الجدول والامتحانات
        </button>
        <button
          onClick={() => setFilter('community')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'community' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          المجتمع
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markNotificationRead(item.id)}
            className={`p-4 rounded-3xl border transition cursor-pointer flex items-start gap-4 text-right ${
              !item.read
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
            }`}
          >
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
              {getIcon(item.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>
            {!item.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};
