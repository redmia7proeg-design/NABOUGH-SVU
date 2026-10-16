import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Mail, MapPin, BookOpen, MessageSquare, Video } from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { subjects, setCurrentTab } = useApp();

  const teachers = [
    {
      id: 't_01',
      name: 'د. أحمد رمضان',
      title: 'أستاذ علم النفس التربوي والصحة النفسية',
      department: 'قسم علم النفس التربوي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      office: 'مبنى الكلية الرئيسي - غرفة 304',
      officeHours: 'الأحد والثلاثاء: 12:00 م - 02:00 م',
      subject: 'علم النفس التربوي',
      email: 'dr.ahmed.ramadan@edu.univ.edu',
    },
    {
      id: 't_02',
      name: 'د. محمد عبدالله',
      title: 'أستاذ المناهج واستراتيجيات التدريس الحديثة',
      department: 'قسم المناهج وطرق التدريس',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      office: 'مبنى ملحق المناهج - غرفة 108',
      officeHours: 'الإثنين والأربعاء: 10:00 ص - 12:00 م',
      subject: 'طرق التدريس العامة',
      email: 'dr.mohamed.abdallah@edu.univ.edu',
    },
    {
      id: 't_03',
      name: 'د. سارة علي',
      title: 'أستاذ التربية المقارنة والإدارة التعليمية',
      department: 'قسم أصول التربية',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      office: 'مبنى الكلية الرئيسي - غرفة 212',
      officeHours: 'الثلاثاء والخميس: 01:00 م - 03:00 م',
      subject: 'التربية المقارنة',
      email: 'dr.sara.ali@edu.univ.edu',
    },
    {
      id: 't_04',
      name: 'د. وليد مصطفى',
      title: 'أستاذ الفلسفة التربوية والاجتماعية',
      department: 'قسم أصول التربية',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      office: 'مبنى الكلية الرئيسي - غرفة 205',
      officeHours: 'الأربعاء: 11:00 ص - 01:00 م',
      subject: 'أصول التربية',
      email: 'dr.walid.mostafa@edu.univ.edu',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <span>أعضاء هيئة التدريس (الدكاترة والأساتذة)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          دليل التواصل الأكاديمي، الساعات المكتبية، والمقررات المسندة لكل دكتور
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between text-right"
          >
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{teacher.name}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{teacher.title}</p>
                  <p className="text-[11px] text-slate-400">{teacher.department}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span>المقرر: <strong>{teacher.subject}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>المكتب: {teacher.office}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="font-mono">{teacher.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px]">
                  <strong>الساعات المكتبية المعتمدة:</strong> {teacher.officeHours}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => setCurrentTab('lectures')}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>محاضرات الأستاذ</span>
              </button>
              <button
                onClick={() => setCurrentTab('community')}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition hover:bg-slate-200"
                title="تواصل في مجتمع الكلية"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
