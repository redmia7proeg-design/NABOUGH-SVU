import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticalTraining } from '../../types';
import {
  Briefcase,
  School,
  UserCheck,
  CheckCircle2,
  Calendar,
  FileText,
  Award,
  Plus,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const initialTrainingData: PracticalTraining = {
  schoolName: 'مدرسة الشهيد محمد الدرة الإعدادية بنين',
  schoolType: 'حكومي رسمي',
  supervisorName: 'أ.د. عصام عبد الرحمن الشناوي',
  mentorTeacher: 'أ. محمود فوزي بدوي',
  gradeLevel: 'الصف الأول والثاني الإعدادي',
  totalHoursRequired: 60,
  completedHours: 36,
  attendanceRate: 98,
  lessonPlans: [
    {
      id: 'lp_01',
      title: 'خطة درس تطبيقي: التفكير وحل المشكلات الصفية',
      subject: 'العلوم العامة',
      date: '2026-03-05',
      grade: 'الصف الأول الإعدادي',
      status: 'approved',
      score: 95,
    },
    {
      id: 'lp_02',
      title: 'خطة درس: تطبيقات الذكاءات المتعددة في الصف الدراسي',
      subject: 'اللغة العربية والمهارات',
      date: '2026-03-12',
      grade: 'الصف الثاني الإعدادي',
      status: 'approved',
      score: 92,
    },
  ],
  supervisorVisits: [
    {
      id: 'sv_01',
      date: '2026-03-08',
      notes: 'إدارة صفية متميزة، استخدام ممتاز للوسائل البصرية واستثارة دافعية الطلاب للمشاركة.',
      evaluationScore: 96,
    },
  ],
};

export const PracticalTrainingView: React.FC = () => {
  const { openAiWithContext } = useApp();
  const [training, setTraining] = useState<PracticalTraining>(initialTrainingData);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planSubject, setPlanSubject] = useState('العلوم العامة');
  const [planGrade, setPlanGrade] = useState('الصف الأول الإعدادي');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    const newPlan = {
      id: `lp_${Date.now()}`,
      title: planTitle.trim(),
      subject: planSubject,
      date: new Date().toISOString().substring(0, 10),
      grade: planGrade,
      status: 'pending' as const,
    };

    setTraining({
      ...training,
      lessonPlans: [newPlan, ...training.lessonPlans],
    });
    setPlanTitle('');
    setShowAddPlanModal(false);
  };

  const progressPercent = Math.round(
    (training.completedHours / training.totalHoursRequired) * 100
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span>نظام التربية العملية والميدانية (ميداني)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة ساعات التدريب في مدارس الشراكة، خطط الدروس، تقييمات المشرف الأكاديمي، والمعلم الخبير
          </p>
        </div>

        <button
          onClick={() => setShowAddPlanModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>إعداد خطة تدريس جديدة</span>
        </button>
      </div>

      {/* Overview School & Supervisor Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <School className="w-4 h-4 text-emerald-600" />
              <span>مدرسة التدريب الميداني</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{training.schoolName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{training.schoolType}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>المشرف الأكاديمي بالكلية</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{training.supervisorName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">قسم المناهج وطرق التدريس</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>المعلم الخبير المرشد</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{training.mentorTeacher}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{training.gradeLevel}</p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ساعات التدريب المنجزة</span>
              <span className="font-bold text-emerald-600 font-mono">
                {training.completedHours} / {training.totalHoursRequired} ساعة
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">نسبة الحضور الميداني: {training.attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid: Lesson Plans & Supervisor Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Plans */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>خطط الدروس التطبيقية ({training.lessonPlans.length})</span>
            </h3>
            <button
              onClick={() =>
                openAiWithContext(
                  'طرق التدريس',
                  'اقترح لي خطة درس نموذجية لمعلم مبتدئ تتضمن التهيئة، الأهداف السلوكية (معرفي، وجداني، مهاري)، الأنشطة الصفية، والتقويم الختامي.'
                )
              }
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>صياغة خطة بـ AI</span>
            </button>
          </div>

          <div className="space-y-3">
            {training.lessonPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-right"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        plan.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {plan.status === 'approved' ? 'معتمدة ومقيمة' : 'قيد المراجعة'}
                    </span>
                    {plan.score && (
                      <span className="font-mono font-bold text-emerald-600 text-xs">
                        {plan.score} / 100
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{plan.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {plan.subject} • {plan.grade} • {plan.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisor Field Visits */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>سجل زيارات المشرف الميداني</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">التقييم المستمر</span>
          </div>

          <div className="space-y-3">
            {training.supervisorVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-right space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{visit.date}</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>الدرجة: {visit.evaluationScore} / 100</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>ملاحظات المشرف:</strong> {visit.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Lesson Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">إضافة خطة درس تطبيقي</h3>
            <form onSubmit={handleCreatePlan} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  عنوان الدرس
                </label>
                <input
                  type="text"
                  required
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="مثال: استراتيجية خرائط المفاهيم في دورة الماء"
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  المادة
                </label>
                <input
                  type="text"
                  value={planSubject}
                  onChange={(e) => setPlanSubject(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  المرحلة / الصف الدراسي
                </label>
                <input
                  type="text"
                  value={planGrade}
                  onChange={(e) => setPlanGrade(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                >
                  رفع الخطة للاعتماد
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
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
