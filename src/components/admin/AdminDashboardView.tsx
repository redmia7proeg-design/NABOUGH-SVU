import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Download,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { subjects, lectures } = useApp();

  const adminStats = [
    { title: 'إجمالي الطلاب المسجلين بالكلية', value: '3,420', sub: 'في الفرق الأربعة', color: 'text-blue-600' },
    { title: 'أعضاء هيئة التدريس والهيئة المعاونة', value: '184', sub: 'دكتور ومدرس مساعد', color: 'text-indigo-600' },
    { title: 'المقررات الدراسية الفعالة', value: '42', sub: 'الفصل الدراسي الأول', color: 'text-purple-600' },
    { title: 'المستخدمون النشطون اليوم', value: '1,240', sub: 'تفاعل لحظي في المنصة', color: 'text-emerald-600' },
  ];

  const departmentsList = [
    { name: 'قسم علم النفس التربوي', head: 'أ.د. عصام علي', students: 820, subjects: 8 },
    { name: 'قسم المناهج وطرق التدريس', head: 'أ.د. نبيل محمود', students: 1100, subjects: 12 },
    { name: 'قسم أصول التربية', head: 'أ.د. هناء شريف', students: 780, subjects: 9 },
    { name: 'قسم تكنولوجيا التعليم', head: 'أ.د. إيمان الشريف', students: 450, subjects: 7 },
    { name: 'قسم الصحة النفسية والتربية الخاصة', head: 'أ.د. فاروق حسن', students: 270, subjects: 6 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>لوحة القيادة والإدارة العليا لكلية التربية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إحصائيات المنظومة الرقمية، الأقسام العلمية، التقارير الأكاديمية، وضمان الجودة
          </p>
        </div>

        <button
          onClick={() => alert('تم تصدير تقرير الأداء الفصلي الشامل بصيغة PDF معتمد!')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30"
        >
          <Download className="w-4 h-4" />
          <span>تصدير تقرير الاعتماد الأكاديمي</span>
        </button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right"
          >
            <span className="text-xs text-slate-400 font-medium">{stat.title}</span>
            <div className={`mt-2 text-3xl font-black font-mono ${stat.color}`}>{stat.value}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Department Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">الأقسام العلمية المعتمدة</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 pr-4 font-bold">اسم القسم العلمي</th>
                <th className="pb-3 pr-4 font-bold">رئيس القسم</th>
                <th className="pb-3 pr-4 font-bold">عدد الطلاب</th>
                <th className="pb-3 pr-4 font-bold">المقررات</th>
                <th className="pb-3 pr-4 font-bold">الحالة الأكاديمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentsList.map((dep, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">{dep.name}</td>
                  <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dep.head}</td>
                  <td className="py-3.5 pr-4 font-mono font-bold text-blue-600">{dep.students}</td>
                  <td className="py-3.5 pr-4 font-mono">{dep.subjects} مقررات</td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold text-[10px]">
                      معتمد جودة
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
