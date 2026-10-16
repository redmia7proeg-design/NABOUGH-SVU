import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Clock,
  Video,
  FileText,
  Calendar,
  ArrowRight,
  TrendingUp,
  Brain,
  Play,
  RotateCcw,
} from 'lucide-react';
import { LearningRoadmapVisualizer } from './LearningRoadmapVisualizer';

export const StudyCenterView: React.FC = () => {
  const {
    subjects,
    lectures,
    tasks,
    notes,
    libraryFiles,
    setActiveLecture,
    pomodoroSecondsLeft,
    setPomodoroSecondsLeft,
    isPomodoroRunning,
    setIsPomodoroRunning,
    openAiWithContext,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub_01');
  const [plannerGoal, setPlannerGoal] = useState('امتحان منتصف الفصل لمادة علم النفس التربوي');
  const [showPlannerModal, setShowPlannerModal] = useState(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectLectures = lectures.filter((l) => l.subjectId === currentSubject.id);
  const subjectTasks = tasks.filter((t) => t.subjectName === currentSubject.name);
  const subjectFiles = libraryFiles.filter((f) => f.subjectId === currentSubject.id);
  const subjectNotes = notes.filter((n) => n.subjectId === currentSubject.id);

  // Minutes and seconds for quick pomodoro
  const mins = Math.floor(pomodoroSecondsLeft / 60);
  const secs = pomodoroSecondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const generatedPlanDays = [
    { day: 'اليوم الأول (الأحد)', task: 'مراجعة وتفريغ المحاضرة 1 و 2 (المفاهيم والنظريات المعرفية)', pomodoros: 3 },
    { day: 'اليوم الثاني (الإثنين)', task: 'دراسة المحاضرة 3 و 4 وحل أسئلة بنك الأسئلة للمرحلة النمائية', pomodoros: 2 },
    { day: 'اليوم الثالث (الثلاثاء)', task: 'تلخيص بطاقات الفلاش كاردز واستراتيجيات تعديل السلوك', pomodoros: 3 },
    { day: 'اليوم الرابع (الأربعاء)', task: 'حل نماذج الامتحانات السابقة والمراجعة العامة الشاملة', pomodoros: 4 },
    { day: 'اليوم الخامس (الخميس)', task: 'مراجعة الملاحظات السريعة في الصباح وخوض الامتحان بثقة!', pomodoros: 1 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>مركز الدراسة والمذاكرة المتكامل</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            بيئة دراسية واحدة تجمع المؤقت، المحاضرات، المذكرات، والمهام دون الحاجة للتنقل بين الصفحات
          </p>
        </div>

        {/* Smart Study Planner Button */}
        <button
          onClick={() => setShowPlannerModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30 hover:opacity-95"
        >
          <Calendar className="w-4 h-4" />
          <span>المخطط الدراسي الذكي</span>
        </button>
      </div>

      {/* Select active study subject banner */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">المقرر الدراسي النشط للمذاكرة الآن:</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{currentSubject.name}</h2>
          </div>
        </div>

        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.instructor})
            </option>
          ))}
        </select>
      </div>

      {/* Interactive Learning Path & Exam Runway Visualization */}
      <LearningRoadmapVisualizer
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={setSelectedSubjectId}
      />

      {/* Grid: 3 Columns Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Integrated Pomodoro & Tasks (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Focus Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center">
            <div className="flex items-center justify-between text-xs font-bold text-amber-600 mb-2">
              <span>جلسة تركيز سريعة</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-4xl font-black font-mono text-slate-900 dark:text-white my-3">
              {timeFormatted}
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                className={`py-2 px-6 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isPomodoroRunning
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isPomodoroRunning ? 'إيقاف مؤقت' : 'بدء المذاكرة'}
              </button>
              <button
                onClick={() => {
                  setIsPomodoroRunning(false);
                  setPomodoroSecondsLeft(25 * 60);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>مهام المادة</span>
              <span className="text-xs text-slate-400">{subjectTasks.length} مهام</span>
            </h3>
            <div className="space-y-2">
              {subjectTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">لا توجد مهام حالية لهذه المادة</p>
              ) : (
                subjectTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-right text-xs border border-slate-100 dark:border-slate-800"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">{t.title}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">{t.deadline}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Col 2: Lectures & Files for this subject (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Lectures */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>محاضرات وتسجيلات المقرر</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">{subjectLectures.length} محاضرات</span>
            </h3>

            <div className="space-y-2.5">
              {subjectLectures.map((lec) => (
                <div
                  key={lec.id}
                  onClick={() => setActiveLecture(lec)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm group-hover:scale-105 transition">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div className="flex-1 pr-3 text-right">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">
                      {lec.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {lec.duration} • قاعة {lec.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Files */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">ملخصات ومذكرات المادة</h3>
            <div className="space-y-2">
              {subjectFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border border-slate-100 dark:border-slate-800 text-right"
                >
                  <button
                    onClick={() =>
                      openAiWithContext(
                        currentSubject.name,
                        `لخص النقاط المهمة في ملف (${file.title}).`
                      )
                    }
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 text-xs font-bold"
                    title="تلخيص ذكي"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 pr-3">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{file.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Subject Notes & Quick AI Assistant (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">ملاحظاتي في المادة</h3>
            <div className="space-y-2">
              {subjectNotes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">لا توجد ملاحظات مسجلة بعد</p>
              ) : (
                subjectNotes.map((n) => (
                  <div key={n.id} className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-right text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200">{n.title}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-3">
                      {n.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick AI Question Box */}
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-5 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h4 className="text-sm font-bold">مساعد المذاكرة AI</h4>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              هل واجهت فقرة أو نظرية غير مفهومة في مقرر {currentSubject.name}؟
            </p>
            <button
              onClick={() =>
                openAiWithContext(
                  currentSubject.name,
                  `اشرح لي أهم النظريات وتطبيقاتها في مادة ${currentSubject.name} بأسلوب مبسط مدعم بأمثلة صفية.`
                )
              }
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>طلب شرح أو ملخص الآن</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Study Planner Modal */}
      {showPlannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowPlannerModal(false)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                إغلاق
              </button>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>المخطط الدراسي الذكي — خطة الـ 5 أيام</span>
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              تم توليد جدول مراجعة ذكي وموزع لمقرر ({currentSubject.name}) لضمان تغطية كامل المنهج دون إجهاد، بالتكامل مع جلسات Pomodoro وبنك الأسئلة:
            </div>

            <div className="space-y-3">
              {generatedPlanDays.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-right"
                >
                  <span className="px-2.5 py-1 rounded-xl bg-blue-600/10 text-blue-600 text-xs font-bold shrink-0">
                    {item.pomodoros} جلسات
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.day}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                alert('تمت إضافة خطة المراجعة بنجاح إلى جدولك الأكاديمي وقائمة المهام!');
                setShowPlannerModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              اعتماد الخطة وإضافتها إلى مهام اليوم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
