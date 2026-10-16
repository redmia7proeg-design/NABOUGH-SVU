import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Search,
  GraduationCap,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Shield,
  Layers,
  LogOut,
  Crown,
  Briefcase,
} from 'lucide-react';
import { Role } from '../../types';

export const TopNav: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    currentUser,
    setRole,
    quickDemoLogin,
    logout,
    searchQuery,
    setSearchQuery,
    currentTab,
    setCurrentTab,
    isDarkMode,
    toggleDarkMode,
    unreadCount,
    openAiWithContext,
    isSidebarCollapsed,
    toggleSidebar,
    toggleMobileDrawer,
  } = useApp();

  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If not already on library or lectures, can open library with filter
      if (currentTab !== 'library' && currentTab !== 'lectures') {
        setCurrentTab('library');
      }
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Right Section: Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Interactive Hamburger Menu for both Desktop & Mobile */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                toggleSidebar();
              } else if (onMobileMenuToggle) {
                onMobileMenuToggle();
              } else {
                toggleMobileDrawer();
              }
            }}
            className={`p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 active:scale-95 ${
              isSidebarCollapsed ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : ''
            }`}
            aria-label="تبديل القائمة الجانبية"
            title="تبديل القائمة الجانبية (تصغير / توسيع)"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-right group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">نَبُوغ</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  EDU
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">كلية التربية في مكان واحد</p>
            </div>
          </button>
        </div>

        {/* Center Section: Universal Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في نبوغ... (محاضرات، ملفات، دكاترة، أسئلة، مذكرات)"
              className="w-full h-10 pr-10 pl-4 text-xs lg:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent dark:border-slate-700/60 transition"
            />
            <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Left Section: Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Nabough AI button */}
          <button
            onClick={() => openAiWithContext()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 hover:opacity-95 transition hover:scale-105 active:scale-95"
            title="المساعد الذكي نبوغ AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">نبوغ AI</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />

            {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelect(!showRoleSelect)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="تغيير صفة المستخدم"
            >
              {currentUser.role === 'super_admin' ? (
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              ) : currentUser.studentPosition === 'leader' ? (
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span>
                {currentUser.role === 'super_admin'
                  ? 'Super Admin'
                  : currentUser.role === 'student'
                  ? currentUser.studentPosition === 'leader'
                    ? 'ليدر شعبة'
                    : currentUser.studentPosition === 'student_coordinator'
                    ? 'منسق دفعة'
                    : 'طالب'
                  : currentUser.role === 'doctor' || currentUser.role === 'teacher'
                  ? 'دكتور'
                  : currentUser.role === 'coordinator'
                  ? 'منسق'
                  : 'إدارة'}
              </span>
            </button>

            {showRoleSelect && (
              <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-right animate-in fade-in duration-100">
                <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase">التبديل السريع للأدوار</p>
                
                <button
                  onClick={() => {
                    setRole('super_admin');
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-xl transition flex items-center justify-between ${
                    currentUser.role === 'super_admin' ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-600 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>مدير المنصة (Super Admin)</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setRole('admin');
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-xl transition ${
                    currentUser.role === 'admin' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  إدارة الكلية (العميد)
                </button>

                <button
                  onClick={() => {
                    setRole('doctor');
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-xl transition ${
                    currentUser.role === 'doctor' || currentUser.role === 'teacher' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  عضو هيئة تدريس (أ.د. أحمد)
                </button>

                <button
                  onClick={() => {
                    setRole('coordinator');
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-xl transition ${
                    currentUser.role === 'coordinator' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  منسق الكلية (د. منى)
                </button>

                <button
                  onClick={() => {
                    setRole('student');
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-xl transition ${
                    currentUser.role === 'student' && !currentUser.studentPosition ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  طالب عادي (عماد الدين)
                </button>

                <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <p className="px-3 py-1 text-[10px] font-bold text-amber-500 uppercase">مناصب طلابية</p>
                  <button
                    onClick={() => {
                      quickDemoLogin('student_leader');
                      setShowRoleSelect(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 text-xs rounded-xl transition flex items-center justify-between ${
                      currentUser.role === 'student' && currentUser.studentPosition === 'leader'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>ليدر شعبة (زياد شلبي)</span>
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                  <button
                    onClick={() => {
                      quickDemoLogin('student_coordinator');
                      setShowRoleSelect(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 mt-0.5 text-xs rounded-xl transition flex items-center justify-between ${
                      currentUser.role === 'student' && currentUser.studentPosition === 'student_coordinator'
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>منسق دفعة (مريم سالم)</span>
                    <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                  </button>
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowRoleSelect(false);
                      logout();
                    }}
                    className="w-full text-right px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition flex items-center justify-between"
                  >
                    <span>تسجيل الخروج</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Mobile & Desktop) */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Icon */}
          <button
            onClick={() => setCurrentTab('notifications')}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
