import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  Calculator,
  ChevronLeft,
} from 'lucide-react';

export const AcademicProfileView: React.FC = () => {
  const { currentUser, subjects } = useApp();

  // GPA Simulator state
  const [targetGrades, setTargetGrades] = useState<{ [subjectId: string]: number }>({
    sub_01: 3.7,
    sub_02: 3.5,
    sub_03: 4.0,
    sub_04: 3.3,
  });

  const levelsJourney = [
    {
      level: 'الفرقة الأولى',
      academicYear: '2022 - 2023',
      status: 'completed',
      gpa: 3.75,
      completedHours: 34,
      honors: 'تقدير امتياز مع مرتبة الشرف الأولى',
    },
    {
      level: 'الفرقة الثانية',
      academicYear: '2023 - 2024',
      status: 'completed',
      gpa: 3.8,
      completedHours: 32,
      honors: 'تقدير امتياز مع مرتبة الشرف الأولى',
    },
    {
      level: 'الفرقة الثالثة',
      academicYear: '2024 - 2025 (الحالية)',
      status: 'current',
      gpa: 3.82,
      completedHours: 28,
      honors: 'قيد الدراسة (الفصل الدراسي الأول)',
    },
    {
      level: 'الفرقة الرابعة',
      academicYear: '2025 - 2026',
      status: 'upcoming',
      gpa: 0,
      completedHours: 38,
      honors: 'سنة التخرج ومشروع التخرج والتربية العملية المتقدمة',
    },
  ];

  const graduationProgressPercent = Math.round(
    (currentUser.completedCreditHours / currentUser.totalCreditHours) * 100
  );

  // Calculate simulated GPA
  const simulatedAverage = (
    Object.values(targetGrades).reduce((acc, v) => acc + v, 0) /
    (Object.values(targetGrades).length || 1)
  ).toFixed(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>مسيرتي الأكاديمية وسجل الدرجات</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة التقدم التراكمي نحو التخرج، الساعات المعتمدة، وحساب المعدل التراكمي GPA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900">
            الرقم الأكاديمي: {currentUser.studentId}
          </span>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">المعدل التراكمي (GPA)</span>
          <div className="mt-2 text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {currentUser.gpa.toFixed(2)}
          </div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">امتياز مع مرتبة الشرف 🏆</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">الساعات المنجزة</span>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-mono">
            {currentUser.completedCreditHours}{' '}
            <span className="text-xs font-normal text-slate-400">/ {currentUser.totalCreditHours}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">ساعة معتمدة</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">نسبة إنجاز خطة التخرج</span>
          <div className="mt-2 text-3xl font-black text-emerald-600 font-mono">
            {graduationProgressPercent}%
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${graduationProgressPercent}%` }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">الفرقة والتخصص</span>
          <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
            {currentUser.level}
          </h3>
          <span className="text-[11px] text-slate-400 mt-1 block">{currentUser.specialization}</span>
        </div>
      </div>

      {/* Visual 4-Year Journey */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>مسار السنوات الدراسية نحو التخرج (4 سنوات)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {levelsJourney.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border transition relative flex flex-col justify-between text-right ${
                item.status === 'completed'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80'
                  : item.status === 'current'
                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'current'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}
                  >
                    {item.status === 'completed' ? 'تم اجتيازها' : item.status === 'current' ? 'الفرقة الحالية' : 'مستقبلية'}
                  </span>
                  {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.level}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.academicYear}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {item.honors}
                </p>
              </div>

              {item.gpa > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">المعدل:</span>
                  <span className="font-bold font-mono text-emerald-600">{item.gpa}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GPA Calculator Simulator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              محاكي وحاسبة المعدل التراكمي التوقعي (GPA Simulator)
            </h3>
          </div>
          <span className="text-xs text-slate-400">توقع تقديرات مقررات الفصل الحالي</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.slice(0, 4).map((sub) => (
            <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-right space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {sub.name}
              </span>
              <p className="text-[11px] text-slate-400">{sub.creditHours} ساعات معتمدة</p>
              <select
                value={targetGrades[sub.id] || 3.7}
                onChange={(e) =>
                  setTargetGrades({ ...targetGrades, [sub.id]: parseFloat(e.target.value) })
                }
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <option value="4.0">A+ (امتياز مرتفع - 4.0)</option>
                <option value="3.7">A (امتياز - 3.7)</option>
                <option value="3.3">B+ (جيد جداً مرتفع - 3.3)</option>
                <option value="3.0">B (جيد جداً - 3.0)</option>
                <option value="2.7">C+ (جيد مرتفع - 2.7)</option>
                <option value="2.0">C (مقبول - 2.0)</option>
              </select>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
          <span>المعدل الفصلي المتوقع بناءً على تقديراتك:</span>
          <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {simulatedAverage} / 4.00
          </span>
        </div>
      </div>
    </div>
  );
};
