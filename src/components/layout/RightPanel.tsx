import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft,
  FileText,
  MessageSquare,
  Calendar as CalendarIcon,
  Megaphone,
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const { setCurrentTab, setActiveLecture, lectures, openAiWithContext } = useApp();
  const [currentMonth, setCurrentMonth] = useState('سبتمبر 2025');

  // Today's schedule events
  const todayEvents = [
    {
      id: 'ev_01',
      time: '10:00 ص',
      title: 'علم النفس التربوي',
      location: 'قاعة 201',
      icon: Clock,
      lectureId: 'lec_01',
    },
    {
      id: 'ev_02',
      time: '12:00 م',
      title: 'طرق التدريس',
      location: 'قاعة 215',
      icon: Clock,
      lectureId: 'lec_02',
    },
    {
      id: 'ev_03',
      time: '3:00 م',
      title: 'اجتماع مجموعة البحث',
      location: 'مبنى الكلية',
      icon: Clock,
    },
    {
      id: 'ev_04',
      time: '5:00 م',
      title: 'جلسة مذاكرة',
      location: 'منزلك',
      icon: Clock,
    },
  ];

  // Calendar days grid
  const daysHeader = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  // September 2025 sample layout
  const calendarRows = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '1', '2', '3'],
    ['4', '5', '6', '7', '8', '9', '10'],
    ['11', '12', '13', '14', '15', '16', '17'],
    ['18', '19', '20', '21', '22', '23', '24'],
    ['25', '26', '27', '28', '29', '30', ''],
  ];

  const handleEventClick = (lectureId?: string) => {
    if (lectureId) {
      const lec = lectures.find((l) => l.id === lectureId);
      if (lec) {
        setActiveLecture(lec);
        return;
      }
    }
    setCurrentTab('schedule');
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-5 overflow-y-auto select-none transition-colors">
      {/* 1. Mini Calendar Section */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">التقويم</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{currentMonth}</span>
            <div className="flex items-center text-slate-400 mr-1">
              <button className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
          {daysHeader.map((d, i) => (
            <span key={i} className="truncate">{d.slice(0, 3)}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="space-y-1">
          {calendarRows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-7 gap-1 text-center text-xs">
              {row.map((day, cIdx) => {
                const isToday = day === '23';
                return (
                  <button
                    key={cIdx}
                    onClick={() => setCurrentTab('schedule')}
                    className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs transition ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                        : day
                        ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        : 'text-transparent pointer-events-none'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Today's Events Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">فعاليات اليوم</h3>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">4 مواعيد</span>
        </div>

        <div className="space-y-2">
          {todayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event.lectureId)}
              className="w-full text-right flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 transition group"
            >
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {event.title}
                </p>
                <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{event.location}</span>
                  </span>
                  <span>•</span>
                  <span>{event.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Notifications Preview Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">الإشعارات</h3>
          <button
            onClick={() => setCurrentTab('notifications')}
            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            عرض الكل
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-right">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                تمت إضافة ملاحظة جديدة لمادة علم النفس التربوي
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">منذ 5 دقائق</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-right">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                تم الرد على تعليقك في مجموعة الفرقة الثالثة
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">منذ 20 دقيقة</span>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-right">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                لديك امتحان قادم في مادة التربية المقارنة
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">منذ ساعة</span>
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-right">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                تم نشر إعلان جديد من إدارة الكلية
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">منذ ساعتين</span>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nabough AI Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-4 text-white shadow-xl border border-indigo-900/50">
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <h4 className="text-sm font-black tracking-wide text-white">نبوغ AI</h4>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
              مساعد أكاديمي
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            مساعدك الذكي في دراستك. اسأل - احصل على ملخصات - أنشئ بطاقات تعليمية.
          </p>

          <button
            onClick={() => openAiWithContext()}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-700/30"
          >
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
