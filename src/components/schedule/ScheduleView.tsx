import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { setCurrentTab, setActiveLecture, lectures, schedules, addScheduleItem } = useApp();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDay, setSelectedDay] = useState<string>('Tuesday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventSubject, setNewEventSubject] = useState('');
  const [newEventTime, setNewEventTime] = useState('02:00 م');
  const [newEventRoom, setNewEventRoom] = useState('قاعة 101');

  const daysList: { id: string; nameArabic: string }[] = [
    { id: 'Saturday', nameArabic: 'السبت' },
    { id: 'Sunday', nameArabic: 'الأحد' },
    { id: 'Monday', nameArabic: 'الإثنين' },
    { id: 'Tuesday', nameArabic: 'الثلاثاء' },
    { id: 'Wednesday', nameArabic: 'الأربعاء' },
    { id: 'Thursday', nameArabic: 'الخميس' },
  ];

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventSubject) return;

    const newItem: ScheduleItem = {
      id: `sch_${Date.now()}`,
      subject: newEventSubject,
      subjectId: 'sub_custom',
      instructor: 'جلسة ذاتية / مجموعة دراسية',
      room: newEventRoom,
      day: selectedDay as any,
      dayArabic: daysList.find((d) => d.id === selectedDay)?.nameArabic || 'الثلاثاء',
      startTime: newEventTime,
      endTime: '03:30 م',
      duration: 'ساعة ونصف',
      type: 'study_group',
    };

    await addScheduleItem(newItem);
    setShowAddModal(false);
    setNewEventSubject('');
  };

  const filteredItems = schedules.filter((item) => {
    if (viewMode === 'day') {
      return item.day === selectedDay;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>الجدول الدراسي والتقويم</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مواعيد المحاضرات والقاعات وتنبيهات التعارض الدراسي والفعاليات الأكاديمية
          </p>
        </div>

        {/* View mode toggle & add button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-xl transition ${
                viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              يومي
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl transition ${
                viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl transition ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              شهري
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موعد</span>
          </button>
        </div>
      </div>

      {/* Week Day Pills when in Day View */}
      {viewMode === 'day' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {daysList.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 border ${
                selectedDay === d.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {d.nameArabic}
            </button>
          ))}
        </div>
      )}

      {/* Alert banner: no conflicts */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5">
        <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 font-bold">✓</span>
        <span>لا يوجد أي تعارض زمني في جدولك الأكاديمي لهذا الأسبوع. جميع القاعات محددة ومعتمدة.</span>
      </div>

      {/* Schedule Items Grid / Cards */}
      {viewMode === 'month' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">عرض تقويم شهر سبتمبر / أكتوبر 2025</p>
          <p className="text-xs text-slate-400 mt-1">يحتوي على كافة محاضرات الفصل الدراسي، فترات المراجعة، ومواعيد امتحانات الميدتيرم.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {daysList.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-right">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{d.nameArabic}</p>
                <div className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>• 10:00 ص محاضرة</p>
                  <p>• 12:00 م حلقة نقاش</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    {item.dayArabic}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {item.subject}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.room}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">المدة: {item.duration}</span>
                <button
                  onClick={() => {
                    const lec = lectures.find((l) => l.subjectName.includes(item.subject.slice(0, 5)));
                    if (lec) setActiveLecture(lec);
                    else setCurrentTab('lectures');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  فتح المحاضرة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">إضافة موعد أو فعالية دراسية</h3>
            <form onSubmit={handleAddEvent} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم المادة أو الفعالية
                </label>
                <input
                  type="text"
                  required
                  value={newEventSubject}
                  onChange={(e) => setNewEventSubject(e.target.value)}
                  placeholder="مثال: جلسة مراجعة أصول التربية"
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    الوقت
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    القاعة أو المكان
                  </label>
                  <input
                    type="text"
                    value={newEventRoom}
                    onChange={(e) => setNewEventRoom(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                >
                  حفظ في الجدول
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
