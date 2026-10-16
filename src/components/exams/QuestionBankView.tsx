import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question } from '../../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const officialFacultyQuestions: Question[] = [
  {
    id: 'q_01',
    subjectId: 'sub_01',
    subjectName: 'علم النفس التربوي المتقدم',
    question: 'في أي مرحلة من مراحل النمو المعرفي عند بياجيه يظهر التفكير الافتراضي الاستنباطي المجرد؟',
    type: 'mcq',
    options: [
      'المرحلة الحسية الحركية (0 - سنتين)',
      'مرحلة ما قبل العمليات (2 - 7 سنوات)',
      'مرحلة العمليات المادية أو العيانية (7 - 11 سنة)',
      'مرحلة العمليات الشكلية أو المجردة (11 سنة فما فوق)',
    ],
    correctAnswerIndex: 3,
    explanation: 'مرحلة العمليات المجردة تمكّن المتعلم من التفكير الاستدلالي الافتراضي والتعامل مع المفاهيم المجردة دون الحاجة لوسائط حسية مباشرة.',
  },
  {
    id: 'q_02',
    subjectId: 'sub_01',
    subjectName: 'علم النفس التربوي المتقدم',
    question: 'يُعرّف "التعزيز الإيجابي" في المذهب السلوكي بأنه إزالة مثير منفر لزيادة احتمالية حدوث السلوك المرغوب.',
    type: 'true_false',
    options: ['صواب', 'خطأ'],
    correctAnswerIndex: 1,
    explanation: 'خطأ؛ التعريف المذكور هو تعريف "التعزيز السلبي"، أما التعزيز الإيجابي فهو إضافة مثير مرغوب ومحبب لزيادة تكرار السلوك.',
  },
  {
    id: 'q_03',
    subjectId: 'sub_02',
    subjectName: 'استراتيجيات التدريس الفعال',
    question: 'أي من العناصر التالية يُمثل أدنى مستويات المجال المعرفي في تصنيف بلوم المعدّل؟',
    type: 'mcq',
    options: ['الفهم والتفسير', 'التذكر والاسترجاع', 'التطبيق العملي', 'التحليل والمقارنة'],
    correctAnswerIndex: 1,
    explanation: 'التذكر (Remembering) هو أدنى المستويات المعرفية في هرم بلوم، ويليه الفهم ثم التطبيق ثم التحليل ثم التقييم ثم الابتكار في القمة.',
  },
];

export const QuestionBankView: React.FC = () => {
  const { subjects, openAiWithContext } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [questions, setQuestions] = useState<Question[]>(officialFacultyQuestions);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [checkedQuestions, setCheckedQuestions] = useState<{ [qId: string]: boolean }>({});

  const filteredQuestions = questions.filter(
    (q) => selectedSubject === 'all' || q.subjectId === selectedSubject
  );

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (checkedQuestions[questionId]) return; // locked once checked
    setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
  };

  const handleCheckAnswer = (questionId: string, correctAnswerIndex: number) => {
    setCheckedQuestions({ ...checkedQuestions, [questionId]: true });
    if (userAnswers[questionId] === correctAnswerIndex) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCheckedQuestions({});
  };

  const answeredCount = Object.keys(checkedQuestions).length;
  const correctCount = Object.keys(checkedQuestions).filter(
    (qId) => userAnswers[qId] === questions.find((q) => q.id === qId)?.correctAnswerIndex
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-purple-600" />
            <span>بنك الأسئلة والتدريبات التفاعلية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اختبر معلوماتك التربوية مع التصحيح التلقائي والشرح المفصل لكل إجابة
          </p>
        </div>

        {/* Generate with AI button */}
        <button
          onClick={() =>
            openAiWithContext(
              'علم النفس التربوي',
              'أنشئ 5 أسئلة اختيار من متعدد جديدة لمادة علم النفس التربوي حول نظريات التعلم مع توضيح الإجابة الصحيحة والشرح التربوي.'
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold transition shadow-sm shadow-purple-500/30 hover:opacity-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>توليد أسئلة بنبوغ AI</span>
        </button>
      </div>

      {/* Filter and Score Ribbon */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            جميع الأسئلة ({questions.length})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedSubject === sub.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
            النتيجة: <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{correctCount}</span> / {answeredCount}
          </div>
          <button
            onClick={handleResetQuiz}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            title="إعادة تعيين الاختبار"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {filteredQuestions.map((q, idx) => {
          const isChecked = checkedQuestions[q.id];
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  {q.subjectName}
                </span>
                <span className="text-xs font-semibold text-slate-400">سؤال {idx + 1}</span>
              </div>

              <h3 className="text-sm lg:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

                  if (isChecked) {
                    if (optIdx === q.correctAnswerIndex) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isChecked}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-right p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 text-xs lg:text-sm ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        {isChecked && optIdx === q.correctAnswerIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isChecked && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Check Answer Button / Feedback */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                {!isChecked ? (
                  <button
                    disabled={selectedOption === undefined}
                    onClick={() => handleCheckAnswer(q.id, q.correctAnswerIndex)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition"
                  >
                    تأكيد الإجابة
                  </button>
                ) : (
                  <div className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      {isCorrect ? (
                        <span className="text-emerald-600 dark:text-emerald-400">إجابة صحيحة! أحسنت 🌟</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">إجابة غير صحيحة</span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>الشرح والتحليل التربوي:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
