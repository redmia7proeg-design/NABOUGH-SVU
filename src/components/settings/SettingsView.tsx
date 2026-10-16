import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Smartphone,
  Shield,
  HelpCircle,
  GraduationCap,
  Globe,
  Sliders,
  Check,
  LogOut,
  UserCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, isDarkMode, toggleDarkMode, setRole, logout } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>الإعدادات وتفضيلات التطبيق</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تخصيص المظهر، التنبيهات، تثبيت تطبيق نبوغ PWA، وإدارة الحساب
        </p>
      </div>

      {/* Theme & Display Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          <span>المظهر والعرض</span>
        </h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold transition shadow-sm"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            <span>{isDarkMode ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}</span>
          </button>
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">السمة والنمط البصري</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isDarkMode ? 'الوضع الليلي مفعّل (مريح للعينين أثناء القراءة الليلية)' : 'الوضع النهاري مفعّل'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <PWAInstallButton />
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تطبيق الهاتف والكمبيوتر (PWA)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تثبيت نبوغ كبرنامج مستقل على شاشة جهازك والعمل دون اتصال
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <span>تفضيلات التنبيهات الذكية</span>
        </h3>

        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                notificationsEnabled ? 'left-1' : 'right-1'
              }`}
            />
          </button>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إشعارات المحاضرات الجديدة</h4>
            <p className="text-[11px] text-slate-400">تنبيه فوري عند رفع تسجيل أو ملف جديد لمقرراتك</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setExamReminders(!examReminders)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              examReminders ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                examReminders ? 'left-1' : 'right-1'
              }`}
            />
          </button>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تذكيرات الامتحانات والواجبات</h4>
            <p className="text-[11px] text-slate-400">تنبيه ذكي قبل موعد الاختبار بـ 48 ساعة</p>
          </div>
        </div>
      </div>

      {/* Role Switching for testing */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>تبديل الدور لتجربة الصلاحيات</span>
        </h3>
        <p className="text-xs text-slate-500">
          يمكنك التحويل الفوري بين حساب الطالب، عضو هيئة التدريس، منسق الكلية، وإدارة الكلية لتجربة جميع شاشات المنظومة:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setRole('student')}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition ${
              currentUser.role === 'student'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            حساب الطالب (عماد الدين)
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition ${
              currentUser.role === 'doctor' || currentUser.role === 'teacher'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            حساب الدكتور (أ.د. أحمد رمضان)
          </button>
          <button
            onClick={() => setRole('coordinator')}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition ${
              currentUser.role === 'coordinator'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            حساب منسق الكلية (د. منى)
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition ${
              currentUser.role === 'admin' || currentUser.role === 'super_admin'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            حساب الإدارة (عميد الكلية)
          </button>
        </div>
      </div>

      {/* Account & Session Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-rose-600" />
          <span>إدارة الحساب وجلسة الدخول</span>
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">{currentUser.name}</span>
            <span className="text-[11px] text-slate-500 block">{currentUser.email} • {currentUser.studentId}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </div>

      {/* About Nabough */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-right space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-amber-300" />
          <h4 className="text-base font-black">نَبُوغ — كلية التربية في مكان واحد</h4>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed">
          المنظومة الرقمية الشاملة والمصممة خصيصاً لطلاب وأعضاء هيئة التدريس بكليات التربية. تجمع المحاضرات، الجداول، المذكرات، التربية العملية، بنك الأسئلة، والمساعد الذكي نبوغ AI في منصة عربية موحدة.
        </p>
        <span className="text-[10px] text-blue-300 block font-mono">الإصدار 1.0.0 — PWA Ready</span>
      </div>
    </div>
  );
};
