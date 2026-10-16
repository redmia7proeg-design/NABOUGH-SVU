import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, Video, FileText, Play, Eye } from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { lectures, libraryFiles, setActiveLecture, toggleBookmarkLecture, toggleBookmarkFile } = useApp();
  const [filter, setFilter] = useState<'all' | 'lectures' | 'files'>('all');

  const bookmarkedLectures = lectures.filter((l) => l.isBookmarked);
  const bookmarkedFiles = libraryFiles.filter((f) => f.isBookmarked);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
          <span>المحفوظات والعناصر المميزة</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          المحاضرات، الملفات، والمذكرات التي قمت بحفظها للرجوع إليها سريعاً
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          الكل ({bookmarkedLectures.length + bookmarkedFiles.length})
        </button>
        <button
          onClick={() => setFilter('lectures')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'lectures' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          المحاضرات ({bookmarkedLectures.length})
        </button>
        <button
          onClick={() => setFilter('files')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'files' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          الملفات والمذكرات ({bookmarkedFiles.length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(filter === 'all' || filter === 'lectures') &&
          bookmarkedLectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between text-right"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 text-xs font-bold flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    <span>محاضرة</span>
                  </span>
                  <button
                    onClick={() => toggleBookmarkLecture(lec.id)}
                    className="text-amber-500 p-1"
                    title="إزالة من المحفوظات"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{lec.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{lec.subjectName} • {lec.instructor}</p>
              </div>

              <button
                onClick={() => setActiveLecture(lec)}
                className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل المحاضرة</span>
              </button>
            </div>
          ))}

        {(filter === 'all' || filter === 'files') &&
          bookmarkedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between text-right"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>ملف مذكرات</span>
                  </span>
                  <button
                    onClick={() => toggleBookmarkFile(file.id)}
                    className="text-amber-500 p-1"
                    title="إزالة من المحفوظات"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{file.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{file.subjectName} • {file.teacher}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono">
                الحجم: {file.size}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
