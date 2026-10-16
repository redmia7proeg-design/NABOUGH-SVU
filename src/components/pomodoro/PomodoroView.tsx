import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  BarChart2,
  Coffee,
  Brain,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PomodoroView: React.FC = () => {
  const {
    subjects,
    pomodoroSecondsLeft,
    setPomodoroSecondsLeft,
    isPomodoroRunning,
    setIsPomodoroRunning,
    pomodoroSubject,
    setPomodoroSubject,
    pomodoroPreset,
    setPomodoroPreset,
    completedPomodoros,
    setCompletedPomodoros,
  } = useApp();

  const [ambientSound, setAmbientSound] = useState<string>('none');
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');

  const presets = [15, 25, 45, 60];

  const handleSelectPreset = (mins: number) => {
    setPomodoroPreset(mins);
    setPomodoroSecondsLeft(mins * 60);
    setIsPomodoroRunning(false);
    setSessionType('work');
  };

  const handleReset = () => {
    setIsPomodoroRunning(false);
    setPomodoroSecondsLeft(pomodoroPreset * 60);
  };

  const handleSessionComplete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setCompletedPomodoros((prev) => prev + 1);
    setIsPomodoroRunning(false);
    if (sessionType === 'work') {
      alert('ممتاز! أنهيت جلسة التركيز بنجاح. خذ استراحة قصيرة لمدة 5 دقائق.');
      setSessionType('break');
      setPomodoroSecondsLeft(5 * 60);
    } else {
      setSessionType('work');
      setPomodoroSecondsLeft(pomodoroPreset * 60);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomodoroSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroSecondsLeft]);

  const minutes = Math.floor(pomodoroSecondsLeft / 60);
  const seconds = pomodoroSecondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = (sessionType === 'work' ? pomodoroPreset : 5) * 60;
  const progressPercent = ((totalSeconds - pomodoroSecondsLeft) / totalSeconds) * 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-amber-500" />
            <span>جلسات التركيز — مؤقت Pomodoro</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            زد من إنتاجيتك الدراسية بتقنية بومودورو مع تتبع الوقت وأصوات الاسترخاء المساعدة على التركيز
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <CheckCircle2 className="w-4 h-4" />
          <span>{completedPomodoros} جلسات مكتملة اليوم</span>
        </div>
      </div>

      {/* Main Focus Console */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Tag */}
        <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-6">
          {sessionType === 'work' ? 'جلسة مذاكرة وتركيز عميق' : 'استراحة مستحقة ☕'}
        </span>

        {/* Circular Display */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="none"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-amber-500 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-medium">
              المقرر: {pomodoroSubject}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-black transition flex items-center gap-2 shadow-lg active:scale-95 ${
              isPomodoroRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
            }`}
          >
            {isPomodoroRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPomodoroRunning ? 'إيقاف مؤقت' : 'بدء الجلسة'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="إعادة تعيين المؤقت"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Row */}
        <div className="mt-8 flex items-center gap-2">
          {presets.map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                pomodoroPreset === mins && sessionType === 'work'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {mins} دقيقة
            </button>
          ))}
        </div>

        {/* Select Subject Dropdown */}
        <div className="mt-6 flex items-center gap-2 text-xs">
          <span className="text-slate-400">اختر مادة للمذاكرة:</span>
          <select
            value={pomodoroSubject}
            onChange={(e) => setPomodoroSubject(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ambient Noise Simulator */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 w-full max-w-md flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-slate-400" />
            <span>صوت بيئة المذاكرة:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'none', label: 'صامت' },
              { id: 'library', label: 'مكتبة الكلية 📖' },
              { id: 'rain', label: 'مطر خفيف 🌧️' },
              { id: 'whitenoise', label: 'ضوضاء بيضاء ☕' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  ambientSound === snd.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
