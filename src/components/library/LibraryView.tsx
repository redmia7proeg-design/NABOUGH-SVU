import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LibraryFile } from '../../types';
import {
  BookOpen,
  FileText,
  Download,
  Bookmark,
  Search,
  Filter,
  CheckCircle2,
  HardDriveDownload,
  Sparkles,
  Eye,
  X,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    libraryFiles,
    toggleBookmarkFile,
    toggleOfflineSaveFile,
    openAiWithContext,
    subjects,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);

  const fileTypes = [
    { id: 'all', label: 'الكل' },
    { id: 'pdf', label: 'كتب ومراجع PDF' },
    { id: 'summary', label: 'ملخصات وتفريغات' },
    { id: 'exam', label: 'امتحانات سابقة' },
    { id: 'ppt', label: 'عروض PowerPoint' },
  ];

  const filteredFiles = libraryFiles.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(search.toLowerCase()) ||
      file.teacher.toLowerCase().includes(search.toLowerCase()) ||
      file.subjectName.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || file.subjectId === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const getFileBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return <span className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold">PDF</span>;
      case 'summary':
        return <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">ملخص</span>;
      case 'exam':
        return <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold">امتحان</span>;
      case 'ppt':
        return <span className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px] font-bold">عرض PPT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">مستند</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>المكتبة الرقمية والمراجع</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            الكتب الجامعية المقررة، مذكرات الشرح، تفريغات المحاضرات، ونماذج الامتحانات السابقة
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الدكتور أو المادة..."
            className="w-full h-10 pr-9 pl-4 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Type filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {fileTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedType === t.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Subject dropdown filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">جميع المقررات الدراسية</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getFileBadge(file.type)}
                  {file.isSavedOffline && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>متاح بدون نت</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleBookmarkFile(file.id)}
                  className={`p-1.5 rounded-xl transition ${
                    file.isBookmarked
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="حفظ في المفضلة"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                {file.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {file.subjectName} • {file.teacher}
              </p>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {file.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{file.size}</span>
              <span>{file.downloadsCount} تنزيل</span>
            </div>

            {/* Actions */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => setPreviewFile(file)}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition flex items-center justify-center gap-1"
                title="معاينة الملف"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة</span>
              </button>

              <button
                onClick={() => toggleOfflineSaveFile(file.id)}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                  file.isSavedOffline
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
                title="حفظ للقراءة دون اتصال"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>{file.isSavedOffline ? 'محفوظ' : 'حفظ أوفلاين'}</span>
              </button>

              <button
                onClick={() =>
                  openAiWithContext(
                    file.subjectName,
                    `قم بتحليل وتلخيص الملف بعنوان "${file.title}" مع استخراج المصطلحات والمفاهيم التربوية الأساسية.`
                  )
                }
                className="py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition flex items-center justify-center gap-1"
                title="تلخيص ذكي"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تلخيص</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">معاينة الملف الأكاديمي</h3>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-blue-600">{previewFile.subjectName}</span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{previewFile.title}</h4>
              <p className="text-xs text-slate-500">إشراف: {previewFile.teacher}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              <p className="font-bold text-slate-900 dark:text-white mb-2">مقدمة وخلاصة الوثيقة:</p>
              <p>{previewFile.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-slate-500">
                <p>• عدد الصفحات المقدرة: 34 صفحة مع المخططات والرسوم التوضيحية.</p>
                <p>• معتمد من قسم {previewFile.subjectName} للفصل الدراسي الأول 2025/2026.</p>
                <p>• متوافق مع معايير جودة التعليم والاعتماد الأكاديمي.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`تم بدء تنزيل ملف "${previewFile.title}" (${previewFile.size}) بنجاح!`);
                  setPreviewFile(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الملف الكامل ({previewFile.size})</span>
              </button>
              <button
                onClick={() => {
                  toggleOfflineSaveFile(previewFile.id);
                  setPreviewFile(null);
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition"
              >
                {previewFile.isSavedOffline ? 'إلغاء التخزين بدون نت' : 'حفظ بدون نت'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
