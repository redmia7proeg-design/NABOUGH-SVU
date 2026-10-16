import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  School,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Filter,
  Search,
  Plus,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
} from 'lucide-react';

interface PartnerSchool {
  id: string;
  name: string;
  type: string;
  stage: 'ابتدائي' | 'إعدادي' | 'ثانوي' | 'تجريبي لغات';
  address: string;
  principal: string;
  mentorTeacher: string;
  supervisor: string;
  assignedStudentsCount: number;
  capacity: number;
  status: 'active' | 'completed' | 'pending';
}

interface SupervisionVisit {
  id: string;
  supervisorName: string;
  schoolName: string;
  date: string;
  time: string;
  focus: string;
  status: 'scheduled' | 'done' | 'delayed';
  evaluatedStudents: number;
}

interface PendingLessonPlan {
  id: string;
  studentName: string;
  studentCode: string;
  schoolName: string;
  subject: string;
  lessonTitle: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'revision';
}

export const CoordinatorDashboardView: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'schools' | 'supervisors' | 'approvals' | 'scheduling'>('schools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Partner schools data
  const [schools, setSchools] = useState<PartnerSchool[]>([
    {
      id: 'sch_01',
      name: 'مدرسة الأورمان الثانوية النموذجية للبنات',
      type: 'حكومي رسمي',
      stage: 'ثانوي',
      address: 'الدقي — محافظة الجيزة',
      principal: 'أ. وفاء عبد الحميد',
      mentorTeacher: 'أ. نادية إبراهيم',
      supervisor: 'أ.د. عصام علي',
      assignedStudentsCount: 36,
      capacity: 40,
      status: 'active',
    },
    {
      id: 'sch_02',
      name: 'مدرسة النصر الإعدادية بنين',
      type: 'حكومي',
      stage: 'إعدادي',
      address: 'العجوزة — شارع النيل',
      principal: 'أ. محمود عبد الشافي',
      mentorTeacher: 'أ. سامح عثمان',
      supervisor: 'د. نبيل محمود',
      assignedStudentsCount: 28,
      capacity: 30,
      status: 'active',
    },
    {
      id: 'sch_03',
      name: 'مدرسة الشهيد رامي الرسمية للغات (تجريبي)',
      type: 'رسمي لغات',
      stage: 'تجريبي لغات',
      address: 'المهندسين — شارع جامعة الدول',
      principal: 'أ. نجوى فريد',
      mentorTeacher: 'أ. شيرين كمال',
      supervisor: 'د. إيمان الشريف',
      assignedStudentsCount: 42,
      capacity: 45,
      status: 'active',
    },
    {
      id: 'sch_04',
      name: 'مدرسة السعيدية الثانوية العسكرية بنين',
      type: 'حكومي عريق',
      stage: 'ثانوي',
      address: 'ميدان الجيزة — أمام جامعة القاهرة',
      principal: 'أ. عاطف مهران',
      mentorTeacher: 'أ. أحمد الشحات',
      supervisor: 'أ.د. فاروق حسن',
      assignedStudentsCount: 48,
      capacity: 50,
      status: 'active',
    },
    {
      id: 'sch_05',
      name: 'مدرسة طه حسين الابتدائية المشتركة',
      type: 'حكومي',
      stage: 'ابتدائي',
      address: 'بين السرايات — الجيزة',
      principal: 'أ. منال عبد الصبور',
      mentorTeacher: 'أ. دعاء مصطفى',
      supervisor: 'د. أحمد رمضان',
      assignedStudentsCount: 32,
      capacity: 35,
      status: 'active',
    },
  ]);

  // Scheduled supervisor visits
  const [visits] = useState<SupervisionVisit[]>([
    {
      id: 'vis_01',
      supervisorName: 'أ.د. عصام علي (رئيس قسم علم النفس)',
      schoolName: 'مدرسة الأورمان الثانوية للبنات',
      date: 'اليوم — 23 سبتمبر',
      time: '09:30 ص',
      focus: 'ملاحظة الأداء التدريسي والتمهيد للدرس واستراتيجيات الحوار',
      status: 'scheduled',
      evaluatedStudents: 6,
    },
    {
      id: 'vis_02',
      supervisorName: 'د. نبيل محمود (المناهج وطرق التدريس)',
      schoolName: 'مدرسة النصر الإعدادية بنين',
      date: 'الأربعاء — 24 سبتمبر',
      time: '10:00 ص',
      focus: 'تقييم استخدام الوسائل التعليمية والوسائط التفاعلية',
      status: 'scheduled',
      evaluatedStudents: 8,
    },
    {
      id: 'vis_03',
      supervisorName: 'د. إيمان الشريف (تكنولوجيا التعليم)',
      schoolName: 'مدرسة الشهيد رامي الرسمية للغات',
      date: 'الخميس — 25 سبتمبر',
      time: '11:00 ص',
      focus: 'التدريس المصغر وإدارة الصفوف التفاعلية',
      status: 'scheduled',
      evaluatedStudents: 10,
    },
  ]);

  // Pending lesson plans
  const [pendingPlans, setPendingPlans] = useState<PendingLessonPlan[]>([
    {
      id: 'pln_01',
      studentName: 'عماد الدين خليل',
      studentCode: 'EDU-2023-8841',
      schoolName: 'مدرسة الأورمان الثانوية',
      subject: 'علم النفس التربوي (الصف الثاني الثانوي)',
      lessonTitle: 'خطة درس: نظريات التعلم الاشتراطي وتطبيقاتها الصفية',
      submittedAt: 'منذ 2 ساعة',
      status: 'pending',
    },
    {
      id: 'pln_02',
      studentName: 'سارة أحمد مصطفى',
      studentCode: 'EDU-2024-3190',
      schoolName: 'مدرسة الشهيد رامي الرسمية',
      subject: 'الحاسب الآلي وتكنولوجيا التعليم (الصف الأول الإعدادي)',
      lessonTitle: 'خطة درس: تصميم الخوارزميات وخرائط التدفق',
      submittedAt: 'منذ 4 ساعات',
      status: 'pending',
    },
    {
      id: 'pln_03',
      studentName: 'كريم محمود الزيات',
      studentCode: 'EDU-2022-1402',
      schoolName: 'مدرسة النصر الإعدادية',
      subject: 'اللغة الإنجليزية (الصف الثالث الإعدادي)',
      lessonTitle: 'خطة درس: Active vs Passive Voice with Interactive Roleplay',
      submittedAt: 'اليوم 08:30 ص',
      status: 'pending',
    },
  ]);

  const handleApprovePlan = (id: string, name: string) => {
    setPendingPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
    setActionSuccessMessage(`تم اعتماد خطة درس الطالب (${name}) بنجاح وإرسال الإشعار له.`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleRejectPlan = (id: string, name: string) => {
    setPendingPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'revision' } : p))
    );
    setActionSuccessMessage(`تمت إعادة خطة درس الطالب (${name}) لإجراء التعديلات المطلوبة.`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const filteredSchools = schools.filter((s) => {
    const matchQuery =
      s.name.includes(searchQuery) ||
      s.supervisor.includes(searchQuery) ||
      s.address.includes(searchQuery);
    const matchStage = selectedStage === 'all' || s.stage === selectedStage;
    return matchQuery && matchStage;
  });

  return (
    <div className="space-y-6 pb-14 text-right">
      {/* Toast Alert */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Coordinator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-black mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>لوحة تحكم منسق الكلية والتدريب الميداني</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>مرحباً، {currentUser.name}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentUser.specialization} — {currentUser.department}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActionSuccessMessage('تم تصدير كشوف التوزيع الميداني المعتمدة بصيغة PDF!');
              setTimeout(() => setActionSuccessMessage(null), 3000);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>كشوف التوزيع الميداني (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">المدارس الشريكة المعتمدة</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-mono">18</div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1 block">
            في الجيزة والقاهرة الكبرى
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">الطلاب الموزعون بالمدارس</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-blue-600 font-mono">480</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            نسبة التسكين 100% (الفرق 3 و 4)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">المشرفون الأكاديميون</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-indigo-600 font-mono">24</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            من كافة الأقسام التخصصية
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">خطط التدريس المعتمدة</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600 font-mono">1,240</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            نسبة الالتزام 98.4%
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('schools')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'schools'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>مدارس التدريب الميداني ({schools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap relative ${
            activeTab === 'approvals'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>اعتماد خطط الدروس والتقارير</span>
          {pendingPlans.filter((p) => p.status === 'pending').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-mono flex items-center justify-center">
              {pendingPlans.filter((p) => p.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('supervisors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'supervisors'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جدول زيارات الإشراف الأكاديمي ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduling')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'scheduling'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>تنسيق الجداول والقاعات</span>
        </button>
      </div>

      {/* Tab 1: Partner Schools View */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث باسم المدرسة، المشرف، العنوان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs text-slate-400 font-medium shrink-0">المرحلة:</span>
              {['all', 'ابتدائي', 'إعدادي', 'ثانوي', 'تجريبي لغات'].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedStage === stage
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {stage === 'all' ? 'الكل' : stage}
                </button>
              ))}
            </div>
          </div>

          {/* Schools List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 transition shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {school.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                        {school.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{school.address}</span>
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    نشطة ومفعلة
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                  <div>
                    <span className="text-[11px] text-slate-400 block">مدير المدرسة:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{school.principal}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">المعلم المرشد المقيم:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{school.mentorTeacher}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">المشرف الأكاديمي من الكلية:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{school.supervisor}</span>
                    </div>
                    <div className="text-left font-mono">
                      <span className="text-[11px] text-slate-400 block">الطلاب المسكنين:</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">
                        {school.assignedStudentsCount} / {school.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mr-3">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${(school.assignedStudentsCount / school.capacity) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setActionSuccessMessage(`تم فتح كشف طلاب ${school.name}`);
                      setTimeout(() => setActionSuccessMessage(null), 2500);
                    }}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 shrink-0"
                  >
                    <span>كشف الطلاب</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Approvals View */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <span>طلبات اعتماد خطط التدريس ونماذج التحضير</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              مراجعة الخطط التربوية المقدمة من الطلاب المتدربين قبل تطبيقها في المدارس
            </p>

            <div className="space-y-3">
              {pendingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {plan.studentName}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {plan.studentCode}
                        </span>
                        <span className="text-[11px] text-purple-600 font-medium">
                          ({plan.schoolName})
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
                        {plan.lessonTitle}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {plan.subject} • {plan.submittedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprovePlan(plan.id, plan.studentName)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                          >
                            اعتماد الخطة
                          </button>
                          <button
                            onClick={() => handleRejectPlan(plan.id, plan.studentName)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-bold transition border border-rose-200 dark:border-rose-800"
                          >
                            طلب تعديل
                          </button>
                        </>
                      ) : plan.status === 'approved' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>معتمدة</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>بانتظار تعديل الطالب</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Supervision Visits */}
      {activeTab === 'supervisors' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>جدول الزيارات الميدانية التوجيهية للأساتذة المشرفين</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              متابعة الزيارات الإشرافية الميدانية وتقييم استمارات الملاحظة الصفية
            </p>

            <div className="space-y-3">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {visit.supervisorName}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        {visit.schoolName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      محور التقييم: {visit.focus}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {visit.date} • {visit.time}
                      </span>
                      <span>•</span>
                      <span>عدد الطلاب المستهدفين بالتقييم: {visit.evaluatedStudents} طلاب</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActionSuccessMessage(`تم فتح استمارة تقييم زيارة ${visit.schoolName}`);
                      setTimeout(() => setActionSuccessMessage(null), 2500);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shrink-0"
                  >
                    استمارة التقييم الميداني
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Scheduling & Lecture Hall Coordination */}
      {activeTab === 'scheduling' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>تنسيق الجداول الدراسية وإشغال القاعات والمدرجات</span>
            </h2>
            <p className="text-xs text-slate-500">
              توزيع الشعب الدراسية على المدرجات المركزية ومعامل تكنولوجيا التعليم ومدرجات الكلية
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs text-slate-400 font-bold block mb-1">مدرج 1 (المدرج المركزي)</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">علم النفس التربوي (الفرقة 3)</span>
                <p className="text-xs text-purple-600 font-medium mt-1">الثلاثاء 10:00 ص — 12:00 م</p>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                  <span>السعة: 500 طالب</span>
                  <span className="text-emerald-600 font-bold">لا يوجد تعارض</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs text-slate-400 font-bold block mb-1">معمل تكنولوجيا التعليم 2</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">إنتاج الوسائط المتعددة (الفرقة 2)</span>
                <p className="text-xs text-purple-600 font-medium mt-1">الأربعاء 08:30 ص — 10:30 ص</p>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                  <span>السعة: 45 جهاز كمبيوتر</span>
                  <span className="text-emerald-600 font-bold">لا يوجد تعارض</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs text-slate-400 font-bold block mb-1">قاعة 204 (المناهج وطرق التدريس)</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">طرق تدريس اللغة العربية (الفرقة 4)</span>
                <p className="text-xs text-purple-600 font-medium mt-1">الخميس 12:30 م — 02:30 م</p>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                  <span>السعة: 120 مقعد</span>
                  <span className="text-emerald-600 font-bold">لا يوجد تعارض</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
