import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { setCurrentTab, openAiWithContext, exams } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <span>مركز الامتحانات والجداول الرسمية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مواعيد اختبارات منتصف ونهاية الفصل الدراسي، أرقام الجلوس، والقاعات المعتمدة
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('question_bank')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30"
        >
          <HelpCircle className="w-4 h-4" />
          <span>التدرب في بنك الأسئلة</span>
        </button>
      </div>

      {/* Official Guidelines Notice */}
      <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-right text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm mb-1">تعليمات الامتحانات المعتمدة من عمادة الكلية:</h4>
          <p>• الحضور إلى مقر لجنة الاختبار قبل الموعد بنصف ساعة على الأقل.</p>
          <p>• الالتزام بإحضار إثبات الشخصية الجامعي (الكارنيه أو إيصال السداد).</p>
          <p>• يمنع تماماً اصطحاب الهواتف الذكية أو الساعات الإلكترونية داخل لجان الاختبار.</p>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">لا توجد اختبارات مجدولة حالياً</p>
            <p className="text-xs text-slate-500 mt-1">سيتم إدراج مواعيد الامتحانات فور اعتمادها رسمياً من عمادة الكلية</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between text-right"
            >
              <div>
                {/* Countdown Banner */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    {exam.remainingDays ? `${exam.remainingDays} أيام متبقية ⏳` : 'مجدول'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {exam.type === 'final' ? 'اختبار نهائي' : 'اختبار نصفي (Midterm)'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {exam.subjectName}
                </h3>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{exam.dayArabic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{exam.room}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() =>
                  openAiWithContext(
                    exam.subjectName,
                    `أنشئ خطة مراجعة مكثفة سريعة لامتحان مادة ${exam.subjectName} المتبقي عليه ${exam.remainingDays} أيام.`
                  )
                }
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>خطة مراجعة ذكية</span>
              </button>

              <button
                onClick={() => setCurrentTab('library')}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition"
                title="نماذج الامتحانات السابقة"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
