import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Play,
  Pause,
  BookOpen,
  FileText,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Brain,
  Globe,
  Sprout,
  Video,
  FileSpreadsheet,
  Megaphone,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  School,
  ExternalLink,
  Crown,
  Send,
  Radio,
  FileUp,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentTab,
    subjects,
    lectures,
    tasks,
    setActiveLecture,
    pomodoroSecondsLeft,
    setPomodoroSecondsLeft,
    isPomodoroRunning,
    setIsPomodoroRunning,
    openAiWithContext,
    groupAnnouncements,
    addGroupAnnouncement,
  } = useApp();

  const [activeDateIndex, setActiveDateIndex] = useState(3); // Tuesday 23
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announceScope, setAnnounceScope] = useState(currentUser.studentPositionDetails?.scope || 'شعبة 2 — الفرقة الثالثة');
  const [announceUrgent, setAnnounceUrgent] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSubject, setUploadFileSubject] = useState('علم النفس التربوي');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Format pomodoro seconds
  const minutes = Math.floor(pomodoroSecondsLeft / 60);
  const seconds = pomodoroSecondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomodoroSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (pomodoroSecondsLeft === 0 && isPomodoroRunning) {
      setIsPomodoroRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroSecondsLeft, setPomodoroSecondsLeft, setIsPomodoroRunning]);

  const handleOpenNextLecture = () => {
    const nextLec = lectures.find((l) => l.id === 'lec_01') || lectures[0];
    if (nextLec) {
      setActiveLecture(nextLec);
    }
  };

  const daysStrip = [
    { name: 'السبت', number: '20' },
    { name: 'الأحد', number: '21' },
    { name: 'الإثنين', number: '22' },
    { name: 'الثلاثاء', number: '23' },
    { name: 'الأربعاء', number: '24' },
    { name: 'الخميس', number: '25' },
    { name: 'الجمعة', number: '26' },
  ];

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Sprout':
      default:
        return <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const remainingTasksCount = tasks.length - completedTasksCount;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Hero Banner matching screenshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 p-6 lg:p-8 text-white shadow-xl">
        {/* Subtle decorative campus background illustration */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80')`,
          }}
        />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">👋</span>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                صباح الخير، {currentUser.name}
              </h1>
            </div>
            <p className="mt-1.5 text-xs lg:text-sm text-blue-100/90 font-medium">
              الثلاثاء، 23 سبتمبر 2025
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-100">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                {currentUser.level}
              </span>
              <span className="text-blue-300">•</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                {currentUser.department}
              </span>
              <span className="text-blue-300">•</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                {currentUser.specialization}
              </span>
              {currentUser.studentPositionDetails ? (
                <>
                  <span className="text-blue-300">•</span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 flex items-center gap-1.5 shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{currentUser.studentPositionDetails.title} ({currentUser.studentPositionDetails.scope})</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-blue-300">•</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15">
                    طالب منتظم
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick AI Action button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAiWithContext('علم النفس التربوي', 'ما هي أهم المفاهيم التي يجب مراجعتها اليوم؟')}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>اسأل نبوغ AI عن محاضرة اليوم</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1.5 Dedicated Student Leader / Coordinator Toolkit */}
      {currentUser.studentPosition && currentUser.studentPosition !== 'normal' && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-purple-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-purple-950/30 rounded-3xl p-5 border border-amber-500/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    صندوق أدوات {currentUser.studentPositionDetails?.title || 'ليدر الشعبة'}
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                    صلاحيات ممثل الدفعة
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  النطاق المصرح لك به: <strong className="text-slate-700 dark:text-slate-200">{currentUser.studentPositionDetails?.scope}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAnnounceModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-amber-600/25 active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>نشر تنبيه أو إعلان للشعبة</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-600/25 active:scale-95"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>رفع مذكرات وتسجيلات</span>
              </button>

              <button
                onClick={() => setCurrentTab('schedule')}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>جدول الشعبة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1.6 Group & Batch Announcements Feed */}
      {groupAnnouncements.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                تنبيهات وإعلانات الشعبة والفرقة
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              نشرها ممثلو الدفعة والليدر
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`p-3.5 rounded-2xl border transition ${
                  ann.isUrgent
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                        عاجل ومهم
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ann.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">{ann.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>{ann.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({ann.scope})</span>
                  </span>
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold">
                    معتمد رسمياً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Four Quick Action Cards in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Next Lecture (الجدول القادم) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">الجدول القادم</span>
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              علم النفس التربوي
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              د. أحمد رمضان • 10:00 ص
            </p>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              قاعة 201
            </p>
          </div>
          <button
            onClick={handleOpenNextLecture}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-purple-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>عرض المحاضرة</span>
          </button>
        </div>

        {/* Card 2: Today's Tasks (مهام اليوم) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">مهام اليوم</span>
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              {remainingTasksCount} مهام متبقية
            </h3>
            <div className="mt-3 space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasksCount / (tasks.length || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>التقدم</span>
                <span>{completedTasksCount} / {tasks.length}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('tasks')}
            className="mt-4 w-full py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>عرض المهام</span>
          </button>
        </div>

        {/* Card 3: Pomodoro Focus Session (جلسة التركيز) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">جلسة التركيز</span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pomodoro</p>
            <div className="mt-2 text-2xl lg:text-3xl font-black tracking-wider text-amber-600 dark:text-amber-400 font-mono">
              {timeFormatted}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">مادة: علم النفس التربوي</p>
          </div>
          <button
            onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
            className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
              isPomodoroRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
            }`}
          >
            {isPomodoroRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPomodoroRunning ? 'إيقاف مؤقت' : 'ابدأ التركيز'}</span>
          </button>
        </div>

        {/* Card 4: Upcoming Exams (الامتحانات القادمة) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">الامتحانات القادمة</span>
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              علم النفس التربوي
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              الخميس، 2 أكتوبر 2025
            </p>
            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              10 أيام متبقية
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('exams')}
            className="mt-4 w-full py-2 px-3 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>عرض كل الامتحانات</span>
          </button>
        </div>
      </div>

      {/* 3. Middle Two-Column Grid: My Subjects & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: My Subjects (موادي) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 text-lg">🎓</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">موادي</h3>
            </div>
            <button
              onClick={() => setCurrentTab('lectures')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            {subjects.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                onClick={() => setCurrentTab('lectures')}
                className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                    {sub.progress}%
                  </span>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{sub.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{sub.instructor}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                      {getSubjectIcon(sub.iconName)}
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${sub.progress}%`,
                      backgroundColor: sub.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Recent Updates (آخر التحديثات) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">آخر التحديثات</h3>
            </div>
            <button
              onClick={() => setCurrentTab('community')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">
            {/* Update 1 */}
            <div
              onClick={() => setCurrentTab('lectures')}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-right border border-slate-100 dark:border-slate-800"
            >
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Video className="w-4 h-4" />
              </div>
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تم رفع محاضرة جديدة لمادة طرق التدريس
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">منذ 12 دقيقة</span>
              </div>
            </div>

            {/* Update 2 */}
            <div
              onClick={() => setCurrentTab('library')}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-right border border-slate-100 dark:border-slate-800"
            >
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تم إضافة ملف جديد في مادة علم النفس التربوي
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">منذ 45 دقيقة</span>
              </div>
            </div>

            {/* Update 3 */}
            <div
              onClick={() => setCurrentTab('community')}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-right border border-slate-100 dark:border-slate-800"
            >
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  إعلان من إدارة الكلية: تعديل في موعد الامتحانات
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">منذ ساعتين</span>
              </div>
            </div>

            {/* Update 4 */}
            <div
              onClick={() => setCurrentTab('community')}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-right border border-slate-100 dark:border-slate-800"
            >
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 pr-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  رسالة جديدة في مجموعة الفرقة الثالثة
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">منذ 3 ساعات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Tools (أدوات سريعة) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>أدوات سريعة</span>
          <span className="text-xs text-slate-400">📌</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setCurrentTab('schedule')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition flex flex-col items-center justify-center gap-2 text-center group"
          >
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">الجدول الدراسي</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition flex flex-col items-center justify-center gap-2 text-center group"
          >
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">المكتبة</span>
          </button>

          <button
            onClick={() => setCurrentTab('notes')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition flex flex-col items-center justify-center gap-2 text-center group"
          >
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">الملاحظات</span>
          </button>

          <button
            onClick={() => setCurrentTab('tasks')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition flex flex-col items-center justify-center gap-2 text-center group"
          >
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">المهام</span>
          </button>
        </div>
      </div>

      {/* 5. Progress This Week & Quick Timetable Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Card (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>تقدمك هذا الأسبوع</span>
            </h3>
            <button
              onClick={() => setCurrentTab('academic_profile')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              عرض التفاصيل
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Circular Progress Meter */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="68, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-black text-slate-900 dark:text-white">68%</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-2">إجمالي التقدم</span>
            </div>

            {/* Metric Blocks */}
            <div className="flex-1 grid grid-cols-3 gap-3 w-full">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">8:35</span>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">وقت المذاكرة</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">3</span>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Pomodoro</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">5 / 8</span>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">المهام المكتملة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Card (4 cols) matching screenshot */}
        <div className="lg:col-span-4 relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="relative z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm">
              إلهام تربوي
            </span>
          </div>
          <div className="relative z-10 mt-6">
            <p className="text-base font-bold leading-relaxed">
              كل خطوة صغيرة تقربك من هدفك 🌿
            </p>
            <p className="text-[11px] text-slate-300 mt-1">معلم المستقبل يبدأ شغفه من اليوم</p>
          </div>
        </div>
      </div>

      {/* 6. Quick Timetable Day Strip (المخطط السريع) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">المخطط السريع</h3>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysStrip.map((day, idx) => {
            const isActive = idx === activeDateIndex;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveDateIndex(idx);
                  setCurrentTab('schedule');
                }}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition border ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[11px] font-medium">{day.name}</span>
                <span className="text-sm font-bold mt-1 font-mono">{day.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal: Publish Announcement (Leader / Coordinator) */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    نشر تنبيه أو إعلان للمجموعة
                  </h3>
                  <p className="text-xs text-slate-400">
                    بصفتك: {currentUser.studentPositionDetails?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnnounceModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  عنوان التنبيه
                </label>
                <input
                  type="text"
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  placeholder="مثال: تبكير موعد محاضرة علم النفس غداً"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نطاق الإعلان
                </label>
                <input
                  type="text"
                  value={announceScope}
                  onChange={(e) => setAnnounceScope(e.target.value)}
                  placeholder="مثال: الفرقة الثالثة — شعبة علم النفس"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نص التنبيه والتفاصيل
                </label>
                <textarea
                  rows={4}
                  value={announceContent}
                  onChange={(e) => setAnnounceContent(e.target.value)}
                  placeholder="اكتب التنبيه هنا بوضوح لزملائك في الشعبة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={announceUrgent}
                  onChange={(e) => setAnnounceUrgent(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="urgentCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                  <span>تمييز كـ إعلان عاجل ومهم</span>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAnnounceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!announceTitle.trim() || !announceContent.trim()) {
                    alert('يرجى كتابة عنوان وتفاصيل التنبيه');
                    return;
                  }
                  addGroupAnnouncement({
                    title: announceTitle.trim(),
                    content: announceContent.trim(),
                    authorName: currentUser.name,
                    authorRole: currentUser.role,
                    authorPosition: currentUser.studentPosition,
                    scope: announceScope.trim() || 'الشعبة',
                    isUrgent: announceUrgent,
                  });
                  setToastMessage('تم نشر التنبيه وإرساله بنجاح لجميع طلاب المجموعة 📢');
                  setIsAnnounceModalOpen(false);
                  setAnnounceTitle('');
                  setAnnounceContent('');
                  setAnnounceUrgent(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>نشر التنبيه الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Group Files (Leader / Coordinator) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    رفع مذكرات وتسجيلات للشعبة
                  </h3>
                  <p className="text-xs text-slate-400">
                    ميزة خاصة بـ {currentUser.studentPositionDetails?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  اسم الملف / المذكرة
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="مثال: تفريغ المحاضرة الرابعة — نظريات التعلم"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المقرر الدراسي
                </label>
                <select
                  value={uploadFileSubject}
                  onChange={(e) => setUploadFileSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-purple-500 transition cursor-pointer">
                <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسحب وأفلت ملف الـ PDF أو التسجيل الصوتي هنا
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  يدعم صيغ PDF, MP3, M4A, DOCX حتى 50 ميجابايت
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!uploadFileName.trim()) {
                    alert('يرجى إدخال اسم المذكرة أو الملف');
                    return;
                  }
                  setToastMessage(`تم رفع الملف (${uploadFileName}) بنجاح ومشاركته مع شعبتك 📁`);
                  setIsUploadModalOpen(false);
                  setUploadFileName('');
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>تأكيد الرفع والمشاركة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
