import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab, Role } from '../../types';
import {
  Home,
  Video,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
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
  Sprout,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Shield,
  User as UserIcon,
  LogOut,
  Crown,
  ShieldAlert,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    logout,
    currentTab,
    setCurrentTab,
    isDarkMode,
    toggleDarkMode,
    isFullscreen,
    toggleFullscreen,
    unreadCount,
    isSidebarCollapsed,
  } = useApp();

  const [isMoreOpen, setIsMoreOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const mainNavItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'lectures', label: 'المحاضرات', icon: Video },
    { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar },
    { id: 'community', label: 'المجتمع', icon: Users },
  ];

  const moreNavItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'library', label: 'المكتبة', icon: BookOpen },
    { id: 'notes', label: 'الملاحظات', icon: FileText },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
    { id: 'study_center', label: 'مركز الدراسة', icon: Sparkles },
    { id: 'academic_profile', label: 'الملف الأكاديمي', icon: UserCheck },
    { id: 'gpa', label: 'GPA', icon: Award },
    { id: 'exams', label: 'الامتحانات', icon: FileSpreadsheet },
    { id: 'question_bank', label: 'بنك الأسئلة', icon: HelpCircle },
    { id: 'flashcards', label: 'الفلاش كاردز', icon: Layers },
    { id: 'teachers', label: 'الدكاترة', icon: GraduationCap },
    { id: 'practical_training', label: 'التربية العملية', icon: Briefcase },
    { id: 'bookmarks', label: 'المحفوظات', icon: Bookmark },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'student_services', label: 'خدمات الطالب', icon: Headphones },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 min-h-screen border-l border-slate-200 dark:border-slate-800/80 shadow-xl select-none z-30 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top User & Quick Controls */}
      <div className={`border-b border-slate-200 dark:border-slate-800/80 ${isSidebarCollapsed ? 'p-3 text-center' : 'p-4'}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* User profile menu trigger */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              title={currentUser.name}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-500/40"
              />
              {!isSidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Production User Profile & Account Menu */}
            {showUserMenu && (
              <div className="absolute top-12 right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  <div className="mt-1.5 inline-block">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {currentUser.role === 'super_admin'
                        ? 'مدير المنصة العام'
                        : currentUser.role === 'admin'
                        ? 'إدارة الكلية'
                        : currentUser.role === 'doctor'
                        ? 'عضو هيئة تدريس'
                        : currentUser.role === 'coordinator'
                        ? 'منسق الكلية'
                        : 'طالب جامعي'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCurrentTab('academic_profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-right p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>الملف الشخصي والأكاديمي</span>
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-right p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
                  >
                    <span>إعدادات الحساب</span>
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => {
                        setCurrentTab('super_admin_panel');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-right p-2 rounded-xl text-xs text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition flex items-center justify-between"
                    >
                      <span>لوحة التحكم المركزية</span>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-right p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 transition flex items-center justify-between font-bold"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Icons (Shown only when sidebar is expanded) */}
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('notifications')}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
                title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Current user badge display */}
        {!isSidebarCollapsed && (
          <div className="mt-2.5 px-1 flex items-center justify-between">
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 truncate">{currentUser.specialization || currentUser.department}</p>
            </div>
            {currentUser.role === 'super_admin' ? (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-purple-900/80 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Super Admin</span>
              </span>
            ) : currentUser.role === 'admin' ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                إدارة الكلية
              </span>
            ) : currentUser.role === 'doctor' || currentUser.role === 'teacher' ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                دكتور
              </span>
            ) : currentUser.role === 'coordinator' ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                منسق
              </span>
            ) : currentUser.studentPosition === 'leader' ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                <span>ليدر شعبة</span>
              </span>
            ) : currentUser.studentPosition === 'student_coordinator' ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/50">
                منسق دفعة
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                طالب
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items (Scrollable) */}
      <div className={`flex-1 overflow-y-auto py-4 space-y-1.5 ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {/* Super Admin Control Panel Shortcut */}
        {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
          <button
            onClick={() => setCurrentTab('super_admin_panel')}
            title="لوحة تحكم المنصة المركزية"
            className={`w-full flex items-center rounded-xl text-xs font-black transition mb-2.5 border ${
              isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
            } ${
              currentTab === 'super_admin_panel'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-md shadow-purple-600/30'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-300 shrink-0" />
            {!isSidebarCollapsed && <span>لوحة تحكم المنصة المركزية</span>}
          </button>
        )}

        {/* Main 4 items */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
              className={`w-full flex items-center rounded-xl font-semibold transition group ${
                isSidebarCollapsed ? 'justify-center p-3' : 'gap-3.5 px-3.5 py-2.5 text-sm'
              } ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* More Accordion Section */}
        <div className="pt-2">
          {!isSidebarCollapsed ? (
            <>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition uppercase tracking-wider"
              >
                <span>المزيد من الخدمات</span>
                {isMoreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isMoreOpen && (
                <div className="mt-1 space-y-1 pr-1 border-r border-slate-200 dark:border-slate-800">
                  {moreNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition group ${
                          isActive
                            ? 'bg-purple-50 dark:bg-purple-600/25 text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-500/30'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center justify-center p-3 rounded-xl transition ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-800/50'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Quote & Motivation */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60">
        <div className={`flex items-start ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <span title="كلية التربية — منصة نبوغ" className="shrink-0 mt-0.5">
            <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          {!isSidebarCollapsed && (
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
              "التعليم لا يغير العالم، بل يغير الأشخاص الذين سيغيرون العالم."
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
