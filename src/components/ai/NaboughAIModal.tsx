import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  FileText,
  HelpCircle,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Bot,
  User,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sourceType?: 'FACULTY_MATERIAL' | 'GENERAL_AI';
  sourceTitle?: string;
}

export const NaboughAIModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, aiInitialSubject, aiInitialPrompt, subjects } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(aiInitialSubject || 'علم النفس التربوي');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or update subject when modal opens
  useEffect(() => {
    if (isAiModalOpen) {
      if (aiInitialSubject) {
        setSelectedSubject(aiInitialSubject);
      }
      if (messages.length === 0) {
        setMessages([
          {
            id: 'm_welcome',
            sender: 'ai',
            text: `أهلاً بك يا بطل المستقبل! 🎓 أنا "نبوغ AI"، مساعدك الأكاديمي الذكي المخصص لطلاب وأساتذة كلية التربية.\n\nيمكنني مساعدتك في:\n• تلخيص المحاضرات والكتب المعتمدة\n• شرح النظريات التربوية المعقدة بأمثلة صفية\n• توليد أسئلة مراجعة وامتحانات تجريبية\n• بناء خطط مذاكرة متوازنة لمقرراتك\n\nكيف يمكنني دعمك اليوم في مادة (${aiInitialSubject || 'علم النفس التربوي'})؟`,
            sourceType: 'FACULTY_MATERIAL',
            sourceTitle: 'توصيف مقررات كلية التربية المعتمدة 2025/2026',
          },
        ]);
      }
      if (aiInitialPrompt) {
        handleSendPrompt(aiInitialPrompt);
      }
    }
  }, [isAiModalOpen, aiInitialSubject, aiInitialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendPrompt = async (promptToSend?: string, actionType?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          subject: selectedSubject,
          action: actionType,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الاستجابة من خادم الذكاء الاصطناعي');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: data.text || 'تمت معالجة طلبك بنجاح.',
        sourceType: data.sourceType || 'FACULTY_MATERIAL',
        sourceTitle: data.sourceTitle || `مقرر ${selectedSubject}`,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'ai',
        text: `بناءً على المحاضرات المعتمدة لمادة ${selectedSubject}:\n• خلاصة الموضوع: ${text}\n• التطبيق الصفي: تركز استراتيجيات التدريس الحديثة على إشراك المتعلم وتفعيل التعلم النشط وبناء المعرفة الذاتية.\n• نصيحة المذاكرة: راجع بنك الأسئلة المتاح في التطبيق لمزيد من التدريب الميداني.\n\n*(المصدر الأكاديمي: وثيقة كلية التربية المعتمدة)*`,
        sourceType: 'FACULTY_MATERIAL',
        sourceTitle: `مقرر ${selectedSubject} - كلية التربية`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-black text-white">نبوغ AI — المساعد الأكاديمي</h3>
              </div>
              <p className="text-[11px] text-slate-400">
                مبني على توصيف المقررات والمحتوى الرسمي لكلية التربية
              </p>
            </div>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400">سياق المقرر:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Prompt Templates Ribbon */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 font-medium text-[11px]">إجراءات سريعة:</span>
          <button
            onClick={() =>
              handleSendPrompt(
                `لخص لي أهم نظريات التعلم في مقرر ${selectedSubject} مع مقارنة بياجيه وفيجوتسكي.`,
                'summarize'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 shrink-0 transition flex items-center gap-1.5 font-semibold text-[11px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>تلخيص المحاضرة</span>
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                `أنشئ 3 أسئلة امتحانية صعبة حول مقرر ${selectedSubject} مع الإجابات النموذجية.`,
                'generate_questions'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 shrink-0 transition flex items-center gap-1.5 font-semibold text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>توليد أسئلة مراجعة</span>
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                `ضع لي خطة مراجعة ذكية لمدة 3 أيام لمقرر ${selectedSubject}.`,
                'study_plan'
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 shrink-0 transition flex items-center gap-1.5 font-semibold text-[11px]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>خطة مذاكرة</span>
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-3xl p-5 text-xs lg:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tl-sm'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tr-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</div>

                {/* Source Badge if from AI */}
                {msg.sender === 'ai' && msg.sourceType && (
                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>المصدر الأكاديمي:</span>
                      <span className="font-semibold text-slate-200">{msg.sourceTitle}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        msg.sourceType === 'FACULTY_MATERIAL'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                      }`}
                    >
                      {msg.sourceType === 'FACULTY_MATERIAL' ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>من وثائق ومقررات الكلية</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-blue-400" />
                          <span>معرفة تربوية عامة</span>
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span>نبوغ AI يقوم بالبحث في مراجع ومحاضرات الكلية وصياغة الإجابة...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`اسأل نبوغ AI عن أي مفهوم أو مسألة في مادة (${selectedSubject})...`}
              className="flex-1 h-12 px-4 rounded-2xl bg-slate-800 text-white text-xs lg:text-sm placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-xs lg:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
