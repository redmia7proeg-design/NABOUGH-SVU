import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, Exam, Lecture } from '../../types';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Play,
  Brain,
  Zap,
  Flame,
  AlertCircle,
  GraduationCap,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  type: 'foundation' | 'core_lectures' | 'midterm_exam' | 'practice_bank' | 'revision' | 'final_exam';
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  dateOrCountdown?: string;
  iconType: 'check' | 'lecture' | 'exam' | 'practice' | 'summary' | 'trophy';
  details: {
    description: string;
    topicsCount: number;
    recommendedHours: number;
    actionLabel: string;
    actionPrompt?: string;
  };
}

interface LearningRoadmapVisualizerProps {
  selectedSubjectId: string;
  onSelectSubject?: (subjectId: string) => void;
}

export const LearningRoadmapVisualizer: React.FC<LearningRoadmapVisualizerProps> = ({
  selectedSubjectId,
  onSelectSubject,
}) => {
  const {
    subjects,
    exams,
    lectures,
    tasks,
    setActiveLecture,
    setPomodoroSecondsLeft,
    setIsPomodoroRunning,
    openAiWithContext,
  } = useApp();

  const [viewMode, setViewMode] = useState<'subject_path' | 'exam_timeline'>('subject_path');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Active Subject
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  }, [subjects, selectedSubjectId]);

  // Subject Exams
  const subjectExams = useMemo(() => {
    return exams.filter((e) => e.subjectId === currentSubject.id || e.subjectName === currentSubject.name);
  }, [exams, currentSubject]);

  // Sorted upcoming exams across all subjects
  const allUpcomingExams = useMemo(() => {
    return [...exams].sort((a, b) => (a.remainingDays ?? 99) - (b.remainingDays ?? 99));
  }, [exams]);

  // Nearest exam for current subject
  const nearestSubjectExam = useMemo(() => {
    return [...subjectExams].sort((a, b) => (a.remainingDays ?? 99) - (b.remainingDays ?? 99))[0];
  }, [subjectExams]);

  // Subject lectures
  const currentLectures = useMemo(() => {
    return lectures.filter((l) => l.subjectId === currentSubject.id);
  }, [lectures, currentSubject]);

  // Calculated overall readiness score
  const readinessMetrics = useMemo(() => {
    const lectureRate = currentSubject.totalLectures > 0
      ? (currentSubject.completedLectures / currentSubject.totalLectures) * 100
      : currentSubject.progress || 60;

    const subjectTasks = tasks.filter((t) => t.subjectName === currentSubject.name);
    const completedTasks = subjectTasks.filter((t) => t.completed).length;
    const taskRate = subjectTasks.length > 0 ? (completedTasks / subjectTasks.length) * 100 : 70;

    const readinessIndex = Math.min(100, Math.round(lectureRate * 0.65 + taskRate * 0.35));

    let statusText = 'جاهزية ممتازة 🏆';
    let statusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    let urgencyBadge = 'جاهز للاختبار';

    if (readinessIndex < 45) {
      statusText = 'استدراك مكثف مطلوب 🚨';
      statusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      urgencyBadge = 'حالة استنفار';
    } else if (readinessIndex < 70) {
      statusText = 'مستوى متزن قيد الإنجاز ⚡';
      statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      urgencyBadge = 'قيد التقدم';
    }

    return {
      score: readinessIndex,
      statusText,
      statusColor,
      urgencyBadge,
      lectureRate: Math.round(lectureRate),
    };
  }, [currentSubject, tasks]);

  // Construct Roadmap Milestones for Subject Journey
  const milestones: Milestone[] = useMemo(() => {
    const progress = currentSubject.progress || 50;

    return [
      {
        id: 'm_01',
        title: 'المحطة 1: التأسيس والمفاهيم الأولية',
        subtitle: 'المحاضرات 1 إلى 3 • استيعاب النظريات ومدخل المنهج',
        type: 'foundation',
        status: 'completed',
        progress: 100,
        iconType: 'check',
        details: {
          description: 'تم الانتهاء من استيعاب المفاهيم التأسيسية، المصطلحات، وتلخيص الإطار النظري للمقرر بنجاح.',
          topicsCount: 4,
          recommendedHours: 5,
          actionLabel: 'مراجعة الملخصات التأسيسية',
          actionPrompt: `أريد مراجعة سريعة للمفاهيم الأساسية في بداية مقرر ${currentSubject.name}.`,
        },
      },
      {
        id: 'm_02',
        title: 'المحطة 2: التطبيقات الميدانية والتعمق',
        subtitle: 'المحاضرات 4 إلى 7 • الربط بالبيئة الصفية وأمثلة واقعية',
        type: 'core_lectures',
        status: progress >= 60 ? 'completed' : 'in_progress',
        progress: progress >= 60 ? 100 : Math.min(95, Math.round(progress * 1.3)),
        iconType: 'lecture',
        details: {
          description: 'التركيز على الجوانب العملية والتربوية، دراسة الحالات، وتحليل مواقف التدريس الفعلي.',
          topicsCount: 5,
          recommendedHours: 8,
          actionLabel: 'متابعة المحاضرة الميدانية',
          actionPrompt: `اشرح لي أهم التطبيقات العملية الخاصة بمقرر ${currentSubject.name}.`,
        },
      },
      {
        id: 'm_03',
        title: 'المحطة 3: امتحان منتصف الفصل (Midterm)',
        subtitle: nearestSubjectExam
          ? `${nearestSubjectExam.dayArabic} ${nearestSubjectExam.date} • باقي ${nearestSubjectExam.remainingDays} يوم`
          : 'اختبار قياس الاستيعاب النظري والتطبيقي',
        type: 'midterm_exam',
        status: progress >= 75 ? 'completed' : progress >= 40 ? 'in_progress' : 'upcoming',
        progress: nearestSubjectExam ? (nearestSubjectExam.score ? 100 : 65) : 50,
        dateOrCountdown: nearestSubjectExam ? `باقي ${nearestSubjectExam.remainingDays} يوم` : 'خلال أسبوعين',
        iconType: 'exam',
        details: {
          description: 'نقطة تقييم شاملة لما تم دراسته حتى الآن، تغطي 40% من درجات أعمال السنة والاختبارات الدورية.',
          topicsCount: 6,
          recommendedHours: 12,
          actionLabel: 'خطة مراجعة الميدتيرم',
          actionPrompt: `ضع لي خطة مراجعة ذكية لمدة 3 أيام لامتحان الميدتيرم لمادة ${currentSubject.name}.`,
        },
      },
      {
        id: 'm_04',
        title: 'المحطة 4: بنك الأسئلة والتدريب التفاعلي',
        subtitle: 'حل 80+ سؤال MCQ ومواقف صفية واختبارات تجريبية',
        type: 'practice_bank',
        status: progress >= 80 ? 'completed' : progress >= 60 ? 'in_progress' : 'upcoming',
        progress: progress >= 80 ? 100 : 45,
        iconType: 'practice',
        details: {
          description: 'تدريب تطبيقي مكثف على أنماط أسئلة الامتحانات السابقة، التعليل التربوي، وحساب زمن الإجابة.',
          topicsCount: 8,
          recommendedHours: 10,
          actionLabel: 'بدء اختبار تجريبي',
          actionPrompt: `أنشئ لي 5 أسئلة اختيار من متعدد على نمط امتحانات كلية التربية في مادة ${currentSubject.name}.`,
        },
      },
      {
        id: 'm_05',
        title: 'المحطة 5: المراجعة الختامية والامتحان النهائي',
        subtitle: 'المحطة الكبرى • اعتماد التقدير التراكمي وخاتمة المقرر',
        type: 'final_exam',
        status: 'upcoming',
        progress: 20,
        dateOrCountdown: 'باقي 51 يوم',
        iconType: 'trophy',
        details: {
          description: 'الهدف الأسمى للمسار الأكاديمي، خوض الاختبار النهائي وتحقيق التقدير المستهدف (امتياز مع مرتبة الشرف).',
          topicsCount: 12,
          recommendedHours: 20,
          actionLabel: 'مخطط المراجعة الشاملة',
          actionPrompt: `أريد جدول مكثف لمراجعة المنهج كاملاً قبل الامتحان النهائي لمادة ${currentSubject.name}.`,
        },
      },
    ];
  }, [currentSubject, nearestSubjectExam]);

  const handleLaunchPomodoroForMilestone = (m: Milestone) => {
    setIsPomodoroRunning(false);
    setPomodoroSecondsLeft(30 * 60);
    setIsPomodoroRunning(true);
    setSelectedMilestone(null);
  };

  const handleOpenLectureForMilestone = () => {
    if (currentLectures.length > 0) {
      setActiveLecture(currentLectures[0]);
    }
    setSelectedMilestone(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md overflow-hidden transition-all text-right font-['Cairo',sans-serif]">
      {/* Top Banner & Mode Toggle */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white relative">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[11px] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>مسار التعلم التفاعلي الذكي</span>
              </span>
              <span className="text-xs text-purple-200/80">Roadmap & Exam Runway</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>خريطة الاستعداد الأكاديمي والامتحانات</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>
            <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
              تتبع محطات التعلم، رصد جاهزيتك للامتحانات القادمة، وتحويل المنهج إلى خطوات إنجاز واقعية
            </p>
          </div>

          {/* Readiness Index & Expand / Collapse */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Readiness Gauge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center gap-3">
              <div className="text-center">
                <span className="text-[10px] text-purple-200 block">مؤشر الجاهزية</span>
                <span className="text-xl font-black text-amber-300 font-mono">
                  %{readinessMetrics.score}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/50 flex items-center justify-center text-amber-300">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
              title={isExpanded ? 'طي الخريطة' : 'توسيع الخريطة'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        {isExpanded && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('subject_path')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'subject_path'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>مسار مقرر ({currentSubject.name})</span>
              </button>

              <button
                onClick={() => setViewMode('exam_timeline')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'exam_timeline'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>مدرج العد التنازلي للامتحانات ({allUpcomingExams.length})</span>
              </button>
            </div>

            {/* Quick Subject Switcher for roadmap */}
            {onSelectSubject && subjects.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                <span className="text-[11px] text-purple-200 ml-1 shrink-0">المقرر:</span>
                {subjects.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectSubject(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 truncate max-w-[130px] ${
                      s.id === currentSubject.id
                        ? 'bg-white text-indigo-950 font-black'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsed view summary */}
      {!isExpanded && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              المقرر: {currentSubject.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              جاهزية الامتحان: %{readinessMetrics.score} ({readinessMetrics.statusText})
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            عرض الخريطة الكاملة
          </button>
        </div>
      )}

      {/* Expanded Interactive Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Readiness Alert Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block">إنجاز المحاضرات</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentSubject.completedLectures} من أصل {currentSubject.totalLectures} محاضرة ({readinessMetrics.lectureRate}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block">أقرب امتحان رسمي</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {nearestSubjectExam
                    ? `${nearestSubjectExam.type === 'midterm' ? 'ميدتيرم' : 'نهائي'} • بعد ${nearestSubjectExam.remainingDays} يوم`
                    : 'لا توجد اختبارات مجدولة قريباً'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block">تقييم الجاهزية</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {readinessMetrics.statusText}
                </span>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: SUBJECT MILESTONE ROADMAP */}
          {viewMode === 'subject_path' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>انقر على أي محطة دراسية لفتح خيارات المذاكرة والتدريب:</span>
                </span>
                <span className="text-[11px] font-mono">5 محطات رئيسية</span>
              </div>

              {/* Horizontal Scrollable Interactive Journey Track */}
              <div className="relative overflow-x-auto pb-4 pt-2">
                <div className="min-w-[760px] flex items-center justify-between relative px-4">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-1.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full z-0">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(15, currentSubject.progress || 50)}%` }}
                    />
                  </div>

                  {/* Milestones Nodes */}
                  {milestones.map((m, idx) => {
                    const isSelected = selectedMilestone?.id === m.id;
                    const isCompleted = m.status === 'completed';
                    const isInProgress = m.status === 'in_progress';

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMilestone(m)}
                        className="relative z-10 flex flex-col items-center cursor-pointer group"
                        style={{ width: '135px' }}
                      >
                        {/* Node Bubble */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                            isSelected
                              ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-slate-900 scale-110'
                              : 'hover:scale-105'
                          } ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                              : isInProgress
                              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/30 animate-pulse'
                              : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : m.iconType === 'exam' ? (
                            <Clock className="w-6 h-6 text-amber-300" />
                          ) : m.iconType === 'trophy' ? (
                            <Trophy className="w-6 h-6 text-amber-400" />
                          ) : m.iconType === 'practice' ? (
                            <HelpCircle className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </div>

                        {/* Node Countdown or Badge */}
                        {m.dateOrCountdown && (
                          <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                            {m.dateOrCountdown}
                          </span>
                        )}

                        {/* Title */}
                        <span className={`text-[11px] font-bold text-center mt-2 line-clamp-2 leading-tight ${
                          isInProgress
                            ? 'text-purple-600 dark:text-purple-400 font-black'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {m.title}
                        </span>

                        {/* Status Label */}
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {isCompleted ? '✓ تم إنجازها' : isInProgress ? '● قيد المذاكرة' : 'مستقبلية'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Milestone Interactive Drawer */}
              {selectedMilestone && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-purple-200 dark:border-purple-800/60 shadow-sm animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold">
                          المحطة المختارة
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedMilestone.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                        {selectedMilestone.details.description}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span>المواضيع المستهدفة: {selectedMilestone.details.topicsCount} موضوعات</span>
                        <span>•</span>
                        <span>الوقت الموصى به: {selectedMilestone.details.recommendedHours} ساعات</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={handleOpenLectureForMilestone}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-600/25"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>فتح المحاضرة الآن</span>
                      </button>

                      <button
                        onClick={() => handleLaunchPomodoroForMilestone(selectedMilestone)}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>بدء Pomodoro (30 دقيقة)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (selectedMilestone.details.actionPrompt) {
                            openAiWithContext(currentSubject.name, selectedMilestone.details.actionPrompt);
                          }
                          setSelectedMilestone(null);
                        }}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>استشارة المساعد AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: EXAM TIMELINE RUNWAY */}
          {viewMode === 'exam_timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>مدرج الامتحانات القادمة مرتبة زمنياً حسب موعد الانعقاد:</span>
                </span>
                <span className="text-[11px] font-mono">{allUpcomingExams.length} امتحانات مجدولة</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {allUpcomingExams.map((ex) => {
                  const isCurrentCourse = ex.subjectId === currentSubject.id || ex.subjectName === currentSubject.name;
                  const isUrgent = (ex.remainingDays ?? 99) <= 15;

                  return (
                    <div
                      key={ex.id}
                      className={`p-4 rounded-2xl border transition-all text-right relative overflow-hidden ${
                        isCurrentCourse
                          ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-sm ring-2 ring-purple-500/20'
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          ex.type === 'midterm'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}>
                          {ex.type === 'midterm' ? 'اختبار منتصف الفصل' : 'الامتحان النهائي'}
                        </span>

                        <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                          isUrgent
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          باقي {ex.remainingDays} يوم
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {ex.subjectName}
                      </h4>

                      <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                        <div className="flex items-center justify-between">
                          <span>الموعد:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {ex.dayArabic} {ex.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>التوقيت والقاعة:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {ex.time} ({ex.room})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>الدرجة العظمى:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                            {ex.maxScore} درجة
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => {
                            if (onSelectSubject && ex.subjectId) {
                              onSelectSubject(ex.subjectId);
                            }
                            openAiWithContext(
                              ex.subjectName,
                              `أريد خطة مراجعة مركزة لاختبار (${ex.type === 'midterm' ? 'الميدتيرم' : 'النهائي'}) لمادة ${ex.subjectName}، مع التركيز على أهم الأسئلة المتوقعة.`
                            );
                          }}
                          className="w-full py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>توليد خطة مراجعة لهذا الامتحان</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
