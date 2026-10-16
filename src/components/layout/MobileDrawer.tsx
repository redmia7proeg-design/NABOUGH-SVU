import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';
import {
  Home,
  Video,
  Calendar,
  Users,
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
  LogOut,
  X,
  Sun,
  Moon,
  Crown,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    isDarkMode,
    toggleDarkMode,
    isFullscreen,
    toggleFullscreen,
    unreadCount,
    logout,
  } = useApp();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'lectures', label: 'المحاضرات', icon: Video },
    { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar },
    { id: 'community', label: 'المجتمع والمنشورات', icon: Users },
    { id: 'library', label: 'المكتبة والكتب', icon: BookOpen },
    { id: 'notes', label: 'الملاحظات والملخصات', icon: FileText },
    { id: 'tasks', label: 'المهام الدراسية', icon: CheckSquare },
    { id: 'pomodoro', label: 'مؤقت بومودورو', icon: Clock },
    { id: 'study_center', label: 'مركز الدراسة الذكي', icon: Sparkles },
    { id: 'academic_profile', label: 'الملف الأكاديمي', icon: UserCheck },
    { id: 'gpa', label: 'حاسبة المعدل GPA', icon: Award },
    { id: 'exams', label: 'جدول الامتحانات', icon: FileSpreadsheet },
    { id: 'question_bank', label: 'بنك الأسئلة', icon: HelpCircle },
    { id: 'flashcards', label: 'البطاقات التعليمية', icon: Layers },
    { id: 'teachers', label: 'هيئة التدريس', icon: GraduationCap },
    { id: 'practical_training', label: 'التربية العملية', icon: Briefcase },
    { id: 'bookmarks', label: 'المحفوظات', icon: Bookmark },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: unreadCount },
    { id: 'student_services', label: 'الخدمات الطلابية والشكاوى', icon: Headphones },
    { id: 'settings', label: 'الإعدادات والمظهر', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel (RTL: right side) */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-purple-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">نَبُوغ</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  EDU
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">كلية التربية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {currentUser.role === 'super_admin'
                  ? 'مدير المنصة العام'
                  : currentUser.role === 'admin'
                  ? 'إدارة الكلية'
                  : currentUser.role === 'doctor'
                  ? 'هيئة التدريس'
                  : currentUser.role === 'coordinator'
                  ? 'منسق الكلية'
                  : 'طالب جامعي'}
              </p>
            </div>
          </div>

          {/* Super Admin Panel Shortcut if authorized */}
          {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
            <button
              onClick={() => {
                setCurrentTab('super_admin_panel');
                onClose();
              }}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-purple-500/25"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>لوحة الإدارة المركزية (Super Admin)</span>
            </button>
          )}
        </div>

        {/* Nav Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/80 dark:border-purple-800/60 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{isDarkMode ? 'نهاري' : 'ليلي'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'تصغير' : 'ملء الشاشة'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
