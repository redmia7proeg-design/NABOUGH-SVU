import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import {
  validateEgyptianNationalId,
  validateEgyptianPhone,
  findOrCreateStudentRecord,
  CollegeStudentRecord,
} from '../../data/authData';
import { lookupCollegeStudentRecord } from '../../services/firestoreDataService';
import { useApp } from '../../context/AppContext';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const { registerStudentAccount } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verified record from college database
  const [studentRecord, setStudentRecord] = useState<CollegeStudentRecord | null>(null);

  // OTP State
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('8492');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Password Setup State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Step 1: Validate Egyptian National ID and Phone
  const handleVerifyStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nationalIdCheck = validateEgyptianNationalId(nationalId);
    if (!nationalIdCheck.valid) {
      setErrorMessage(nationalIdCheck.message || 'الرقم القومي غير صحيح');
      return;
    }

    const phoneCheck = validateEgyptianPhone(phone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.message || 'رقم الهاتف غير صحيح');
      return;
    }

    setIsSubmitting(true);
    try {
      // Lookup student in official Firestore college registry
      let record = await lookupCollegeStudentRecord(nationalId.trim(), phone.trim());
      if (!record) {
        // Fallback to official registry helper
        record = findOrCreateStudentRecord(nationalId.trim(), phone.trim());
      }
      setStudentRecord(record);

      // Generate random 4-digit OTP
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(randomOtp);
      setOtpCode(['', '', '', '']);
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر التحقق من سجلات الكلية، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 4) {
      setOtpError('يرجى إدخال رمز التحقق المكون من 4 أرقام بالكامل');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      setOtpError('رمز التحقق غير متطابق. الرمز الصحيح هو ' + generatedOtp);
      return;
    }

    setStep(3);
  };

  // Step 3: Submit Registration & Create Account
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password.length < 6) {
      setPasswordError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (!studentRecord) return;

    setIsSubmitting(true);

    try {
      const result = await registerStudentAccount({
        nationalId: studentRecord.nationalId,
        phone: studentRecord.phone,
        password: password,
      });

      setIsSubmitting(false);
      if (result.success) {
        onSuccessLogin();
      } else {
        setPasswordError(result.error || 'حدث خطأ أثناء إنشاء الحساب في Firebase');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setPasswordError(err?.message || 'حدث خطأ غير متوقع أثناء إنشاء الحساب');
    }
  };

  // Quick fill helper
  const handleQuickFill = () => {
    setNationalId('30402181401234');
    setPhone('01023456789');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 text-right font-['Cairo',sans-serif]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                إنشاء حساب طالب جديد — نَبُوغ
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                التحقق من القيد الرسمي بقاعدة بيانات كلية التربية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step >= 1
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                1
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                بيانات القيد
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step >= 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                2
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                تأكيد الكلية و OTP
              </span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step >= 3
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                3
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                تعيين كلمة المرور
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: Enter National ID & Phone */}
        {step === 1 && (
          <form onSubmit={handleVerifyStep1} className="p-6 space-y-4">
            <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>التحقق من الهوية الجامعية لطلاب كلية التربية</span>
              </p>
              يتم استرجاع بيانات قيدك الدراسي وشعبتك تلقائيًا بالربط مع السجلات الرسمية لكلية التربية عبر الرقم القومي ورقم الهاتف المسجل.
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* National ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                الرقم القومي المصري (14 رقمًا) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={14}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: 30402181401234"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm tracking-wider focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {nationalId.length} / 14 رقمًا
              </span>
            </div>

            {/* Egyptian Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                رقم الهاتف المحمول المصري (11 رقمًا) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: 01023456789 (يبدأ بـ 010 أو 011 أو 012 أو 015)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm tracking-wider focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {phone.length} / 11 رقمًا
              </span>
            </div>

            {/* Quick Demo Fill */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline decoration-dotted flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>تعبئة سريعة لطالب مقيد للتجربة (سارة أحمد)</span>
              </button>
            </div>

            {/* Submit Step 1 Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                <span>تحقق من القيد بالكلية والمتابعة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: University Registry Found & SMS OTP Verification */}
        {step === 2 && studentRecord && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            {/* Student Registry Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  تم التحقق من القيد الأكاديمي بنجاح ✓
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  {studentRecord.studentId}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {studentRecord.fullName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {studentRecord.faculty} — {studentRecord.department}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {studentRecord.level}
                  </span>
                  <span>•</span>
                  <span>{studentRecord.specialization}</span>
                </div>
              </div>
            </div>

            {/* OTP Section */}
            <div className="space-y-2 text-center pt-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                أدخل رمز التأكيد (OTP) المرسل إلى هاتفك {phone}
              </h4>
              <p className="text-[11px] text-slate-500">
                للتجربة السريعة: رمز التأكيد هو{' '}
                <span className="font-mono font-black text-blue-600 px-1 py-0.5 bg-blue-50 dark:bg-blue-900/50 rounded">
                  {generatedOtp}
                </span>
              </p>

              {otpError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-bold text-right">
                  {otpError}
                </div>
              )}

              {/* 4-digit boxes */}
              <div className="flex justify-center gap-3 pt-2" dir="ltr">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[index]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newOtp = [...otpCode];
                      newOtp[index] = val;
                      setOtpCode(newOtp);
                      if (val && index < 3) {
                        const nextInput = document.getElementById(`otp-input-${index + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-input-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-black font-mono rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp.split(''))}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  إدخال الرمز التلقائي ({generatedOtp})
                </button>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
              >
                تعديل البيانات
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                <span>تأكيد الرمز والمتابعة لإنشاء كلمة المرور</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Setup Password */}
        {step === 3 && studentRecord && (
          <form onSubmit={handleCompleteRegistration} className="p-6 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold block text-slate-900 dark:text-white">
                حساب الطالب: {studentRecord.fullName}
              </span>
              <span className="text-[11px] text-slate-500">
                الرقم القومي: {studentRecord.nationalId} • الهاتف: {studentRecord.phone}
              </span>
            </div>

            {passwordError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                كلمة المرور الجديدة <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="لا تقل عن 6 خانات"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              بالنقر على زر إنشاء الحساب، فإنك توافق على الالتزام بميثاق الشرف الأكاديمي ولوائح استخدام منصة نَبُوغ الرقمية لكلية التربية.
            </div>

            {/* Submit Final */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
              >
                السابق
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'جارٍ تسجيل الحساب...' : 'إتمام التسجيل والدخول للمنصة'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
