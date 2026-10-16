import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flashcard } from '../../types';
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCw,
  Plus,
  BookOpen,
} from 'lucide-react';

const officialFlashcards: Flashcard[] = [
  {
    id: 'fc_01',
    subjectId: 'sub_01',
    subjectName: 'علم النفس التربوي المتقدم',
    question: 'ما هو مفهوم "منطقة النمو القريبة" (ZPD) عند فيجوتسكي؟',
    answer: 'هي المسافة بين ما يستطيع المتعلم إنجازه بمفرده استقلالياً، وما يمكنه تحقيقه تحت إشراف وتوجيه معلم أو بالتعاون مع أقران أكثر كفاءة (الدعائم التعليمية Scaffolding).',
    difficulty: 'medium',
  },
  {
    id: 'fc_02',
    subjectId: 'sub_01',
    subjectName: 'علم النفس التربوي المتقدم',
    question: 'ما الفرق بين المواءمة (Accommodation) والاستيعاب (Assimilation) عند بياجيه؟',
    answer: 'الاستيعاب: دمج معلومات جديدة في بنيات معرفية (سكيما) قائمة دون تعديلها. المواءمة: تعديل أو خلق بنيات معرفية جديدة لتناسب معلومات أو خبرات جديدة غير مألوفة.',
    difficulty: 'hard',
  },
  {
    id: 'fc_03',
    subjectId: 'sub_02',
    subjectName: 'استراتيجيات التدريس الفعال',
    question: 'ما هي معايير صياغة الهدف السلوكي (مبدأ SMART أو أن + فعل مضارع + طالب)؟',
    answer: 'يجب أن يصف سلوك الطالب الملاحظ والقابل للقياس، وأن يحدد شرط الأداء ومعيار النجاح الأدنى المقبول (مثل: أن يعدد الطالب ثلاث خصائص...).',
    difficulty: 'easy',
  },
];

export const FlashcardsView: React.FC = () => {
  const { subjects, openAiWithContext } = useApp();
  const [flashcards, setFlashcards] = useState<Flashcard[]>(officialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredCards = flashcards.filter(
    (c) => selectedSubject === 'all' || c.subjectId === selectedSubject
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>البطاقات التعليمية التفاعلية (Flashcards)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اضغط على البطاقة لقلبها واختبار حفظك للمصطلحات والمفاهيم التربوية
          </p>
        </div>

        <button
          onClick={() =>
            openAiWithContext(
              'علم النفس التربوي',
              'أنشئ 4 بطاقات تعليمية جديدة (سؤال وجواب محدد) لمادة علم النفس التربوي.'
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-500/30"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>توليد بطاقات بنبوغ AI</span>
        </button>
      </div>

      {/* Filter and Counter */}
      <div className="flex items-center justify-between gap-3">
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
        >
          <option value="all">جميع المقررات ({flashcards.length})</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="text-xs font-bold text-slate-500">
          بطاقة <span className="font-mono text-indigo-600">{currentIndex + 1}</span> من {filteredCards.length}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      {currentCard ? (
        <div className="perspective-1000 w-full min-h-[340px] flex items-center justify-center py-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full max-w-xl min-h-[300px] rounded-3xl p-8 cursor-pointer transition-all duration-500 transform-style-3d relative shadow-xl border flex flex-col justify-between text-center select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white border-indigo-700 rotate-y-180'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200/90 dark:border-slate-800 hover:shadow-2xl'
            }`}
          >
            {/* Front & Back Content depending on rotation */}
            {!isFlipped ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {currentCard.subjectName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">سؤال / مفهوم</span>
                </div>

                <div className="my-8">
                  <h3 className="text-lg lg:text-xl font-black leading-relaxed">
                    {currentCard.question}
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-500 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>اضغط لعرض الإجابة والشرح</span>
                </div>
              </>
            ) : (
              <div className="rotate-y-180 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-indigo-200">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm">
                    الإجابة والشرح النموذجي
                  </span>
                  <span className="text-[11px]">مستوى: {currentCard.difficulty}</span>
                </div>

                <div className="my-8">
                  <p className="text-base lg:text-lg leading-relaxed text-indigo-50 font-medium">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-300 font-bold">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>اضغط للعودة للسؤال</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl">
          <p className="text-slate-500">لا توجد بطاقات في هذا المقرر حالياً.</p>
        </div>
      )}

      {/* Nav Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition shadow-sm"
          title="البطاقة السابقة"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleShuffle}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition shadow-sm"
          title="ترتيب عشوائي"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20"
          title="البطاقة التالية"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
