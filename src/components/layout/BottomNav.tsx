import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';
import {
  Home,
  Video,
  Calendar,
  Users,
  Grid,
  X,
  BookOpen,
  FileText,
  CheckSquare,
  Clock,
  Sparkles,
  UserCheck,
  Award,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  GraduationCap,
  Briefcase,
  Bookmark,
  Bell,
  Headphones,
  Settings,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, unreadCount, openAiWithContext } = useApp();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'lectures', label: 'المحاضرات', icon: Video },
    { id: 'schedule', label: 'الجدول', icon: Calendar },
    { id: 'community', label: 'المجتمع', icon: Users },
  ];

  const moreItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'library', label: 'المكتبة الرقمية', icon: BookOpen },
    { id: 'notes', label: 'الملاحظات', icon: FileText },
    { id: 'tasks', label: 'إدارة المهام', icon: CheckSquare },
    { id: 'pomodoro', label: 'جلسات التركيز', icon: Clock },
    { id: 'study_center', label: 'مركز الدراسة', icon: Sparkles },
    { id: 'academic_profile', label: 'الملف الأكاديمي', icon: UserCheck },
    { id: 'gpa', label: 'حساب المعدل GPA', icon: Award },
    { id: 'exams', label: 'جدول الامتحانات', icon: FileSpreadsheet },
    { id: 'question_bank', label: 'بنك الأسئلة', icon: HelpCircle },
    { id: 'flashcards', label: 'البطاقات التعليمية', icon: Layers },
    { id: 'teachers', label: 'دكاترة المقررات', icon: GraduationCap },
    { id: 'practical_training', label: 'التربية العملية', icon: Briefcase },
    { id: 'bookmarks', label: 'المحفوظات', icon: Bookmark },
    { id: 'notifications', label: 'مركز الإشعارات', icon: Bell },
    { id: 'student_services', label: 'خدمات وشكاوى الطالب', icon: Headphones },
    { id: 'settings', label: 'الإعدادات العامة', icon: Settings },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* Bottom bar for mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg select-none">
        <div className="flex items-center justify-around">
          {mainTabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCurrentTab(t.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">{t.label}</span>
              </button>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setIsMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isMoreSheetOpen || (!mainTabs.some((m) => m.id === currentTab))
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">المزيد</span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {isMoreSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 max-h-[82vh] overflow-y-auto text-right shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">جميع خدمات منصة نبوغ</h3>
            </div>

            {/* Quick AI Trigger */}
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  openAiWithContext();
                }}
                className="w-full flex items-center justify-between font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <div className="text-right">
                    <p className="font-bold text-sm">نبوغ AI — المساعد الذكي</p>
                    <p className="text-[11px] text-blue-100">تلخيص المحاضرات، حل الأسئلة، وخطة المذاكرة</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white text-[10px]">فتح</span>
              </button>
            </div>

            {/* Grid of all more items */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition border ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-500/40'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
