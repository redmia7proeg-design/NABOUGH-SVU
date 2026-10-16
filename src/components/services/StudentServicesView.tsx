import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentTicket } from '../../types';
import {
  Headphones,
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Camera,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentServicesView: React.FC = () => {
  const { tickets, addTicket, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'tickets' | 'attendance' | 'qr'>('tickets');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'lectures' | 'schedule' | 'files' | 'grades' | 'general'>('schedule');
  const [ticketDescription, setTicketDescription] = useState('');

  // QR Attendance check-in simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    addTicket({
      title: ticketTitle.trim(),
      category: ticketCategory,
      description: ticketDescription.trim(),
    });

    setTicketTitle('');
    setTicketDescription('');
    setShowNewTicketModal(false);
  };

  const handleSimulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم الحل</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>قيد المعالجة</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold">
            قيد المراجعة
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
            جديد
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Headphones className="w-6 h-6 text-blue-600" />
            <span>خدمات وشكاوى الطالب ونظام الحضور QR</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تقديم طلبات الدعم الأكاديمي، الاستفسارات، وتأكيد الحضور الذكي في المحاضرات
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shadow-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>تقديم طلب أو استفسار جديد</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          تذاكر الدعم والطلبات ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'qr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>تسجيل الحضور عبر QR</span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          سجل الحضور والغياب (96%)
        </button>
      </div>

      {/* Tab: Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 text-right"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    رقم التذكرة: {tck.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{tck.createdAt}</span>
                </div>
                {getStatusBadge(tck.status)}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{tck.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {tck.description}
              </p>

              {tck.response && (
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>رد الإدارة الأكاديمية:</strong> {tck.response}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: QR Scanner Attendance */}
      {activeTab === 'qr' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm max-w-xl mx-auto text-center space-y-6">
          <div className="p-3 w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تسجيل الحضور الإلكتروني للمحاضرة
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              امسح رمز QR المعروض على شاشة القاعة بواسطة أستاذ المادة لتأكيد حضورك فوراً
            </p>
          </div>

          {/* Scanner Simulation Box */}
          <div className="relative w-64 h-64 mx-auto rounded-3xl bg-slate-900 border-2 border-dashed border-blue-500 flex flex-col items-center justify-center overflow-hidden">
            {isScanning ? (
              <div className="space-y-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-blue-300 font-semibold animate-pulse">جاري التحقق من رمز القاعة 201...</p>
              </div>
            ) : scanSuccess ? (
              <div className="space-y-2 p-4 animate-in zoom-in duration-200">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">تم تسجيل الحضور بنجاح!</h4>
                <p className="text-[11px] text-emerald-300">مقرر: علم النفس التربوي (د. أحمد رمضان)</p>
                <p className="text-[10px] text-slate-400 font-mono">التوقيت: 10:05 ص • 23 سبتمبر 2025</p>
              </div>
            ) : (
              <div className="space-y-3 text-slate-400">
                <Camera className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-xs">اضغط الزر بالأسفل لتشغيل الكاميرا ومسح الرمز</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleSimulateQRScan}
              disabled={isScanning}
              className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
            >
              {scanSuccess ? 'مسح رمز محاضرة أخرى' : 'مسح رمز الحضور الآن'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Attendance Record */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 text-right">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">سجل حضور المحاضرات المعتمد</h3>
            <span className="text-xs font-bold text-emerald-600">نسبة الالتزام: 96%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">48</span>
              <p className="text-xs text-slate-400 mt-1">محاضرة تم حضورها</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-2xl font-black text-rose-600 font-mono">2</span>
              <p className="text-xs text-slate-400 mt-1">غياب بعذر رسمي</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">0</span>
              <p className="text-xs text-slate-400 mt-1">إنذارات حضور</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-600 font-mono">منتظم</span>
              <p className="text-xs text-slate-400 mt-1">حالة القيد الأكاديمي</p>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">تقديم تذكرة دعم أو شكوى أكاديمية</h3>
            <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  موضوع الطلب
                </label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="مثال: تعارض موعد المحاضرة أو مشكلة في تحميل الملف"
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  تصنيف الطلب
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="schedule">الجدول والقاعات الدراسية</option>
                  <option value="lectures">المحاضرات والتسجيلات</option>
                  <option value="files">المكتبة الرقمية والمذكرات</option>
                  <option value="grades">الدرجات ورصد الامتحانات</option>
                  <option value="general">استفسار عام</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  تفاصيل الشكوى أو الطلب
                </label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="يرجى كتابة كافة التفاصيل لمساعدة فريق شؤون الطلاب في المتابعة السريعة..."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" />
                  <span>إرسال التذكرة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
