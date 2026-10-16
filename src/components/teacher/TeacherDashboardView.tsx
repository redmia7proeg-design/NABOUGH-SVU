import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Upload,
  Video,
  FileText,
  Plus,
  Megaphone,
  HelpCircle,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const TeacherDashboardView: React.FC = () => {
  const { currentUser, subjects, lectures, setCurrentTab } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureSubject, setLectureSubject] = useState('علم النفس التربوي');
  const [lectureRoom, setLectureRoom] = useState('قاعة 201');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleUploadLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle.trim()) return;

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setShowUploadModal(false);
      setLectureTitle('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>بوابة عضو هيئة التدريس — {currentUser.name}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة المقررات، رفع تسجيلات المحاضرات، اعتماد خطط التربية العملية، ونشر الإعلانات
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30"
        >
          <Upload className="w-4 h-4" />
          <span>رفع محاضرة / مادة علمية جديدة</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">الطلاب المسجلين بمقرراتك</span>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white font-mono">
            485
          </div>
          <span className="text-[11px] text-blue-600 font-bold mt-1 block">الفرقة الثالثة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">المحاضرات المرفوعة</span>
          <div className="mt-2 text-3xl font-black text-blue-600 font-mono">
            {lectures.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">فيديو وتسجيل صوتي</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">خطط دروس التربية العملية للمراجعة</span>
          <div className="mt-2 text-3xl font-black text-amber-500 font-mono">
            3
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">بانتظار اعتمادك</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
          <span className="text-xs text-slate-400 font-medium">نسبة تفاعل الطلاب مع المحاضرات</span>
          <div className="mt-2 text-3xl font-black text-emerald-600 font-mono">
            92%
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">تفاعل ممتاز 📈</span>
        </div>
      </div>

      {/* Teacher Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 text-right">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <span>نشر تنويه أو إعلان رسمي</span>
          </div>
          <p className="text-xs text-slate-500">
            أرسل إشعاراً فورياً لكافة طلاب شعبتك في كلية التربية مع علامة التوثيق الرسمية.
          </p>
          <button
            onClick={() => setCurrentTab('community')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            نشر إعلان في المجتمع
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 text-right">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <span>إضافة أسئلة لبنك الأسئلة</span>
          </div>
          <p className="text-xs text-slate-500">
            أضف أسئلة اختيار من متعدد وصح وخطأ مع تعزيزها بالشرح لتدريب طلابك قبل الاختبار.
          </p>
          <button
            onClick={() => setCurrentTab('question_bank')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            إدارة بنك الأسئلة
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 text-right">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>تقييم طلاب التربية العملية</span>
          </div>
          <p className="text-xs text-slate-500">
            رصد درجات الزيارات الميدانية والمشاهدات الصفية لطلاب مدارس المستقبل.
          </p>
          <button
            onClick={() => setCurrentTab('practical_training')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            استعراض ملفات التربية العملية
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">رفع محاضرة جديدة</h3>
            {successNotice ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">تم رفع المحاضرة ونشرها بنجاح!</h4>
                <p className="text-xs text-slate-400">تم إرسال إشعار فوري لجميع الطلاب المسجلين.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadLecture} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    عنوان المحاضرة
                  </label>
                  <input
                    type="text"
                    required
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    placeholder="مثال: المحاضرة 8: دافعية الإنجاز ونظرية العزو"
                    className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    المقرر الدراسي
                  </label>
                  <select
                    value={lectureSubject}
                    onChange={(e) => setLectureSubject(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    القاعة
                  </label>
                  <input
                    type="text"
                    value={lectureRoom}
                    onChange={(e) => setLectureRoom(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                  <span>اسحب ملف الفيديو أو التسجيل الصوتي أو مذكرة PDF هنا</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                  >
                    نشر المحاضرة للطلاب
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
