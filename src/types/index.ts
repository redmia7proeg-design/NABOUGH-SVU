export type Role = 'student' | 'doctor' | 'coordinator' | 'admin' | 'super_admin' | 'teacher';

export type StudentPosition = 'normal' | 'student_coordinator' | 'leader' | 'assistant';

export interface StudentPositionDetails {
  position: StudentPosition;
  title: string;
  scope: string;
  section?: string;
  appointedBy?: string;
  appointedAt?: string;
  canUploadFiles?: boolean;
  canUploadAudio?: boolean;
  canAddLinks?: boolean;
  canPublishAnnouncements?: boolean;
  canSendNotifications?: boolean;
  canEditGroupSchedule?: boolean;
  canManageCommunity?: boolean;
}

export type PermissionKey =
  | 'manage_users'
  | 'manage_roles_permissions'
  | 'manage_system_settings'
  | 'view_activity_logs'
  | 'manage_all_departments'
  | 'manage_all_subjects'
  | 'manage_college_announcements'
  | 'manage_practical_training'
  | 'manage_schedules'
  | 'manage_exams'
  | 'manage_assigned_subjects'
  | 'upload_lecture_materials'
  | 'manage_question_bank'
  | 'manage_student_positions'
  | 'publish_group_announcements'
  | 'upload_group_files'
  | 'moderate_community';

export interface ActivityLog {
  id: string;
  timestamp: string;
  createdAtIso?: string;
  actorName: string;
  actorRole: Role;
  actorUserId?: string;
  actorAvatar?: string;
  actionType:
    | 'user_created'
    | 'role_changed'
    | 'position_assigned'
    | 'permission_updated'
    | 'lecture_uploaded'
    | 'announcement_published'
    | 'system_setting_changed'
    | 'login'
    | string;
  details: string;
  target?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  scope?: string;
  previousValue?: string;
  newValue?: string;
  metadata?: Record<string, any>;
}

export interface PlatformSetting {
  currentAcademicYear: string;
  currentSemester: string;
  studentRegistrationOpen: boolean;
  allowStudentUploads: boolean;
  maintenanceMode: boolean;
  allowLeaderAnnouncements: boolean;
  defaultDoctorStorageLimitGB: number;
  systemName: string;
}

export interface GroupAnnouncement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: Role;
  authorPosition?: StudentPosition;
  scope: string;
  createdAt: string;
  isUrgent?: boolean;
  likesCount: number;
}

export type NavTab =
  | 'home'
  | 'super_admin_panel'
  | 'lectures'
  | 'schedule'
  | 'community'
  | 'library'
  | 'notes'
  | 'tasks'
  | 'pomodoro'
  | 'study_center'
  | 'academic_profile'
  | 'gpa'
  | 'exams'
  | 'question_bank'
  | 'flashcards'
  | 'teachers'
  | 'practical_training'
  | 'bookmarks'
  | 'notifications'
  | 'student_services'
  | 'settings'
  | 'help_center'
  | 'ai_assistant'
  | 'chat';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: Role;
  faculty: string;
  department: string;
  specialization: string;
  level: string;
  section?: string;
  academicYear: string;
  studentId: string;
  phone?: string;
  nationalId?: string;
  gpa: number;
  totalCreditHours: number;
  completedCreditHours: number;
  studentPosition?: StudentPosition;
  studentPositions?: StudentPosition[];
  studentPositionDetails?: StudentPositionDetails;
  status?: 'active' | 'suspended';
  coordinatorScope?: string;
  assignedSubjects?: string[];
  permissions?: PermissionKey[];
  permissionScopes?: { permission: string; scope: string }[];
}

export interface AuthAccount {
  id: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
  nationalId: string;
  profile: UserProfile;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  instructor: string;
  instructorAvatar?: string;
  department: string;
  creditHours: number;
  room: string;
  scheduleTime: string;
  color: string;
  progress: number;
  description: string;
  totalLectures: number;
  completedLectures: number;
  totalFiles: number;
  iconName: string;
}

export interface TimestampNote {
  timeInSeconds: number;
  displayTime: string;
  text: string;
}

export interface Lecture {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  number: number;
  instructor: string;
  date: string;
  room: string;
  duration: string;
  durationSeconds: number;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  description: string;
  progressPercent: number;
  isBookmarked: boolean;
  notesCount: number;
  timestampNotes: TimestampNote[];
  questionsCount: number;
}

export interface ScheduleItem {
  id: string;
  subject: string;
  subjectId: string;
  instructor: string;
  room: string;
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  dayArabic: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: 'lecture' | 'section' | 'lab' | 'study_group';
  isToday?: boolean;
}

export interface Task {
  id: string;
  title: string;
  subjectId?: string;
  subjectName?: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  dayArabic: string;
  time: string;
  room: string;
  remainingDays: number;
  type: 'final' | 'midterm' | 'quiz' | 'practical';
  score?: number;
  maxScore: number;
}

export interface LibraryFile {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  teacher: string;
  type: 'pdf' | 'doc' | 'ppt' | 'summary' | 'exam' | 'audio' | 'video';
  size: string;
  uploadDate: string;
  downloadsCount: number;
  isBookmarked: boolean;
  isSavedOffline: boolean;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId?: string;
  subjectName?: string;
  lectureId?: string;
  lectureTitle?: string;
  timestamp?: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  subjectId: string;
  subjectName: string;
  question: string;
  type: 'mcq' | 'true_false';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  subjectName: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: Role;
  authorAvatar: string;
  authorDepartment: string;
  content: string;
  timestamp: string;
  isOfficial: boolean;
  groupName: string;
  likes: number;
  userLiked?: boolean;
  commentsCount: number;
  comments: Comment[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVotedIndex?: number;
  };
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: Role;
  content: string;
  timestamp: string;
  likes?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'academic' | 'schedule' | 'community' | 'system';
  read: boolean;
  actionUrl?: string;
}

export interface PracticalTraining {
  schoolName: string;
  schoolType: string;
  supervisorName: string;
  mentorTeacher: string;
  gradeLevel: string;
  totalHoursRequired: number;
  completedHours: number;
  attendanceRate: number;
  lessonPlans: {
    id: string;
    title: string;
    subject: string;
    date: string;
    grade: string;
    status: 'approved' | 'pending' | 'revision';
    score?: number;
  }[];
  supervisorVisits: {
    id: string;
    date: string;
    notes: string;
    evaluationScore: number;
  }[];
}

export interface StudentTicket {
  id: string;
  userId?: string;
  userName?: string;
  studentName?: string;
  title: string;
  category: 'lectures' | 'schedule' | 'files' | 'grades' | 'general';
  description: string;
  status: 'pending' | 'under_review' | 'in_progress' | 'resolved';
  createdAt: string;
  response?: string;
}
