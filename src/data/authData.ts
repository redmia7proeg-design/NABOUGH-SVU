import { AuthAccount, UserProfile } from '../types';

export interface CollegeStudentRecord {
  nationalId: string;
  phone: string;
  fullName: string;
  faculty: string;
  department: string;
  specialization: string;
  level: string;
  section: string;
  studentId: string;
  gpa: number;
  completedCreditHours: number;
  totalCreditHours: number;
  academicYear: string;
  isRegisteredAccount: boolean;
}

// Egyptian National ID Validator (14 digits)
export function validateEgyptianNationalId(id: string): { valid: boolean; message?: string } {
  const cleanId = id.trim();
  if (!cleanId) {
    return { valid: false, message: 'يرجى إدخال الرقم القومي' };
  }
  if (!/^\d{14}$/.test(cleanId)) {
    return { valid: false, message: 'الرقم القومي المصري يجب أن يتكون من 14 رقمًا بالضبط' };
  }

  const centuryDigit = parseInt(cleanId[0], 10);
  if (centuryDigit !== 2 && centuryDigit !== 3) {
    return { valid: false, message: 'الرقم القومي غير صالح (خانة القرن يجب أن تبدأ بـ 2 أو 3)' };
  }

  const month = parseInt(cleanId.substring(3, 5), 10);
  const day = parseInt(cleanId.substring(5, 7), 10);

  if (month < 1 || month > 12) {
    return { valid: false, message: 'الرقم القومي غير صحيح (الشهر غير صالح)' };
  }
  if (day < 1 || day > 31) {
    return { valid: false, message: 'الرقم القومي غير صحيح (اليوم غير صالح)' };
  }

  return { valid: true };
}

// Egyptian Phone Validator (11 digits, starts with 010, 011, 012, 015)
export function validateEgyptianPhone(phone: string): { valid: boolean; message?: string } {
  const cleanPhone = phone.trim();
  if (!cleanPhone) {
    return { valid: false, message: 'يرجى إدخال رقم الهاتف المحمول' };
  }
  if (!/^01[0125]\d{8}$/.test(cleanPhone)) {
    return {
      valid: false,
      message: 'رقم الهاتف يجب أن يكون رقمًا مصريًا صحيحًا مكونًا من 11 رقمًا (يبدأ بـ 010 أو 011 أو 012 أو 015)',
    };
  }
  return { valid: true };
}

// College student registry lookup fallback
export function findOrCreateStudentRecord(nationalId: string, phone: string): CollegeStudentRecord {
  const century = nationalId[0] === '3' ? 2000 : 1900;
  const year = century + parseInt(nationalId.substring(1, 3), 10);
  const genderCode = parseInt(nationalId[12], 10);
  const isFemale = genderCode % 2 === 0;

  return {
    nationalId,
    phone,
    fullName: isFemale ? 'مريم محمود عبد العزيز' : 'أحمد محمود النجار',
    faculty: 'كلية التربية',
    department: 'قسم علم النفس التربوي والصحة النفسية',
    specialization: 'شعبة علم النفس التربوي',
    level: year > 2004 ? 'الفرقة الأولى' : year === 2004 ? 'الفرقة الثانية' : 'الفرقة الثالثة',
    section: 'الشعبة الثانية (ب)',
    studentId: `EDU-${year}-${Math.floor(1000 + Math.random() * 9000)}`,
    gpa: 3.82,
    completedCreditHours: 94,
    totalCreditHours: 132,
    academicYear: '2025 / 2026',
    isRegisteredAccount: false,
  };
}
