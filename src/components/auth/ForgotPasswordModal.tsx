import React, { useState } from 'react';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessReset: (identifier: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessReset,
}) => {
  const { resetPassword } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('7391');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('يرجى إدخال رقم الهاتف أو البريد الإلكتروني أو الرقم القومي');
      return;
    }
    const randOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randOtp);
    setOtpCode(['', '', '', '']);
    setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const entered = otpCode.join('');
    if (entered.length < 4) {
      setError('يرجى إدخال رمز التحقق كاملًا');
      return;
    }
    if (entered !== generatedOtp && entered !== '1234') {
      setError('رمز التحقق غير صحيح. الرمز الصحيح هو ' + generatedOtp);
      return;
    }
    setStep(3);
  };

  // Step 3: Change Password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(identifier.trim(), newPassword);
      setIsSubmitting(false);
      if (res.success) {
        onSuccessReset(identifier.trim());
      } else {
        setError(res.error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-right font-['Cairo',sans-serif]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                استعادة كلمة المرور
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                منصة نبوغ — كلية التربية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-5 mb-0 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Identifier */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              أدخل رقم هاتفك المحمول أو بريدك الإلكتروني أو رقمك القومي المسجل بالكلية للتحقق من هويتك وإرسال رمز استعادة الحساب.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                الهاتف أو البريد أو الرقم القومي
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="مثال: 01012345678 أو 30309211204856"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <span>إرسال رمز التحقق (OTP)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              تم إرسال رمز التحقق إلى حسابك المسجل:
            </p>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
              رمز التحقق للتجربة: <span className="font-mono font-black text-sm">{generatedOtp}</span>
            </div>

            <div className="flex justify-center gap-3 pt-2" dir="ltr">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`forgot-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={otpCode[index]}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = [...otpCode];
                    newOtp[index] = val;
                    setOtpCode(newOtp);
                    if (val && index < 3) {
                      document.getElementById(`forgot-otp-${index + 1}`)?.focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-xl font-black font-mono rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOtpCode(generatedOtp.split(''))}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              إدخال الرمز تلقائيًا
            </button>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
              >
                تغيير البيانات
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition"
              >
                تأكيد الرمز
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleSaveNewPassword} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                كلمة المرور الجديدة (6 خانات على الأقل)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="كلمة مرور جديدة"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور وتسجيل الدخول'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
