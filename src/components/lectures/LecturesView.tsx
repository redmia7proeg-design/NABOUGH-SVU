import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lecture } from '../../types';
import {
  Video,
  Headphones,
  FileText,
  Clock,
  Bookmark,
  Sparkles,
  Play,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
} from 'lucide-react';

export const LecturesView: React.FC = () => {
  const {
    subjects,
    lectures,
    setActiveLecture,
    toggleBookmarkLecture,
    openAiWithContext,
    setCurrentTab,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredLectures = lectures.filter((lec) => {
    const matchesSubject = selectedSubjectId === 'all' || lec.subjectId === selectedSubjectId;
    const matchesSearch =
      lec.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lec.subjectName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lec.instructor.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Video className="w-6 h-6 text-blue-600" />
            <span>المحاضرات والتسجيلات</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            شاهد واستمع وتصفح محاضرات كلية التربية مع تدوين الملاحظات المتزامنة والتلخيص الذكي
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="بحث في المحاضرات..."
            className="w-full h-10 pr-9 pl-4 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
            selectedSubjectId === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          جميع المقررات ({lectures.length})
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubjectId(sub.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedSubjectId === sub.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Lectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLectures.map((lec) => (
          <div
            key={lec.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Media Preview Box */}
              <div
                onClick={() => setActiveLecture(lec)}
                className="relative h-44 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center group/cover"
              >
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80"
                  alt={lec.title}
                  className="w-full h-full object-cover opacity-60 group-hover/cover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover/cover:scale-110 group-hover/cover:bg-blue-500 transition">
                  <Play className="w-5 h-5 fill-white mr-0.5" />
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lec.duration}</span>
                </div>

                {/* Subject Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600/80 backdrop-blur-sm text-white text-[11px] font-bold">
                  {lec.subjectName}
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkLecture(lec.id);
                  }}
                  className={`absolute top-3 left-3 p-1.5 rounded-xl backdrop-blur-sm transition ${
                    lec.isBookmarked
                      ? 'bg-amber-500 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title="حفظ المحاضرة"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{lec.date}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{lec.room}</span>
                </div>

                <h3
                  onClick={() => setActiveLecture(lec)}
                  className="mt-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {lec.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {lec.instructor}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>نسبة الاستماع / المشاهدة</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                      {lec.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        lec.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${lec.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Badges row */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-500" />
                      <span>{lec.notesCount} ملاحظات</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-500" />
                      <span>{lec.questionsCount} أسئلة</span>
                    </span>
                  </div>
                  {lec.progressPercent === 100 && (
                    <span className="flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>مكتملة</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setActiveLecture(lec)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل المحاضرة</span>
              </button>

              <button
                onClick={() =>
                  openAiWithContext(
                    lec.subjectName,
                    `قم بتلخيص المحاضرة بعنوان: "${lec.title}" لمادة (${lec.subjectName}) واقترح 3 أسئلة هامة للمراجعة.`
                  )
                }
                className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
                title="تلخيص ذكي بنبوغ AI"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
