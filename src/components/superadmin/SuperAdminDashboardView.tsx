import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  KeyRound,
  FileCheck2,
  Activity,
  Settings,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Crown,
  GraduationCap,
  Briefcase,
  School,
  Shield,
  Eye,
  Edit3,
  Lock,
  Download,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Send,
  Trash2,
  Layers,
  ChevronRight,
  Plus,
  Calendar,
  Pencil,
} from 'lucide-react';
import { Role, StudentPosition, PermissionKey, ActivityLog, Subject, ScheduleItem, Exam, UserProfile, AuthAccount } from '../../types';

export const SuperAdminDashboardView: React.FC = () => {
  const {
    currentUser,
    authAccounts,
    updateUserRole,
    updateStudentPosition,
    toggleUserStatus,
    createNewUserAccount,
    deleteUserAccount,
    updateUserPermissions,
    activityLogs,
    addActivityLog,
    platformSettings,
    updatePlatformSettings,
    subjects,
    addSubject,
    updateSubject,
    removeSubject,
    lectures,
    schedules,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    exams,
    addExamItem,
    updateExamItem,
    deleteExamItem,
    updateUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'schedules' | 'exams' | 'positions' | 'permissions' | 'logs' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Activity Log Filter & Detail Modal States
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logUserFilter, setLogUserFilter] = useState<string>('all');
  const [logRoleFilter, setLogRoleFilter] = useState<string>('all');
  const [logActionFilter, setLogActionFilter] = useState<string>('all');
  const [logEntityFilter, setLogEntityFilter] = useState<string>('all');
  const [logPage, setLogPage] = useState<number>(1);
  const [selectedLogDetail, setSelectedLogDetail] = useState<ActivityLog | null>(null);

  // Course Management State
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('قسم علم النفس التربوي');
  const [newCourseHours, setNewCourseHours] = useState(3);
  const [newCourseRoom, setNewCourseRoom] = useState('مدرج 4');
  const [newCourseTime, setNewCourseTime] = useState('الأحد 09:00 ص');

  // Course Edit Modal State
  const [editingCourse, setEditingCourse] = useState<Subject | null>(null);
  const [editCourseName, setEditCourseName] = useState('');
  const [editCourseCode, setEditCourseCode] = useState('');
  const [editCourseInstructor, setEditCourseInstructor] = useState('');
  const [editCourseDept, setEditCourseDept] = useState('قسم علم النفس التربوي');
  const [editCourseHours, setEditCourseHours] = useState(3);
  const [editCourseRoom, setEditCourseRoom] = useState('مدرج 4');
  const [editCourseTime, setEditCourseTime] = useState('الأحد 09:00 ص');

  // Schedule Management State
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [newScheduleSubject, setNewScheduleSubject] = useState('');
  const [newScheduleInstructor, setNewScheduleInstructor] = useState('');
  const [newScheduleDay, setNewScheduleDay] = useState('Sunday');
  const [newScheduleDayArabic, setNewScheduleDayArabic] = useState('الأحد');
  const [newScheduleStartTime, setNewScheduleStartTime] = useState('09:00 ص');
  const [newScheduleEndTime, setNewScheduleEndTime] = useState('11:00 ص');
  const [newScheduleRoom, setNewScheduleRoom] = useState('مدرج 4');
  const [newScheduleType, setNewScheduleType] = useState<'lecture' | 'section' | 'lab'>('lecture');

  // Schedule Edit Modal State
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [editScheduleSubject, setEditScheduleSubject] = useState('');
  const [editScheduleInstructor, setEditScheduleInstructor] = useState('');
  const [editScheduleDay, setEditScheduleDay] = useState('Sunday');
  const [editScheduleStartTime, setEditScheduleStartTime] = useState('09:00 ص');
  const [editScheduleEndTime, setEditScheduleEndTime] = useState('11:00 ص');
  const [editScheduleRoom, setEditScheduleRoom] = useState('مدرج 4');
  const [editScheduleType, setEditScheduleType] = useState<'lecture' | 'section' | 'lab'>('lecture');

  // Exam Management State
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examSubjectName, setExamSubjectName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examDayArabic, setExamDayArabic] = useState('الأحد');
  const [examTime, setExamTime] = useState('10:00 ص - 12:00 م');
  const [examRoom, setExamRoom] = useState('مدرج 4');
  const [examType, setExamType] = useState<'midterm' | 'final' | 'quiz' | 'practical'>('midterm');
  const [examMaxScore, setExamMaxScore] = useState(20);
  const [examRemainingDays, setExamRemainingDays] = useState(15);

  // User Edit Modal State
  const [editingUser, setEditingUser] = useState<AuthAccount | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserNationalId, setEditUserNationalId] = useState('');
  const [editUserDept, setEditUserDept] = useState('');
  const [editUserLevel, setEditUserLevel] = useState('');
  const [editUserSpecialization, setEditUserSpecialization] = useState('');

  // Modal State for New User
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserNationalId, setNewUserNationalId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123456');
  const [newUserRole, setNewUserRole] = useState<Role>('student');
  const [newUserPosition, setNewUserPosition] = useState<StudentPosition>('normal');
  const [newUserPositionTitle, setNewUserPositionTitle] = useState('');
  const [newUserPositionScope, setNewUserPositionScope] = useState('');

  // Modal State for Editing Position
  const [editingUserForPosition, setEditingUserForPosition] = useState<string | null>(null);
  const [editPosRole, setEditPosRole] = useState<StudentPosition>('normal');
  const [editPosTitle, setEditPosTitle] = useState('');
  const [editPosScope, setEditPosScope] = useState('');

  // Matrix Permissions list
  const allPermissionsList: { key: PermissionKey; label: string; group: string }[] = [
    { key: 'manage_users', label: 'إدارة المستخدمين والحسابات كاملة', group: 'المستخدمين' },
    { key: 'manage_roles_permissions', label: 'تعديل الصلاحيات والأدوار والمناصب', group: 'المستخدمين' },
    { key: 'view_activity_logs', label: 'الاطلاع على سجل العمليات (Activity Logs)', group: 'النظام' },
    { key: 'manage_system_settings', label: 'التحكم في إعدادات المنصة والسيرفر', group: 'النظام' },
    { key: 'manage_all_departments', label: 'إدارة الأقسام والفرق والشعب الدراسية', group: 'الأكاديمي' },
    { key: 'manage_all_subjects', label: 'إدارة المقررات الدراسية لجميع الفرق', group: 'الأكاديمي' },
    { key: 'manage_assigned_subjects', label: 'إدارة المقررات المسندة فقط', group: 'المحاضرات' },
    { key: 'upload_lecture_materials', label: 'رفع المحاضرات وملفات الـ PDF والتسجيلات', group: 'المحاضرات' },
    { key: 'manage_question_bank', label: 'إدارة بنك الأسئلة والاختبارات', group: 'المحاضرات' },
    { key: 'manage_practical_training', label: 'إدارة التربية العملية والمدارس الشريكة', group: 'الأكاديمي' },
    { key: 'manage_schedules', label: 'إدارة وتعديل الجداول الدراسية والقاعات', group: 'الأكاديمي' },
    { key: 'manage_college_announcements', label: 'نشر الإعلانات الرسمية على مستوى الكلية', group: 'الإعلانات' },
    { key: 'publish_group_announcements', label: 'نشر إعلانات للشعبة أو الفرقة المحددة', group: 'الإعلانات' },
    { key: 'upload_group_files', label: 'رفع ملفات وتسجيلات للشعبة والزملاء', group: 'المحتوى' },
    { key: 'moderate_community', label: 'إدارة منشورات المجتمع وحذف المخالفات', group: 'المحتوى' },
  ];

  // Dynamic permissions map per role
  const [rolePermissions, setRolePermissions] = useState<Record<Role | 'leader' | 'student_coordinator', PermissionKey[]>>({
    super_admin: [
      'manage_users',
      'manage_roles_permissions',
      'view_activity_logs',
      'manage_system_settings',
      'manage_all_departments',
      'manage_all_subjects',
      'manage_assigned_subjects',
      'upload_lecture_materials',
      'manage_question_bank',
      'manage_practical_training',
      'manage_schedules',
      'manage_college_announcements',
      'publish_group_announcements',
      'upload_group_files',
      'moderate_community',
    ],
    admin: [
      'manage_all_departments',
      'manage_all_subjects',
      'manage_practical_training',
      'manage_schedules',
      'manage_college_announcements',
      'moderate_community',
      'view_activity_logs',
    ],
    doctor: [
      'manage_assigned_subjects',
      'upload_lecture_materials',
      'manage_question_bank',
      'publish_group_announcements',
    ],
    coordinator: [
      'manage_practical_training',
      'manage_schedules',
      'publish_group_announcements',
      'upload_group_files',
    ],
    teacher: [
      'manage_assigned_subjects',
      'upload_lecture_materials',
      'manage_question_bank',
    ],
    student_coordinator: [
      'publish_group_announcements',
      'upload_group_files',
      'moderate_community',
    ],
    leader: [
      'publish_group_announcements',
      'upload_group_files',
    ],
    student: [],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle permission for a role
  const handleToggleRolePermission = (targetRole: Role | 'leader' | 'student_coordinator', permKey: PermissionKey) => {
    if (targetRole === 'super_admin') {
      showToast('لا يمكن تعطيل صلاحيات الـ Super Admin، فلديه صلاحية كاملة مطلقة.');
      return;
    }
    setRolePermissions((prev) => {
      const currentList = prev[targetRole] || [];
      const hasIt = currentList.includes(permKey);
      const updated = hasIt
        ? currentList.filter((k) => k !== permKey)
        : [...currentList, permKey];
      return { ...prev, [targetRole]: updated };
    });
    addActivityLog({
      actorName: currentUser.name,
      actorRole: 'super_admin',
      actionType: 'permission_updated',
      entityType: 'permission',
      entityId: permKey,
      entityName: permKey,
      details: `تحديث صلاحية (${permKey}) للدور (${targetRole})`,
      target: targetRole,
    });
    showToast(`تم تحديث الصلاحية بنجاح للدور: ${targetRole}`);
  };

  // Filtered Accounts
  const filteredAccounts = authAccounts.filter((acc) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      acc.profile.name.toLowerCase().includes(q) ||
      acc.email.toLowerCase().includes(q) ||
      acc.phone.includes(q) ||
      acc.nationalId.includes(q);

    const matchesRole = selectedRoleFilter === 'all' || acc.role === selectedRoleFilter;
    const matchesPosition =
      selectedPositionFilter === 'all' ||
      (selectedPositionFilter === 'normal' && (!acc.profile.studentPosition || acc.profile.studentPosition === 'normal')) ||
      acc.profile.studentPosition === selectedPositionFilter;

    return matchesQuery && matchesRole && matchesPosition;
  });

  // State for Safe In-App Deletion Confirmation (No window.confirm!)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'course' | 'schedule' | 'exam' | 'user';
    id: string;
    name: string;
  } | null>(null);

  // Handle Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة (الاسم الكامل والبريد الإلكتروني)');
      return;
    }

    try {
      const newId = `acc_${Date.now()}`;
      const newProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: newUserName.trim(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        email: newUserEmail.trim(),
        phone: newUserPhone.trim() || '01000000000',
        nationalId: newUserNationalId.trim() || '30000000000000',
        role: newUserRole,
        faculty: 'كلية التربية',
        department: 'قسم علم النفس التربوي والصحة النفسية',
        specialization: 'شعبة علم النفس',
        level: newUserRole === 'student' ? 'الفرقة الثالثة' : 'هيئة التدريس',
        academicYear: '2025 / 2026',
        studentId: `NAB-${Date.now().toString().slice(-4)}`,
        gpa: 3.8,
        totalCreditHours: 132,
        completedCreditHours: 90,
        studentPosition: newUserRole === 'student' ? newUserPosition : 'normal',
        studentPositions: [newUserRole === 'student' ? newUserPosition : 'normal'],
        permissions: [],
        status: 'active',
      };

      if (newUserRole === 'student' && newUserPosition !== 'normal') {
        newProfile.studentPositionDetails = {
          position: newUserPosition,
          title: newUserPositionTitle.trim() || (newUserPosition === 'leader' ? 'ليدر الشعبة' : 'منسق الدفعة'),
          scope: newUserPositionScope.trim() || 'الفرقة الثالثة',
          appointedBy: currentUser?.name || 'مدير المنصة العام',
          appointedAt: new Date().toLocaleDateString('ar-EG'),
          canUploadFiles: true,
          canUploadAudio: true,
          canAddLinks: true,
          canPublishAnnouncements: true,
          canSendNotifications: true,
          canEditGroupSchedule: true,
          canManageCommunity: true,
        };
      }

      await createNewUserAccount({
        id: newId,
        email: newUserEmail.trim(),
        phone: newUserPhone.trim() || '01000000000',
        nationalId: newUserNationalId.trim() || '30000000000000',
        password: newUserPassword.trim() || '123456',
        role: newUserRole,
        profile: newProfile,
      });

      setIsAddUserOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserNationalId('');
      setNewUserPassword('123456');
      showToast(`تم إنشاء حساب (${newUserName}) بنجاح وتفعيله.`);
    } catch (err: any) {
      console.error('Error creating user account:', err);
      showToast('حدث خطأ أثناء حفظ الحساب، يرجى المحاولة مرة أخرى.');
    }
  };

  // Helper openers for Edit Modals
  const handleOpenEditCourse = (subj: Subject) => {
    setEditingCourse(subj);
    setEditCourseName(subj.name);
    setEditCourseCode(subj.code);
    setEditCourseInstructor(subj.instructor);
    setEditCourseDept(subj.department);
    setEditCourseHours(subj.creditHours);
    setEditCourseRoom(subj.room);
    setEditCourseTime(subj.scheduleTime);
  };

  const handleOpenEditSchedule = (sch: ScheduleItem) => {
    setEditingSchedule(sch);
    setEditScheduleSubject(sch.subject);
    setEditScheduleInstructor(sch.instructor);
    setEditScheduleDay(sch.day);
    setEditScheduleStartTime(sch.startTime);
    setEditScheduleEndTime(sch.endTime);
    setEditScheduleRoom(sch.room);
    setEditScheduleType(sch.type as any || 'lecture');
  };

  const handleOpenEditExam = (ex: Exam) => {
    setEditingExam(ex);
    setExamSubjectName(ex.subjectName);
    setExamDate(ex.date);
    setExamDayArabic(ex.dayArabic);
    setExamTime(ex.time);
    setExamRoom(ex.room);
    setExamType(ex.type);
    setExamMaxScore(ex.maxScore || 20);
    setExamRemainingDays(ex.remainingDays);
  };

  const handleOpenEditUser = (acc: AuthAccount) => {
    setEditingUser(acc);
    setEditUserName(acc.profile.name);
    setEditUserEmail(acc.email || acc.profile.email);
    setEditUserPhone(acc.phone || acc.profile.phone || '');
    setEditUserNationalId(acc.nationalId || acc.profile.nationalId || '');
    setEditUserDept(acc.profile.department || 'قسم علم النفس التربوي');
    setEditUserLevel(acc.profile.level || 'الفرقة الثالثة');
    setEditUserSpecialization(acc.profile.specialization || 'عام');
  };

  // Execute Deletion safely without window.confirm
  const handleExecuteDelete = async () => {
    if (!deleteConfirmTarget) return;
    const { type, id, name } = deleteConfirmTarget;
    setDeleteConfirmTarget(null);

    try {
      if (type === 'course') {
        await removeSubject(id);
        showToast(`تم حذف مقرر (${name}) بنجاح.`);
      } else if (type === 'schedule') {
        await deleteScheduleItem(id);
        showToast(`تم حذف موعد (${name}) من الجدول بنجاح.`);
      } else if (type === 'exam') {
        await deleteExamItem(id);
        showToast(`تم حذف امتحان (${name}) بنجاح.`);
      } else if (type === 'user') {
        await deleteUserAccount(id);
        showToast(`تم حذف حساب (${name}) نهائياً.`);
      }
    } catch (e) {
      console.error('Delete error:', e);
      showToast('حدث خطأ أثناء تنفيذ الحذف.');
    }
  };

  // Save Handlers for Modals
  const handleSaveEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const updated: Subject = {
        ...editingCourse,
        name: editCourseName.trim(),
        code: editCourseCode.trim().toUpperCase(),
        instructor: editCourseInstructor.trim() || 'هيئة التدريس',
        department: editCourseDept,
        creditHours: Number(editCourseHours) || 3,
        room: editCourseRoom.trim() || 'مدرج 4',
        scheduleTime: editCourseTime.trim() || 'الأحد 09:00 ص',
      };
      await updateSubject(updated);
      setEditingCourse(null);
      showToast(`تم تعديل بيانات مقرر (${updated.name}) بنجاح.`);
    } catch (e) {
      console.error('Error updating course:', e);
      showToast('تعذر حفظ تعديلات المقرر.');
    }
  };

  const handleSaveEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;
    try {
      const dayMap: Record<string, string> = {
        Saturday: 'السبت',
        Sunday: 'الأحد',
        Monday: 'الإثنين',
        Tuesday: 'الثلاثاء',
        Wednesday: 'الأربعاء',
        Thursday: 'الخميس',
        Friday: 'الجمعة',
      };
      const updated: ScheduleItem = {
        ...editingSchedule,
        subject: editScheduleSubject.trim(),
        instructor: editScheduleInstructor.trim() || 'هيئة التدريس',
        day: editScheduleDay as any,
        dayArabic: dayMap[editScheduleDay] || 'الأحد',
        startTime: editScheduleStartTime.trim(),
        endTime: editScheduleEndTime.trim(),
        room: editScheduleRoom.trim() || 'مدرج 4',
        type: editScheduleType,
      };
      await updateScheduleItem(updated);
      setEditingSchedule(null);
      showToast(`تم تحديث موعد المحاضرة (${updated.subject}) بنجاح.`);
    } catch (e) {
      console.error('Error updating schedule:', e);
      showToast('تعذر حفظ تعديلات موعد الجدول.');
    }
  };

  const handleSaveEditExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    try {
      const updated: Exam = {
        ...editingExam,
        subjectName: examSubjectName.trim(),
        date: examDate.trim() || '2026-05-15',
        dayArabic: examDayArabic.trim() || 'الأحد',
        time: examTime.trim() || '09:00 ص - 11:00 ص',
        room: examRoom.trim() || 'مدرج 4',
        type: examType,
        maxScore: Number(examMaxScore) || 20,
        remainingDays: Number(examRemainingDays) || 0,
      };
      await updateExamItem(updated);
      setEditingExam(null);
      showToast(`تم تحديث موعد امتحان (${updated.subjectName}) بنجاح.`);
    } catch (e) {
      console.error('Error updating exam:', e);
      showToast('تعذر حفظ تعديلات الامتحان.');
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubjectName.trim()) return;
    try {
      const newExam: Exam = {
        id: `ex_${Date.now()}`,
        subjectId: 'sub_custom',
        subjectName: examSubjectName.trim(),
        date: examDate.trim() || '2026-05-15',
        dayArabic: examDayArabic.trim() || 'الأحد',
        time: examTime.trim() || '09:00 ص - 11:00 ص',
        room: examRoom.trim() || 'مدرج 4',
        type: examType,
        remainingDays: Number(examRemainingDays) || 14,
        maxScore: Number(examMaxScore) || 20,
      };
      await addExamItem(newExam);
      setIsAddExamOpen(false);
      setExamSubjectName('');
      showToast(`تمت إضافة موعد امتحان (${newExam.subjectName}) بنجاح.`);
    } catch (e) {
      console.error('Error creating exam:', e);
      showToast('تعذر إضافة الامتحان.');
    }
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const updated: UserProfile = {
        ...editingUser.profile,
        name: editUserName.trim(),
        email: editUserEmail.trim(),
        phone: editUserPhone.trim(),
        nationalId: editUserNationalId.trim(),
        department: editUserDept,
        level: editUserLevel,
        specialization: editUserSpecialization,
      };
      await updateUserProfile(updated);
      setEditingUser(null);
      showToast(`تم تحديث بيانات المستخدم (${updated.name}) بنجاح.`);
    } catch (e) {
      console.error('Error updating user:', e);
      showToast('تعذر تحديث بيانات المستخدم.');
    }
  };

  // Handle Save Position
  const handleSavePosition = () => {
    if (!editingUserForPosition) return;
    updateStudentPosition(editingUserForPosition, editPosRole, {
      title: editPosTitle,
      scope: editPosScope,
      appointedBy: currentUser.name,
    });
    setEditingUserForPosition(null);
    showToast('تم تحديث المنصب الطلابي بنجاح.');
  };

  return (
    <div className="space-y-6 pb-16 text-right font-['Cairo',sans-serif]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white dark:bg-purple-600 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black animate-bounce border border-purple-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Super Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>SUPER ADMIN — مدير المنصة العام والتحكم المركزي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2.5">
              <span>لوحة التحكم والسيطرة العليا — منصة نَبُوغ</span>
            </h1>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
              تحكم كامل في كافة مستخدمي المنظومة، الحسابات، الأدوار، المناصب الطلابية، الصلاحيات، سجلات النشاط، وإعدادات السيرفر دون أي قيود.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Global KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>إجمالي الحسابات</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {authAccounts.length}
          </div>
          <span className="text-[11px] text-purple-600 font-bold mt-1 block">نشطة بالكامل</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>الطلاب والمناصب</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 font-mono">
            {authAccounts.filter((a) => a.role === 'student').length}
          </div>
          <span className="text-[11px] text-slate-500 font-bold mt-1 block">
            منهم {authAccounts.filter((a) => a.profile.studentPosition && a.profile.studentPosition !== 'normal').length} ليدر ومنسق
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>أعضاء التدريس</span>
            <School className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-600 font-mono">
            {authAccounts.filter((a) => a.role === 'doctor' || a.role === 'teacher').length}
          </div>
          <span className="text-[11px] text-slate-500 font-bold mt-1 block">
            {subjects.length} مقررات دراسية
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>المنسقون والإدارة</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 font-mono">
            {authAccounts.filter((a) => a.role === 'coordinator' || a.role === 'admin' || a.role === 'super_admin').length}
          </div>
          <span className="text-[11px] text-slate-500 font-bold mt-1 block">تحكم إداري</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>سجل العمليات</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-500 font-mono">
            {activityLogs.length}
          </div>
          <span className="text-[11px] text-slate-500 font-bold mt-1 block">عملية مسجلة</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>دليل المستخدمين ({authAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>المقررات والمناهج ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'schedules'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الجداول الدراسية ({schedules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'exams'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جداول الامتحانات ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('positions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'positions'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>المناصب الطلابية (Leaders & Coordinators)</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'permissions'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>مصفوفة الصلاحيات (Permissions Matrix)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>سجل النشاطات (Activity Logs)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات النظام العامة</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث بالاسم، البريد، الهاتف، الرقم القومي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs text-slate-400 font-bold shrink-0">نوع الحساب (Role):</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value="all">كل الأدوار</option>
                <option value="super_admin">SUPER ADMIN</option>
                <option value="admin">ADMIN / الكلية</option>
                <option value="doctor">DOCTOR / هيئة تدريس</option>
                <option value="coordinator">COORDINATOR / منسق</option>
                <option value="student">STUDENT / طالب</option>
              </select>

              <span className="text-xs text-slate-400 font-bold shrink-0 mr-2">المنصب الطلابي:</span>
              <select
                value={selectedPositionFilter}
                onChange={(e) => setSelectedPositionFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value="all">كل المناصب</option>
                <option value="normal">طالب عادي</option>
                <option value="leader">ليدر شعبة (Leader)</option>
                <option value="student_coordinator">منسق دفعة (Student Coordinator)</option>
                <option value="assistant">مساعد تعليمي (Assistant)</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <tr className="text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 pr-5 font-bold">المستخدم</th>
                    <th className="py-3.5 pr-4 font-bold">الدور الأساسي (Account Role)</th>
                    <th className="py-3.5 pr-4 font-bold">المنصب الأكاديمي / الطلابي</th>
                    <th className="py-3.5 pr-4 font-bold">بيانات الاتصال</th>
                    <th className="py-3.5 pr-4 font-bold">الحالة</th>
                    <th className="py-3.5 pr-4 pl-5 font-bold text-center">إجراءات Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAccounts.map((acc) => {
                    const isSuper = acc.role === 'super_admin';
                    const isSuspended = acc.profile.status === 'suspended';

                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        {/* User info */}
                        <td className="py-3.5 pr-5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={acc.profile.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {acc.profile.name}
                                </span>
                                {isSuper && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {acc.profile.studentId || acc.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Account Role */}
                        <td className="py-3.5 pr-4">
                          <select
                            disabled={isSuper}
                            value={acc.role}
                            onChange={(e) => {
                              updateUserRole(acc.profile.id, e.target.value as Role);
                              showToast(`تم تغيير دور ${acc.profile.name} إلى ${e.target.value}`);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition ${
                              acc.role === 'super_admin'
                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300'
                                : acc.role === 'admin'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                                : acc.role === 'doctor'
                                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300'
                                : acc.role === 'coordinator'
                                ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200'
                                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200'
                            }`}
                          >
                            <option value="super_admin">SUPER ADMIN</option>
                            <option value="admin">ADMIN (كلية)</option>
                            <option value="doctor">DOCTOR (أستاذ)</option>
                            <option value="coordinator">COORDINATOR (منسق)</option>
                            <option value="student">STUDENT (طالب)</option>
                          </select>
                        </td>

                        {/* Student Position */}
                        <td className="py-3.5 pr-4">
                          {acc.role === 'student' ? (
                            <button
                              onClick={() => {
                                setEditingUserForPosition(acc.profile.id);
                                setEditPosRole(acc.profile.studentPosition || 'normal');
                                setEditPosTitle(acc.profile.studentPositionDetails?.title || '');
                                setEditPosScope(acc.profile.studentPositionDetails?.scope || '');
                              }}
                              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition hover:border-purple-400"
                            >
                              {acc.profile.studentPosition === 'leader' ? (
                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <Crown className="w-3 h-3 text-amber-500" />
                                  <span>{acc.profile.studentPositionDetails?.title || 'ليدر شعبة'}</span>
                                </span>
                              ) : acc.profile.studentPosition === 'student_coordinator' ? (
                                <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                  <Briefcase className="w-3 h-3 text-purple-500" />
                                  <span>{acc.profile.studentPositionDetails?.title || 'منسق دفعة'}</span>
                                </span>
                              ) : acc.profile.studentPosition === 'assistant' ? (
                                <span className="text-blue-600 dark:text-blue-400">مساعد تعليمي</span>
                              ) : (
                                <span className="text-slate-500">طالب عادي</span>
                              )}
                              <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {acc.profile.specialization || acc.profile.department}
                            </span>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 pr-4">
                          <span className="font-mono text-slate-800 dark:text-slate-200 block">
                            {acc.email}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {acc.phone} • {acc.nationalId}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isSuspended
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {isSuspended ? 'معطل' : 'مفعل نشط'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pr-4 pl-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(acc)}
                              className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                              title="تعديل بيانات المستخدم"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {!isSuper && (
                              <>
                                <button
                                  onClick={() => {
                                    toggleUserStatus(acc.profile.id);
                                    showToast(`تم تغيير حالة الحساب إلى ${isSuspended ? 'مفعل' : 'معطل'}`);
                                  }}
                                  className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                                    isSuspended
                                      ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                                      : 'text-amber-600 hover:bg-amber-50 border-amber-200'
                                  }`}
                                  title={isSuspended ? 'تفعيل الحساب' : 'تعطيل الحساب'}
                                >
                                  {isSuspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                </button>

                                <button
                                  onClick={() => {
                                    setDeleteConfirmTarget({
                                      type: 'user',
                                      id: acc.profile.id,
                                      name: acc.profile.name,
                                    });
                                  }}
                                  className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                  title="حذف الحساب نهائياً"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT POSITIONS MANAGEMENT */}
      {activeTab === 'positions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span>إدارة المناصب الطلابية المستقلة (Student Positions Engine)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  فصل تام بين نوع الحساب الأساسي (Student Role) والمنصب الميداني (Leader / Student Coordinator / Assistant).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Leader Card Overview */}
              <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>ليدر المجموعة / الشعبة (LEADER)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">نطاق محدد</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  طالب مسؤول عن مجموعته أو شعبته (مثال: ليدر الفرقة الثالثة - شعبة 2). يملك صلاحيات:
                </p>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>نشر إعلانات وتنبيهات مخصصة لطلاب الشعبة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>رفع ملفات وتسجيلات المحاضرات المشتركة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>مشاركة روابط المحاضرات وتنظيم مجتمع الشعبة</span>
                  </li>
                </ul>
              </div>

              {/* Coordinator Card Overview */}
              <div className="p-5 rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-600 text-white flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>منسق الفرقة / القسم (STUDENT COORDINATOR)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">نطاق أكاديمي</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  طالب يتم تعيينه رسمياً لمساعدة وتنظيم الطلاب على مستوى الفرقة أو القسم بالكامل.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>تحديث بيانات المحاضرات وإرسال تنبيهات عامة للفرقة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>رفع التسجيلات الصوتية ومواد المراجعة المعتمدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>محظور عليه: حذف الطلاب، تغيير الأدوار، أو تعديل إعدادات النظام</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Current Appointed Student Leaders List */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                قائمة الطلاب المعينين حالياً في مناصب قيادية:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {authAccounts
                  .filter((a) => a.role === 'student' && a.profile.studentPosition && a.profile.studentPosition !== 'normal')
                  .map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.profile.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {acc.profile.name}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                              {acc.profile.studentPositionDetails?.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            النطاق: {acc.profile.studentPositionDetails?.scope}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            تم التعيين بواسطة: {acc.profile.studentPositionDetails?.appointedBy || 'الإدارة'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingUserForPosition(acc.profile.id);
                          setEditPosRole(acc.profile.studentPosition || 'normal');
                          setEditPosTitle(acc.profile.studentPositionDetails?.title || '');
                          setEditPosScope(acc.profile.studentPositionDetails?.scope || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 transition"
                      >
                        تعديل المنصب
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                <span>مصفوفة الصلاحيات المرنة (Dynamic Permissions Matrix)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تحديد الصلاحيات بدقة لكل دور أساسي أو منصب طلابي في المنصة. يملك Super Admin كافة الصلاحيات بشكل دائم.
              </p>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">الصلاحية</th>
                    <th className="py-3 px-3 font-bold text-purple-700 dark:text-purple-300 text-center">Super Admin</th>
                    <th className="py-3 px-3 font-bold text-emerald-700 dark:text-emerald-300 text-center">Admin (الكلية)</th>
                    <th className="py-3 px-3 font-bold text-indigo-700 dark:text-indigo-300 text-center">Doctor (الأستاذ)</th>
                    <th className="py-3 px-3 font-bold text-purple-600 dark:text-purple-400 text-center">Coordinator</th>
                    <th className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400 text-center">Student Leader</th>
                    <th className="py-3 px-3 font-bold text-purple-500 text-center">Student Coord</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allPermissionsList.map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-200">
                        <div className="font-bold">{perm.label}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{perm.key}</span>
                      </td>

                      {/* Super Admin Always checked */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block p-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      </td>

                      {/* Admin */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleRolePermission('admin', perm.key)}
                          className="hover:scale-110 transition"
                        >
                          {rolePermissions.admin.includes(perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>

                      {/* Doctor */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleRolePermission('doctor', perm.key)}
                          className="hover:scale-110 transition"
                        >
                          {rolePermissions.doctor.includes(perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>

                      {/* Coordinator */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleRolePermission('coordinator', perm.key)}
                          className="hover:scale-110 transition"
                        >
                          {rolePermissions.coordinator.includes(perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-purple-600 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>

                      {/* Leader */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleRolePermission('leader', perm.key)}
                          className="hover:scale-110 transition"
                        >
                          {rolePermissions.leader.includes(perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-amber-500 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>

                      {/* Student Coordinator */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleRolePermission('student_coordinator', perm.key)}
                          className="hover:scale-110 transition"
                        >
                          {rolePermissions.student_coordinator.includes(perm.key) ? (
                            <CheckCircle2 className="w-4 h-4 text-purple-500 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES & CURRICULUM */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <School className="w-5 h-5 text-purple-600" />
                  <span>إدارة المقررات الدراسية والمناهج ({subjects.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  إضافة وتعديل وحذف المقررات، إسناد الأساتذة، القاعات، والساعات المعتمدة
                </p>
              </div>

              <button
                onClick={() => setIsAddCourseOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition shadow-md shadow-purple-500/25 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مقرر جديد</span>
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-bold">كود المقرر</th>
                    <th className="py-3 px-4 font-bold">اسم المقرر</th>
                    <th className="py-3 px-4 font-bold">القسم الأكاديمي</th>
                    <th className="py-3 px-4 font-bold">أستاذ المادة</th>
                    <th className="py-3 px-4 font-bold">الساعات</th>
                    <th className="py-3 px-4 font-bold">القاعة والموعد</th>
                    <th className="py-3 px-4 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subjects.map((subj) => (
                    <tr key={subj.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                        {subj.code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {subj.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {subj.department}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {subj.instructor}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {subj.creditHours} س
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {subj.room} • {subj.scheduleTime}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCourse(subj)}
                            className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                            title="تعديل المقرر"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmTarget({
                                type: 'course',
                                id: subj.id,
                                name: subj.name,
                              });
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="حذف المقرر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULES & TIMETABLES */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>إدارة الجداول الدراسية والمحاضرات ({schedules.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  تعديل مواعيد المحاضرات الأسبوعية، القاعات، والمجموعات الدراسية
                </p>
              </div>

              <button
                onClick={() => setIsAddScheduleOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition shadow-md shadow-blue-500/25 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موعد في الجدول</span>
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-bold">اليوم</th>
                    <th className="py-3 px-4 font-bold">المقرر الدراسي</th>
                    <th className="py-3 px-4 font-bold">المحاضر</th>
                    <th className="py-3 px-4 font-bold">التوقيت</th>
                    <th className="py-3 px-4 font-bold">القاعة</th>
                    <th className="py-3 px-4 font-bold">النوع</th>
                    <th className="py-3 px-4 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {schedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-purple-600">
                        {sch.dayArabic}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {sch.subject}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {sch.instructor}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {sch.startTime} - {sch.endTime}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {sch.room}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                          {sch.type === 'lecture' ? 'محاضرة' : sch.type === 'section' ? 'سكشن' : 'معمل'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditSchedule(sch)}
                            className="p-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                            title="تعديل موعد الجدول"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmTarget({
                                type: 'schedule',
                                id: sch.id,
                                name: `${sch.subject} (${sch.dayArabic})`,
                              });
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="حذف من الجدول"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3.5: EXAMS & ASSESSMENTS */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>إدارة جداول الامتحانات والاختبارات ({exams.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  إضافة وتعديل وحذف مواعيد الامتحانات النصفية والنهائية، القاعات، والدرجات
                </p>
              </div>

              <button
                onClick={() => setIsAddExamOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-md shadow-indigo-500/25 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موعد امتحان جديد</span>
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-bold">اسم المقرر</th>
                    <th className="py-3 px-4 font-bold">نوع الامتحان</th>
                    <th className="py-3 px-4 font-bold">اليوم والتاريخ</th>
                    <th className="py-3 px-4 font-bold">التوقيت</th>
                    <th className="py-3 px-4 font-bold">القاعة</th>
                    <th className="py-3 px-4 font-bold">الدرجة العظمى</th>
                    <th className="py-3 px-4 font-bold">المتبقي</th>
                    <th className="py-3 px-4 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {ex.subjectName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ex.type === 'final'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : ex.type === 'midterm'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {ex.type === 'final' ? 'امتحان نهائي' : ex.type === 'midterm' ? 'امتحان نصفي' : ex.type === 'quiz' ? 'كويز فصلي' : 'عملي'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {ex.dayArabic} • <span className="font-mono text-slate-500">{ex.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {ex.time}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {ex.room}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {ex.maxScore || 20} درجة
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {ex.remainingDays} يوم
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditExam(ex)}
                            className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                            title="تعديل موعد الامتحان"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmTarget({
                                type: 'exam',
                                id: ex.id,
                                name: `${ex.subjectName} (${ex.dayArabic})`,
                              });
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="حذف الامتحان"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY LOGS AUDIT DASHBOARD */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  <span>سجل العمليات والرقابة الفورية (Activity Logs Audit Trail)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  سجل غير قابل للتعديل (Append-Only) يسجل بدقة كل إجراء إداري، تغيير صلاحية، وتعديل بيانات
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  إجمالي العمليات: <strong className="text-amber-500 font-mono">{activityLogs.length}</strong>
                </span>
              </div>
            </div>

            {/* Filter Bar (Search, User, Role, Action, Entity) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={logSearchQuery}
                  onChange={(e) => {
                    setLogSearchQuery(e.target.value);
                    setLogPage(1);
                  }}
                  placeholder="بحث في العمليات والتفاصيل..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none pr-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Role Filter */}
              <select
                value={logRoleFilter}
                onChange={(e) => {
                  setLogRoleFilter(e.target.value);
                  setLogPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">كافة الأدوار (Roles)</option>
                <option value="super_admin">SUPER_ADMIN</option>
                <option value="admin">ADMIN</option>
                <option value="doctor">DOCTOR</option>
                <option value="coordinator">COORDINATOR</option>
                <option value="student">STUDENT</option>
              </select>

              {/* Action Filter */}
              <select
                value={logActionFilter}
                onChange={(e) => {
                  setLogActionFilter(e.target.value);
                  setLogPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">كافة العمليات (Actions)</option>
                <option value="LOGIN">LOGIN</option>
                <option value="STUDENT_REGISTER">STUDENT_REGISTER</option>
                <option value="ROLE_CHANGED">ROLE_CHANGED</option>
                <option value="POSITION_ASSIGNED">POSITION_ASSIGNED</option>
                <option value="COURSE_CREATED">COURSE_CREATED</option>
                <option value="COURSE_DELETED">COURSE_DELETED</option>
                <option value="LECTURE_SAVED">LECTURE_SAVED</option>
                <option value="SCHEDULE_UPDATED">SCHEDULE_UPDATED</option>
                <option value="PERMISSIONS_UPDATED">PERMISSIONS_UPDATED</option>
                <option value="SETTINGS_CHANGED">SETTINGS_CHANGED</option>
              </select>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setLogSearchQuery('');
                  setLogRoleFilter('all');
                  setLogActionFilter('all');
                  setLogEntityFilter('all');
                  setLogPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>

            {/* Filtered Logs List */}
            {(() => {
              const filtered = activityLogs.filter((log) => {
                const q = logSearchQuery.trim().toLowerCase();
                const matchesQ =
                  !q ||
                  log.actorName.toLowerCase().includes(q) ||
                  log.details.toLowerCase().includes(q) ||
                  (log.entityName && log.entityName.toLowerCase().includes(q)) ||
                  (log.actionType && log.actionType.toLowerCase().includes(q));

                const matchesRole = logRoleFilter === 'all' || log.actorRole === logRoleFilter;
                const matchesAction =
                  logActionFilter === 'all' ||
                  log.actionType === logActionFilter ||
                  (log as any).action === logActionFilter;

                return matchesQ && matchesRole && matchesAction;
              });

              const pageSize = 10;
              const totalPages = Math.ceil(filtered.length / pageSize) || 1;
              const currentLogs = filtered.slice((logPage - 1) * pageSize, logPage * pageSize);

              if (filtered.length === 0) {
                return (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      لم يتم العثور على عمليات مطابقة للفلاتر المحددة
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-2.5">
                  {currentLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLogDetail(log)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-600 transition cursor-pointer flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {log.actorName}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              log.actorRole === 'super_admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                : log.actorRole === 'admin'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : log.actorRole === 'doctor'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}
                          >
                            {log.actorRole.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                            {log.actionType || (log as any).action}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {log.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {log.details}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          {log.entityName && (
                            <span>
                              الكيان: <strong className="text-purple-600 dark:text-purple-400">{log.entityName}</strong>
                            </span>
                          )}
                          {log.scope && (
                            <span>
                              النطاق: <strong className="text-blue-600 dark:text-blue-400">{log.scope}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:-translate-x-1 transition shrink-0">
                        <span>التفاصيل</span>
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 font-semibold">
                      صفحة {logPage} من {totalPages} ({filtered.length} سجل)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={logPage <= 1}
                        onClick={() => setLogPage((p) => p - 1)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        السابق
                      </button>
                      <button
                        disabled={logPage >= totalPages}
                        onClick={() => setLogPage((p) => p + 1)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ACTIVITY LOG DETAIL MODAL */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  تفاصيل سجل العملية (Activity Details)
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 font-bold">المستخدم المنفذ (Actor):</span>
                <span className="font-black text-slate-900 dark:text-white">{selectedLogDetail.actorName}</span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 font-bold">الدور (Role):</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                  {selectedLogDetail.actorRole}
                </span>
              </div>

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 font-bold">نوع العملية (Action):</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {selectedLogDetail.actionType || (selectedLogDetail as any).action}
                </span>
              </div>

              {selectedLogDetail.entityName && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold">الكيان المتأثر (Entity):</span>
                  <span className="font-bold text-blue-600">{selectedLogDetail.entityName}</span>
                </div>
              )}

              {selectedLogDetail.scope && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold">النطاق الأكاديمي (Scope):</span>
                  <span className="font-bold text-emerald-600">{selectedLogDetail.scope}</span>
                </div>
              )}

              {selectedLogDetail.previousValue && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold">القيمة السابقة (Before):</span>
                  <span className="font-mono text-rose-500 line-through">{selectedLogDetail.previousValue}</span>
                </div>
              )}

              {selectedLogDetail.newValue && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-bold">القيمة الجديدة (After):</span>
                  <span className="font-mono font-bold text-emerald-500">{selectedLogDetail.newValue}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 font-bold">التوقيت والتاريخ:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLogDetail.timestamp}</span>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 font-bold block mb-1">البيان الكامل (Details):</span>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  {selectedLogDetail.details}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>🔒 سجل تدقيق آمن في Cloud Firestore (غير قابل للتعديل)</span>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURSE */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">إضافة مقرر دراسي جديد</h3>
              <button onClick={() => setIsAddCourseOpen(false)} className="p-1 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCourseName.trim() || !newCourseCode.trim()) return;

                const newCourse = {
                  id: `sub_${Date.now()}`,
                  code: newCourseCode.trim().toUpperCase(),
                  name: newCourseName.trim(),
                  instructor: newCourseInstructor.trim() || 'هيئة التدريس',
                  department: newCourseDept,
                  creditHours: Number(newCourseHours) || 3,
                  room: newCourseRoom.trim() || 'مدرج 1',
                  scheduleTime: newCourseTime.trim() || 'الأحد 09:00 ص',
                  color: 'from-purple-600 to-indigo-700',
                  progress: 0,
                  description: `مقرر ${newCourseName.trim()} لكلية التربية`,
                  totalLectures: 12,
                  completedLectures: 0,
                  totalFiles: 0,
                  iconName: 'BookOpen',
                };

                await addSubject(newCourse);
                showToast(`تمت إضافة مقرر (${newCourse.name}) بنجاح`);
                setIsAddCourseOpen(false);
                setNewCourseName('');
                setNewCourseCode('');
                setNewCourseInstructor('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold block mb-1">اسم المقرر</label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="مثال: علم النفس المعرفي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">كود المقرر</label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="PSY-305"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">الساعات المعتمدة</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">أستاذ المادة</label>
                <input
                  type="text"
                  value={newCourseInstructor}
                  onChange={(e) => setNewCourseInstructor(e.target.value)}
                  placeholder="أ.د. عصام الشناوي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">القاعة</label>
                  <input
                    type="text"
                    value={newCourseRoom}
                    onChange={(e) => setNewCourseRoom(e.target.value)}
                    placeholder="مدرج 4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">الموعد</label>
                  <input
                    type="text"
                    value={newCourseTime}
                    onChange={(e) => setNewCourseTime(e.target.value)}
                    placeholder="الأحد 09:00 ص"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  حفظ المقرر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SCHEDULE ITEM */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">إضافة موعد في الجدول الدراسي</h3>
              <button onClick={() => setIsAddScheduleOpen(false)} className="p-1 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newScheduleSubject.trim()) return;

                const dayMap: Record<string, string> = {
                  Saturday: 'السبت',
                  Sunday: 'الأحد',
                  Monday: 'الإثنين',
                  Tuesday: 'الثلاثاء',
                  Wednesday: 'الأربعاء',
                  Thursday: 'الخميس',
                };

                const newSchItem = {
                  id: `sch_${Date.now()}`,
                  subject: newScheduleSubject.trim(),
                  subjectId: 'sub_custom',
                  instructor: newScheduleInstructor.trim() || 'هيئة التدريس',
                  room: newScheduleRoom.trim() || 'مدرج 1',
                  day: newScheduleDay as any,
                  dayArabic: dayMap[newScheduleDay] || 'الأحد',
                  startTime: newScheduleStartTime.trim(),
                  endTime: newScheduleEndTime.trim(),
                  duration: 'ساعتان',
                  type: newScheduleType,
                };

                await addScheduleItem(newSchItem);
                showToast(`تمت إضافة موعد في جدول ${newSchItem.dayArabic}`);
                setIsAddScheduleOpen(false);
                setNewScheduleSubject('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold block mb-1">المقرر الدراسي</label>
                <input
                  type="text"
                  required
                  value={newScheduleSubject}
                  onChange={(e) => setNewScheduleSubject(e.target.value)}
                  placeholder="علم النفس التربوي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">اليوم</label>
                  <select
                    value={newScheduleDay}
                    onChange={(e) => setNewScheduleDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Saturday">السبت</option>
                    <option value="Sunday">الأحد</option>
                    <option value="Monday">الإثنين</option>
                    <option value="Tuesday">الثلاثاء</option>
                    <option value="Wednesday">الأربعاء</option>
                    <option value="Thursday">الخميس</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">النوع</label>
                  <select
                    value={newScheduleType}
                    onChange={(e) => setNewScheduleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="lecture">محاضرة</option>
                    <option value="section">سكشن</option>
                    <option value="lab">معمل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">وقت البدء</label>
                  <input
                    type="text"
                    value={newScheduleStartTime}
                    onChange={(e) => setNewScheduleStartTime(e.target.value)}
                    placeholder="09:00 ص"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">وقت الانتهاء</label>
                  <input
                    type="text"
                    value={newScheduleEndTime}
                    onChange={(e) => setNewScheduleEndTime(e.target.value)}
                    placeholder="11:00 ص"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">القاعة / المدرج</label>
                  <input
                    type="text"
                    value={newScheduleRoom}
                    onChange={(e) => setNewScheduleRoom(e.target.value)}
                    placeholder="مدرج 4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">المحاضر</label>
                  <input
                    type="text"
                    value={newScheduleInstructor}
                    onChange={(e) => setNewScheduleInstructor(e.target.value)}
                    placeholder="د. أحمد رمضان"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  حفظ الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM & PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <span>إعدادات النظام والمنصة العامة (Platform Master Settings)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                التحكم المركزي في سلوك الخادم والتسجيل وحصص التخزين
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  العام الأكاديمي النشط
                </span>
                <input
                  type="text"
                  value={platformSettings.currentAcademicYear}
                  onChange={(e) => updatePlatformSettings({ currentAcademicYear: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  الفصل الدراسي الحالي
                </span>
                <input
                  type="text"
                  value={platformSettings.currentSemester}
                  onChange={(e) => updatePlatformSettings({ currentSemester: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    فتح التسجيل الذاتي للطلاب
                  </span>
                  <span className="text-[11px] text-slate-400">
                    السماح للطلاب الجدد بإنشاء حسابات عبر الرقم القومي
                  </span>
                </div>
                <button
                  onClick={() => {
                    updatePlatformSettings({ studentRegistrationOpen: !platformSettings.studentRegistrationOpen });
                    showToast('تم تحديث حالة التسجيل');
                  }}
                  className={`p-2 rounded-xl text-xs font-black transition ${
                    platformSettings.studentRegistrationOpen ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {platformSettings.studentRegistrationOpen ? 'مفعل' : 'معطل'}
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    سماح بنشر إعلانات الليدرز والمنسقين
                  </span>
                  <span className="text-[11px] text-slate-400">
                    تمكين طلاب المناصب القيادية من إرسال إعلانات للشعب
                  </span>
                </div>
                <button
                  onClick={() => {
                    updatePlatformSettings({ allowLeaderAnnouncements: !platformSettings.allowLeaderAnnouncements });
                    showToast('تم تحديث صلاحية إعلانات الطلاب');
                  }}
                  className={`p-2 rounded-xl text-xs font-black transition ${
                    platformSettings.allowLeaderAnnouncements ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {platformSettings.allowLeaderAnnouncements ? 'مفعل' : 'معطل'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER ACCOUNT */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>إنشاء حساب جديد في منظومة نَبُوغ</span>
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثال: د. هاني محمود أو الطالب خالد عادل"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    البريد الإلكتروني / Login ID
                  </label>
                  <input
                    type="text"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@nabough.edu"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    كلمة المرور
                  </label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    رقم الهاتف المحمول
                  </label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    الرقم القومي (14 رقمًا)
                  </label>
                  <input
                    type="text"
                    value={newUserNationalId}
                    onChange={(e) => setNewUserNationalId(e.target.value)}
                    placeholder="30000000000000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  الدور الأساسي (Account Role)
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none"
                >
                  <option value="student">STUDENT — طالب</option>
                  <option value="doctor">DOCTOR — أستاذ / عضو هيئة تدريس</option>
                  <option value="coordinator">COORDINATOR — منسق أكاديمي/إداري</option>
                  <option value="admin">ADMIN — إدارة الكلية والعمادة</option>
                  <option value="super_admin">SUPER ADMIN — مدير المنصة العام</option>
                </select>
              </div>

              {newUserRole === 'student' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                    المنصب الطلابي الإضافي (Student Position)
                  </span>
                  <select
                    value={newUserPosition}
                    onChange={(e) => setNewUserPosition(e.target.value as StudentPosition)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="normal">طالب عادي (بدون صلاحيات إدارية)</option>
                    <option value="leader">ليدر مجموعة / شعبة (LEADER)</option>
                    <option value="student_coordinator">منسق فرقة / قسم (STUDENT COORDINATOR)</option>
                    <option value="assistant">مساعد تعليمي (ASSISTANT)</option>
                  </select>

                  {newUserPosition !== 'normal' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="المسمى (مثال: ليدر شعبة 2)"
                        value={newUserPositionTitle}
                        onChange={(e) => setNewUserPositionTitle(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="النطاق (مثال: الفرقة الثالثة)"
                        value={newUserPositionScope}
                        onChange={(e) => setNewUserPositionScope(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/25 transition"
                >
                  تأكيد وإنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STUDENT POSITION */}
      {editingUserForPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>تعديل المنصب الطلابي</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المنصب
                </label>
                <select
                  value={editPosRole}
                  onChange={(e) => setEditPosRole(e.target.value as StudentPosition)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
                >
                  <option value="normal">طالب عادي</option>
                  <option value="leader">ليدر مجموعة / شعبة (LEADER)</option>
                  <option value="student_coordinator">منسق فرقة / قسم (STUDENT COORDINATOR)</option>
                  <option value="assistant">مساعد تعليمي (ASSISTANT)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  المسمى الرسمي
                </label>
                <input
                  type="text"
                  value={editPosTitle}
                  onChange={(e) => setEditPosTitle(e.target.value)}
                  placeholder="مثال: ليدر شعبة علم النفس 2"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نطاق الصلاحيات والمجموعة
                </label>
                <input
                  type="text"
                  value={editPosScope}
                  onChange={(e) => setEditPosScope(e.target.value)}
                  placeholder="مثال: الفرقة الثالثة — قاعة 201"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingUserForPosition(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSavePosition}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/25 transition"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COURSE */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-600" />
                <span>تعديل بيانات المقرر الدراسي</span>
              </h3>
              <button onClick={() => setEditingCourse(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">اسم المقرر</label>
                <input
                  type="text"
                  required
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">كود المقرر</label>
                  <input
                    type="text"
                    required
                    value={editCourseCode}
                    onChange={(e) => setEditCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">الساعات المعتمدة</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editCourseHours}
                    onChange={(e) => setEditCourseHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">أستاذ المادة</label>
                <input
                  type="text"
                  value={editCourseInstructor}
                  onChange={(e) => setEditCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">القسم الأكاديمي</label>
                <input
                  type="text"
                  value={editCourseDept}
                  onChange={(e) => setEditCourseDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">القاعة / المدرج</label>
                  <input
                    type="text"
                    value={editCourseRoom}
                    onChange={(e) => setEditCourseRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">الموعد والتوقيت</label>
                  <input
                    type="text"
                    value={editCourseTime}
                    onChange={(e) => setEditCourseTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SCHEDULE */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <span>تعديل موعد في الجدول الدراسي</span>
              </h3>
              <button onClick={() => setEditingSchedule(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">المقرر الدراسي</label>
                <input
                  type="text"
                  required
                  value={editScheduleSubject}
                  onChange={(e) => setEditScheduleSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">اليوم</label>
                  <select
                    value={editScheduleDay}
                    onChange={(e) => setEditScheduleDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="Saturday">السبت</option>
                    <option value="Sunday">الأحد</option>
                    <option value="Monday">الإثنين</option>
                    <option value="Tuesday">الثلاثاء</option>
                    <option value="Wednesday">الأربعاء</option>
                    <option value="Thursday">الخميس</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">النوع</label>
                  <select
                    value={editScheduleType}
                    onChange={(e) => setEditScheduleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="lecture">محاضرة</option>
                    <option value="section">سكشن</option>
                    <option value="lab">معمل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">وقت البدء</label>
                  <input
                    type="text"
                    value={editScheduleStartTime}
                    onChange={(e) => setEditScheduleStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">وقت الانتهاء</label>
                  <input
                    type="text"
                    value={editScheduleEndTime}
                    onChange={(e) => setEditScheduleEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">القاعة / المدرج</label>
                  <input
                    type="text"
                    value={editScheduleRoom}
                    onChange={(e) => setEditScheduleRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">المحاضر</label>
                  <input
                    type="text"
                    value={editScheduleInstructor}
                    onChange={(e) => setEditScheduleInstructor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXAM */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>إضافة موعد امتحان جديد</span>
              </h3>
              <button onClick={() => setIsAddExamOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">اسم المقرر الدراسي</label>
                <input
                  type="text"
                  required
                  value={examSubjectName}
                  onChange={(e) => setExamSubjectName(e.target.value)}
                  placeholder="مثال: علم النفس التربوي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">نوع الامتحان</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="midterm">امتحان نصفي (Midterm)</option>
                    <option value="final">امتحان نهائي (Final)</option>
                    <option value="quiz">كويز فصلي (Quiz)</option>
                    <option value="practical">عملي (Practical)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">الدرجة العظمى</label>
                  <input
                    type="number"
                    value={examMaxScore}
                    onChange={(e) => setExamMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">اليوم باللغة العربية</label>
                  <input
                    type="text"
                    value={examDayArabic}
                    onChange={(e) => setExamDayArabic(e.target.value)}
                    placeholder="الأحد"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">التاريخ (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    placeholder="2026-05-15"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">التوقيت والمدة</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    placeholder="09:00 ص - 11:00 ص"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">القاعة / اللجنة</label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    placeholder="مدرج 4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">الأيام المتبقية حتى الامتحان</label>
                <input
                  type="number"
                  value={examRemainingDays}
                  onChange={(e) => setExamRemainingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  حفظ الامتحان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EXAM */}
      {editingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                <span>تعديل موعد الامتحان</span>
              </h3>
              <button onClick={() => setEditingExam(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditExam} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">اسم المقرر الدراسي</label>
                <input
                  type="text"
                  required
                  value={examSubjectName}
                  onChange={(e) => setExamSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">نوع الامتحان</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="midterm">امتحان نصفي (Midterm)</option>
                    <option value="final">امتحان نهائي (Final)</option>
                    <option value="quiz">كويز فصلي (Quiz)</option>
                    <option value="practical">عملي (Practical)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">الدرجة العظمى</label>
                  <input
                    type="number"
                    value={examMaxScore}
                    onChange={(e) => setExamMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">اليوم باللغة العربية</label>
                  <input
                    type="text"
                    value={examDayArabic}
                    onChange={(e) => setExamDayArabic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">التاريخ</label>
                  <input
                    type="text"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">التوقيت والمدة</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">القاعة / اللجنة</label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">الأيام المتبقية حتى الامتحان</label>
                <input
                  type="number"
                  value={examRemainingDays}
                  onChange={(e) => setExamRemainingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER ACCOUNT */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-600" />
                <span>تعديل بيانات المستخدم ({editingUser.profile.name})</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editUserPhone}
                    onChange={(e) => setEditUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">الرقم القومي (14 رقم)</label>
                <input
                  type="text"
                  value={editUserNationalId}
                  onChange={(e) => setEditUserNationalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">القسم</label>
                  <input
                    type="text"
                    value={editUserDept}
                    onChange={(e) => setEditUserDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">المستوى / الفرقة</label>
                  <input
                    type="text"
                    value={editUserLevel}
                    onChange={(e) => setEditUserLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">الشعبة / التخصص</label>
                <input
                  type="text"
                  value={editUserSpecialization}
                  onChange={(e) => setEditUserSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold"
                >
                  حفظ بيانات المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SAFE IN-APP DELETE CONFIRMATION (NO window.confirm!) */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-['Cairo',sans-serif]">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 text-right space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  تأكيد الحذف النهائي
                </h3>
                <span className="text-[11px] text-slate-500">
                  {deleteConfirmTarget.type === 'course' && 'حذف مقرر دراسي'}
                  {deleteConfirmTarget.type === 'schedule' && 'حذف موعد في الجدول'}
                  {deleteConfirmTarget.type === 'exam' && 'حذف موعد امتحان'}
                  {deleteConfirmTarget.type === 'user' && 'حذف حساب مستخدم'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              هل أنت متأكد من حذف <strong className="text-rose-600 dark:text-rose-400">({deleteConfirmTarget.name})</strong> نهائياً من المنصة وقاعدة البيانات؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/25 transition"
              >
                نعم، تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
