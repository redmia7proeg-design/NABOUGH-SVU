import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Role,
  StudentPosition,
  StudentPositionDetails,
  NavTab,
  Subject,
  Lecture,
  ScheduleItem,
  Exam,
  LibraryFile,
  Note,
  NotificationItem,
  StudentTicket,
  AuthAccount,
  ActivityLog,
  PlatformSetting,
  GroupAnnouncement,
  PermissionKey,
  Post,
  Comment,
  Task,
} from '../types';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  loginWithFirebase,
  logoutFromFirebase,
  registerStudentWithRealFirebase,
  sendFirebasePasswordReset,
  getInitialDashboardTabForRole,
} from '../services/firebaseAuthService';
import {
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
  deleteUserFromFirestore,
  subscribeToUsers,
  subscribeToCourses,
  saveCourse,
  deleteCourse,
  subscribeToLectures,
  saveLecture,
  deleteLecture,
  subscribeToSchedules,
  saveSchedule,
  deleteSchedule,
  subscribeToExams,
  saveExam,
  deleteExam,
  subscribeToFiles,
  saveLibraryFile,
  deleteLibraryFile,
  subscribeToAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  subscribeToNotifications,
  updateNotificationRead,
  subscribeToCommunityPosts,
  saveCommunityPost,
  deleteCommunityPost,
  addCommentToPost,
  togglePostLike,
  subscribeToTasks,
  saveTask,
  deleteTask,
  subscribeToNotes,
  saveNote,
  deleteNote,
  subscribeToStudentTickets,
  saveStudentTicket,
  updateStudentTicketStatus,
  subscribeToPlatformSettings,
  savePlatformSettings,
  subscribeToActivityLogs,
  logActivityToFirestore,
  sanitizeForFirestore,
} from '../services/firestoreDataService';
import {
  INITIAL_SUBJECTS,
  INITIAL_LECTURES,
  INITIAL_SCHEDULES,
  INITIAL_EXAMS,
  INITIAL_FILES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_POSTS,
  INITIAL_TASKS,
  INITIAL_NOTES,
} from '../data/initialData';

interface AppContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  currentUser: UserProfile;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  registerStudentAccount: (data: { nationalId: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (identifier: string, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: Role | 'student_leader' | 'student_coordinator') => Promise<void>;
  authAccounts: AuthAccount[];
  setRole: (role: Role) => void;
  setStudentPosition: (position: StudentPosition, details?: Partial<StudentPositionDetails>) => void;
  updateUserRole: (userId: string, newRole: Role) => Promise<void>;
  updateStudentPosition: (userId: string, position: StudentPosition, details?: Partial<StudentPositionDetails>) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  createNewUserAccount: (account: AuthAccount) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  updateUserPermissions: (userId: string, permissions: PermissionKey[], scopes?: { permission: string; scope: string }[]) => Promise<void>;
  hasPermission: (permission: PermissionKey, scope?: string) => boolean;
  activityLogs: ActivityLog[];
  addActivityLog: (log: {
    actorName?: string;
    actorRole?: Role;
    actionType?: string;
    action?: string;
    details?: string;
    target?: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
    scope?: string;
    previousValue?: string;
    newValue?: string;
    metadata?: Record<string, any>;
  }) => Promise<void>;
  platformSettings: PlatformSetting;
  updatePlatformSettings: (settings: Partial<PlatformSetting>) => Promise<void>;
  groupAnnouncements: GroupAnnouncement[];
  addGroupAnnouncement: (ann: Omit<GroupAnnouncement, 'id' | 'createdAt' | 'likesCount'>) => Promise<void>;
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
  activeLecture: Lecture | null;
  setActiveLecture: (lecture: Lecture | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiInitialSubject?: string;
  openAiWithContext: (subject?: string, prompt?: string) => void;
  aiInitialPrompt?: string;
  subjects: Subject[];
  addSubject: (subj: Subject) => Promise<void>;
  updateSubject: (subj: Subject) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
  lectures: Lecture[];
  addLecture: (lec: Lecture) => Promise<void>;
  removeLecture: (id: string) => Promise<void>;
  schedules: ScheduleItem[];
  addScheduleItem: (item: ScheduleItem) => Promise<void>;
  updateScheduleItem: (item: ScheduleItem) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
  exams: Exam[];
  addExamItem: (exam: Exam) => Promise<void>;
  updateExamItem: (exam: Exam) => Promise<void>;
  deleteExamItem: (id: string) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  communityPosts: Post[];
  addPost: (content: string, groupName?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  tasks: Task[];
  toggleTask: (taskId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  libraryFiles: LibraryFile[];
  addLibraryFile: (file: LibraryFile) => Promise<void>;
  deleteLibraryFileItem: (fileId: string) => Promise<void>;
  toggleBookmarkFile: (fileId: string) => void;
  toggleOfflineSaveFile: (fileId: string) => void;
  toggleBookmarkLecture: (lectureId: string) => void;
  deleteAnnouncementItem: (id: string) => Promise<void>;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tickets: StudentTicket[];
  addTicket: (ticket: Omit<StudentTicket, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: StudentTicket['status'], response?: string) => Promise<void>;
  // Pomodoro shared state
  pomodoroSecondsLeft: number;
  setPomodoroSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  isPomodoroRunning: boolean;
  setIsPomodoroRunning: React.Dispatch<React.SetStateAction<boolean>>;
  pomodoroSubject: string;
  setPomodoroSubject: (subj: string) => void;
  pomodoroPreset: number;
  setPomodoroPreset: (minutes: number) => void;
  completedPomodoros: number;
  setCompletedPomodoros: React.Dispatch<React.SetStateAction<number>>;
}

const defaultUserProfile: UserProfile = {
  id: 'guest',
  name: 'زائر منصة نبوغ',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  email: 'guest@nabough.edu',
  role: 'student',
  faculty: 'كلية التربية',
  department: 'قسم علم النفس التربوي والصحة النفسية',
  specialization: 'شعبة علم النفس التربوي',
  level: 'الفرقة الثالثة',
  academicYear: '2025 / 2026',
  studentId: 'EDU-GUEST',
  gpa: 3.8,
  totalCreditHours: 132,
  completedCreditHours: 94,
  status: 'active',
  studentPosition: 'normal',
};

const defaultPlatformSettings: PlatformSetting = {
  systemName: 'منصة نَبُوغ التعليمية — كلية التربية',
  currentAcademicYear: '2025 / 2026',
  currentSemester: 'الفصل الدراسي الثاني',
  studentRegistrationOpen: true,
  allowStudentUploads: true,
  maintenanceMode: false,
  allowLeaderAnnouncements: true,
  defaultDoctorStorageLimitGB: 10,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUserProfile);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nabough_theme') === 'dark';
    }
    return false;
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nabough_sidebar_collapsed') === 'true';
    }
    return false;
  });
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nabough_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen((prev) => !prev);
  };
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiInitialSubject, setAiInitialSubject] = useState<string | undefined>();
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User accounts are loaded only from Firestore; there are no built-in/demo accounts.
  // Firestore collection states (seeded with rich faculty data, synchronized live on auth)
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [lectures, setLectures] = useState<Lecture[]>(INITIAL_LECTURES);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>(INITIAL_FILES);
  const [groupAnnouncements, setGroupAnnouncements] = useState<GroupAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [communityPosts, setCommunityPosts] = useState<Post[]>(INITIAL_POSTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSetting>(defaultPlatformSettings);
  const [authAccounts, setAuthAccounts] = useState<AuthAccount[]>([]);
  const [tickets, setTickets] = useState<StudentTicket[]>([]);

  // Pomodoro
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState<number>(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);
  const [pomodoroSubject, setPomodoroSubject] = useState<string>('علم النفس التربوي');
  const [pomodoroPreset, setPomodoroPreset] = useState<number>(25);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(3);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nabough_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nabough_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // 1. Initialize Firebase & onAuthStateChanged listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfileFromFirestore(firebaseUser.uid);
          if (profile) {
            setCurrentUser(profile);
            setIsAuthenticated(true);
          } else {
            // Never create an implicit profile. Accounts must be provisioned through the admin workflow.
            await logoutFromFirebase();
            setCurrentUser(defaultUserProfile);
            setIsAuthenticated(false);
          }
        } catch (e) {
          console.error('Error fetching user profile from Firestore:', e);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(defaultUserProfile);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Realtime Firestore Subscriptions for shared educational resources
  // ONLY attach listeners if auth is ready and user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) {
      return;
    }

    const unsubCourses = subscribeToCourses((data) => setSubjects(data));
    const unsubLectures = subscribeToLectures((data) => setLectures(data));
    const unsubSchedules = subscribeToSchedules((data) => setSchedules(data));
    const unsubExams = subscribeToExams((data) => setExams(data));
    const unsubFiles = subscribeToFiles((data) => setLibraryFiles(data));
    const unsubAnnouncements = subscribeToAnnouncements((data) => setGroupAnnouncements(data));
    const unsubSettings = subscribeToPlatformSettings((data) => setPlatformSettings(data));
    const unsubPosts = subscribeToCommunityPosts((data) => setCommunityPosts(data));
    const unsubTickets = subscribeToStudentTickets((data) => setTickets(data));

    // Admin-only subscriptions
    let unsubActivityLogs = () => {};
    let unsubUsers = () => {};

    if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
      unsubActivityLogs = subscribeToActivityLogs((data) => setActivityLogs(data));
      unsubUsers = subscribeToUsers((firestoreUsers) => {
        if (firestoreUsers && firestoreUsers.length > 0) {
          const mapped: AuthAccount[] = firestoreUsers.map((u) => ({
            id: u.id,
            phone: u.phone || '',
            email: u.email,
            password: '••••••••',
            role: u.role,
            nationalId: u.nationalId || '',
            profile: u,
          }));
          setAuthAccounts((prev) => {
            const firestoreIds = new Set(mapped.map((a) => a.id));
            const firestoreEmails = new Set(mapped.map((a) => a.email.toLowerCase()));
            const notInFirestore = prev.filter(
              (p) => !firestoreIds.has(p.id) && !firestoreEmails.has(p.email.toLowerCase())
            );
            return [...mapped, ...notInFirestore];
          });
        }
      });
    }

    return () => {
      unsubCourses();
      unsubLectures();
      unsubSchedules();
      unsubExams();
      unsubFiles();
      unsubAnnouncements();
      unsubSettings();
      unsubPosts();
      unsubTickets();
      unsubActivityLogs();
      unsubUsers();
    };
  }, [isAuthenticated, currentUser.role]);

  // 3. User Personal Data Subscriptions (Tasks, Notes, Notifications)
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser || !currentUser?.id || currentUser.id === 'guest') return;

    const unsubTasks = subscribeToTasks(currentUser.id, (data) => setTasks(data));
    const unsubNotes = subscribeToNotes(currentUser.id, (data) => setNotes(data));
    const unsubNotifs = subscribeToNotifications(currentUser.id, (data) => setNotifications(data));

    return () => {
      unsubTasks();
      unsubNotes();
      unsubNotifs();
    };
  }, [isAuthenticated, currentUser?.id]);

  // Permission Check Function
  const hasPermission = (permission: PermissionKey, scope?: string): boolean => {
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.permissions?.includes(permission)) {
      if (!scope) return true;
      const userScopeObj = currentUser.permissionScopes?.find((s) => s.permission === permission);
      if (!userScopeObj || !userScopeObj.scope || userScopeObj.scope === 'all' || userScopeObj.scope === scope) {
        return true;
      }
    }
    return false;
  };

  // Activity Log
  const addActivityLog = async (logInput: {
    actorName?: string;
    actorRole?: Role;
    actionType?: string;
    action?: string;
    details?: string;
    target?: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
    scope?: string;
    previousValue?: string;
    newValue?: string;
    metadata?: Record<string, any>;
  }) => {
    const actorName = logInput.actorName || currentUser.name;
    const actorRole = logInput.actorRole || currentUser.role;
    const action = logInput.action || logInput.actionType || 'ADMIN_ACTION';

    await logActivityToFirestore({
      actorUserId: currentUser.id,
      actorName,
      actorRole,
      action,
      entityType: logInput.entityType,
      entityId: logInput.entityId || logInput.target,
      entityName: logInput.entityName || logInput.details,
      affectedUserId: logInput.target,
      scope: logInput.scope,
      previousValue: logInput.previousValue,
      newValue: logInput.newValue,
      metadata: logInput.metadata,
    });
  };

  // Login
  const login = async (
    identifier: string,
    pass: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await loginWithFirebase(identifier, pass);
    if (res.success && res.profile) {
      setCurrentUser(res.profile);
      setIsAuthenticated(true);
      const targetTab = getInitialDashboardTabForRole(res.profile.role) as NavTab;
      setCurrentTab(targetTab);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Logout
  const logout = async () => {
    await logoutFromFirebase();
    setIsAuthenticated(false);
    setCurrentUser(defaultUserProfile);
    setCurrentTab('home');
  };

  // Student Registration via Egyptian National ID
  const registerStudentAccount = async (data: {
    nationalId: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const res = await registerStudentWithRealFirebase(data);
    if (res.success && res.profile) {
      setCurrentUser(res.profile);
      setIsAuthenticated(true);
      setCurrentTab('home');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Reset Password
  const resetPassword = async (identifier: string): Promise<{ success: boolean; error?: string }> => {
    return await sendFirebasePasswordReset(identifier);
  };

  // Demo login is intentionally disabled.
  const quickDemoLogin = async (_role: Role | 'student_leader' | 'student_coordinator') => {
    throw new Error('تسجيل الدخول التجريبي معطل في النسخة الإنتاجية.');
  };

  // Role & Position Switching (for testing / admin preview)
  const setRole = (role: Role) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const setStudentPosition = (position: StudentPosition, details?: Partial<StudentPositionDetails>) => {
    setCurrentUser((prev) => ({
      ...prev,
      studentPosition: position,
      studentPositions: position === 'normal' ? ['normal'] : [position],
      studentPositionDetails: details ? ({ ...prev.studentPositionDetails, ...details } as any) : undefined,
    }));
  };

  // Super Admin Management Actions
  const updateUserRole = async (userId: string, newRole: Role) => {
    const existing = authAccounts.find((a) => a.id === userId || a.profile.id === userId);
    if (existing) {
      const prevRole = existing.role;
      const updatedProfile: UserProfile = {
        ...existing.profile,
        role: newRole,
      };
      await saveUserProfileToFirestore(updatedProfile);
      await addActivityLog({
        action: 'ROLE_CHANGED',
        entityType: 'user',
        entityId: userId,
        entityName: updatedProfile.name,
        previousValue: prevRole,
        newValue: newRole,
      });
      if (currentUser.id === userId) {
        setCurrentUser(updatedProfile);
      }
    }
  };

  const updateStudentPosition = async (
    userId: string,
    position: StudentPosition,
    details?: Partial<StudentPositionDetails>
  ) => {
    const existing = authAccounts.find((a) => a.id === userId || a.profile.id === userId);
    if (existing) {
      const positionDetails: StudentPositionDetails | undefined =
        position === 'normal'
          ? undefined
          : {
              position,
              title: details?.title || (position === 'leader' ? 'ليدر الشعبة' : 'منسق الدفعة'),
              scope: details?.scope || 'الفرقة الثالثة',
              appointedBy: currentUser.name,
              appointedAt: new Date().toLocaleDateString('ar-EG'),
              canUploadFiles: true,
              canUploadAudio: true,
              canAddLinks: true,
              canPublishAnnouncements: true,
              canSendNotifications: true,
              canEditGroupSchedule: true,
              canManageCommunity: true,
              ...details,
            };

      const updatedProfile: UserProfile = {
        ...existing.profile,
        studentPosition: position,
        studentPositions: position === 'normal' ? ['normal'] : [position],
        ...(positionDetails ? { studentPositionDetails: positionDetails } : {}),
      };
      if (position === 'normal') {
        delete updatedProfile.studentPositionDetails;
      }
      await saveUserProfileToFirestore(updatedProfile);
      await addActivityLog({
        action: 'POSITION_ASSIGNED',
        entityType: 'user',
        entityId: userId,
        entityName: updatedProfile.name,
        scope: details?.scope || 'الفرقة الثالثة',
        newValue: position,
      });
      if (currentUser.id === userId) {
        setCurrentUser(updatedProfile);
      }
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const existing = authAccounts.find((a) => a.id === userId || a.profile.id === userId);
    if (existing) {
      const newStatus = existing.profile.status === 'suspended' ? 'active' : 'suspended';
      const updatedProfile: UserProfile = {
        ...existing.profile,
        status: newStatus as any,
      };
      await saveUserProfileToFirestore(updatedProfile);
      await addActivityLog({
        action: newStatus === 'active' ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
        entityType: 'user',
        entityId: userId,
        entityName: updatedProfile.name,
        newValue: newStatus,
      });
    }
  };

  const createNewUserAccount = async (account: AuthAccount) => {
    const cleanProfile = sanitizeForFirestore(account.profile);
    const cleanAccount: AuthAccount = {
      ...account,
      profile: cleanProfile,
    };
    setAuthAccounts((prev) => [
      cleanAccount,
      ...prev.filter((a) => a.id !== cleanAccount.id && a.email !== cleanAccount.email),
    ]);
    try {
      await saveUserProfileToFirestore(cleanAccount.profile);
    } catch (err) {
      console.warn('Could not save user profile to Firestore:', err);
    }
    try {
      await addActivityLog({
        action: 'USER_CREATED',
        entityType: 'user',
        entityId: cleanAccount.profile.id,
        entityName: cleanAccount.profile.name,
        newValue: cleanAccount.role,
      });
    } catch (err) {
      console.warn('Could not log activity:', err);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    setAuthAccounts((prev) =>
      prev.map((a) => (a.id === profile.id || a.profile.id === profile.id) ? { ...a, email: profile.email, profile } : a)
    );
    if (currentUser.id === profile.id) {
      setCurrentUser(profile);
    }
    try {
      await saveUserProfileToFirestore(profile);
    } catch (err) {
      console.warn('Could not save user profile:', err);
    }
    try {
      await addActivityLog({
        action: 'USER_UPDATED',
        entityType: 'user',
        entityId: profile.id,
        entityName: profile.name,
      });
    } catch (err) {
      console.warn('Could not log activity:', err);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    setAuthAccounts((prev) => prev.filter((a) => a.id !== userId && a.profile.id !== userId));
    try {
      await deleteUserFromFirestore(userId);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: userId,
    });
  };

  const updateUserPermissions = async (
    userId: string,
    permissions: PermissionKey[],
    scopes?: { permission: string; scope: string }[]
  ) => {
    const existing = authAccounts.find((a) => a.id === userId || a.profile.id === userId);
    if (existing) {
      const updatedProfile: UserProfile = {
        ...existing.profile,
        permissions,
        permissionScopes: scopes,
      };
      setAuthAccounts((prev) =>
        prev.map((a) => (a.id === userId || a.profile.id === userId) ? { ...a, profile: updatedProfile } : a)
      );
      try {
        await saveUserProfileToFirestore(updatedProfile);
      } catch (err) {
        console.warn(err);
      }
      await addActivityLog({
        action: 'PERMISSIONS_UPDATED',
        entityType: 'user',
        entityId: userId,
        entityName: updatedProfile.name,
        newValue: permissions.join(', '),
      });
    }
  };

  const updatePlatformSettings = async (settings: Partial<PlatformSetting>) => {
    await savePlatformSettings(settings);
    await addActivityLog({
      action: 'SETTINGS_CHANGED',
      entityType: 'platform',
      entityName: 'تحديث إعدادات المنصة المركزية',
    });
  };

  const addGroupAnnouncement = async (ann: Omit<GroupAnnouncement, 'id' | 'createdAt' | 'likesCount'>) => {
    const id = `ann_${Date.now()}`;
    const newAnn: GroupAnnouncement = {
      ...ann,
      id,
      createdAt: 'الآن',
      likesCount: 0,
    };
    await saveAnnouncement(newAnn);
    await addActivityLog({
      action: 'ANNOUNCEMENT_PUBLISHED',
      entityType: 'announcement',
      entityId: id,
      entityName: newAnn.title,
      scope: newAnn.scope,
    });
  };

  const deleteAnnouncementItem = async (id: string) => {
    await deleteAnnouncement(id);
    setGroupAnnouncements((prev) => prev.filter((a) => a.id !== id));
    await addActivityLog({
      action: 'ANNOUNCEMENT_DELETED',
      entityType: 'announcement',
      entityId: id,
    });
  };

  // Educational Resources Mutations
  const addSubject = async (subj: Subject) => {
    setSubjects((prev) => [subj, ...prev.filter((s) => s.id !== subj.id)]);
    try {
      await saveCourse(subj);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'COURSE_CREATED',
      entityType: 'course',
      entityId: subj.id,
      entityName: subj.name,
    });
  };

  const updateSubject = async (subj: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === subj.id ? subj : s)));
    try {
      await saveCourse(subj);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'COURSE_UPDATED',
      entityType: 'course',
      entityId: subj.id,
      entityName: subj.name,
    });
  };

  const removeSubject = async (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteCourse(id);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'COURSE_DELETED',
      entityType: 'course',
      entityId: id,
    });
  };

  const addLecture = async (lec: Lecture) => {
    setLectures((prev) => [lec, ...prev.filter((l) => l.id !== lec.id)]);
    try {
      await saveLecture(lec);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'LECTURE_SAVED',
      entityType: 'lecture',
      entityId: lec.id,
      entityName: lec.title,
    });
  };

  const removeLecture = async (id: string) => {
    setLectures((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteLecture(id);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'LECTURE_DELETED',
      entityType: 'lecture',
      entityId: id,
    });
  };

  const addScheduleItem = async (item: ScheduleItem) => {
    setSchedules((prev) => [item, ...prev.filter((s) => s.id !== item.id)]);
    try {
      await saveSchedule(item);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'SCHEDULE_CREATED',
      entityType: 'schedule',
      entityId: item.id,
      entityName: item.subject,
      scope: item.dayArabic,
    });
  };

  const updateScheduleItem = async (item: ScheduleItem) => {
    setSchedules((prev) => prev.map((s) => (s.id === item.id ? item : s)));
    try {
      await saveSchedule(item);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'SCHEDULE_UPDATED',
      entityType: 'schedule',
      entityId: item.id,
      entityName: item.subject,
      scope: item.dayArabic,
    });
  };

  const deleteScheduleItem = async (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteSchedule(id);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'SCHEDULE_DELETED',
      entityType: 'schedule',
      entityId: id,
    });
  };

  const addExamItem = async (exam: Exam) => {
    setExams((prev) => [exam, ...prev.filter((e) => e.id !== exam.id)]);
    try {
      await saveExam(exam);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'EXAM_SAVED',
      entityType: 'exam',
      entityId: exam.id,
      entityName: exam.subjectName,
    });
  };

  const updateExamItem = async (exam: Exam) => {
    setExams((prev) => prev.map((e) => (e.id === exam.id ? exam : e)));
    try {
      await saveExam(exam);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'EXAM_UPDATED',
      entityType: 'exam',
      entityId: exam.id,
      entityName: exam.subjectName,
    });
  };

  const deleteExamItem = async (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExam(id);
    } catch (err) {
      console.warn(err);
    }
    await addActivityLog({
      action: 'EXAM_DELETED',
      entityType: 'exam',
      entityId: id,
    });
  };

  const addLibraryFile = async (file: LibraryFile) => {
    await saveLibraryFile(file);
    await addActivityLog({
      action: 'FILE_UPLOADED',
      entityType: 'file',
      entityId: file.id,
      entityName: file.title,
    });
  };

  const deleteLibraryFileItem = async (fileId: string) => {
    await deleteLibraryFile(fileId);
    setLibraryFiles((prev) => prev.filter((f) => f.id !== fileId));
    await addActivityLog({
      action: 'FILE_DELETED',
      entityType: 'file',
      entityId: fileId,
    });
  };

  // Community
  const addPost = async (content: string, groupName = 'ملتقى الطلاب') => {
    const id = `post_${Date.now()}`;
    const newPost: Post = {
      id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      authorDepartment: currentUser.department,
      content,
      timestamp: 'الآن',
      isOfficial: currentUser.role === 'admin' || currentUser.role === 'super_admin',
      groupName,
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    await saveCommunityPost(newPost);
  };

  const likePost = async (postId: string) => {
    await togglePostLike(postId, currentUser.id);
  };

  const addComment = async (postId: string, text: string) => {
    const comment: Comment = {
      id: `cmt_${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content: text,
      timestamp: 'الآن',
      likes: 0,
    };
    await addCommentToPost(postId, comment);
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [...(p.comments || []), comment],
              commentsCount: (p.commentsCount || 0) + 1,
            }
          : p
      )
    );
  };

  const deletePost = async (postId: string) => {
    await deleteCommunityPost(postId);
    setCommunityPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Personal Tasks & Notes
  const toggleTask = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      await saveTask({ ...target, completed: !target.completed });
    }
  };

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    const id = `task_${Date.now()}`;
    await saveTask({ ...newTask, id, userId: currentUser.id } as any);
  };

  const deleteTaskHandler = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const toggleBookmarkFile = (fileId: string) => {
    setLibraryFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isBookmarked: !f.isBookmarked } : f))
    );
  };

  const toggleOfflineSaveFile = (fileId: string) => {
    setLibraryFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isSavedOffline: !f.isSavedOffline } : f))
    );
  };

  const toggleBookmarkLecture = (lectureId: string) => {
    setLectures((prev) =>
      prev.map((l) => (l.id === lectureId ? { ...l, isBookmarked: !l.isBookmarked } : l))
    );
  };

  const addNote = async (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const id = `note_${Date.now()}`;
    await saveNote({
      ...newNote,
      id,
      userId: currentUser.id,
      createdAt: now,
      updatedAt: now,
    } as any);
  };

  const deleteNoteHandler = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const markNotificationRead = async (notifId: string) => {
    await updateNotificationRead(notifId, true);
  };

  const markAllNotificationsRead = async () => {
    for (const n of notifications) {
      if (!n.read) {
        await updateNotificationRead(n.id, true);
      }
    }
  };

  const addTicket = async (ticketData: Omit<StudentTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: StudentTicket = {
      ...ticketData,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().substring(0, 10),
      status: 'pending',
      userId: currentUser.id,
      studentName: currentUser.name,
    };
    await saveStudentTicket(newTicket);
    setTickets((prev) => [newTicket, ...prev]);
    await addActivityLog({
      action: 'TICKET_CREATED',
      entityType: 'ticket',
      entityId: newTicket.id,
      entityName: newTicket.title,
    });
  };

  const updateTicketStatus = async (
    ticketId: string,
    status: StudentTicket['status'],
    response?: string
  ) => {
    await updateStudentTicketStatus(ticketId, status, response);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              response,
              resolvedAt: response ? new Date().toISOString().substring(0, 10) : undefined,
            }
          : t
      )
    );
  };

  const openAiWithContext = (subject?: string, prompt?: string) => {
    setAiInitialSubject(subject);
    setAiInitialPrompt(prompt);
    setIsAiModalOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        currentUser,
        login,
        logout,
        registerStudentAccount,
        resetPassword,
        quickDemoLogin,
        authAccounts,
        setRole,
        setStudentPosition,
        updateUserRole,
        updateStudentPosition,
        toggleUserStatus,
        createNewUserAccount,
        deleteUserAccount,
        updateUserPermissions,
        hasPermission,
        activityLogs,
        addActivityLog,
        platformSettings,
        updatePlatformSettings,
        groupAnnouncements,
        addGroupAnnouncement,
        deleteAnnouncementItem,
        currentTab,
        setCurrentTab,
        isDarkMode,
        toggleDarkMode,
        isFullscreen,
        toggleFullscreen,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileDrawerOpen,
        setMobileDrawerOpen,
        toggleMobileDrawer,
        activeLecture,
        setActiveLecture,
        isAiModalOpen,
        setIsAiModalOpen,
        aiInitialSubject,
        aiInitialPrompt,
        openAiWithContext,
        subjects,
        addSubject,
        updateSubject,
        removeSubject,
        lectures,
        addLecture,
        removeLecture,
        schedules,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        exams,
        addExamItem,
        updateExamItem,
        deleteExamItem,
        updateUserProfile,
        communityPosts,
        addPost,
        likePost,
        addComment,
        deletePost,
        tasks,
        toggleTask,
        addTask,
        deleteTask: deleteTaskHandler,
        libraryFiles,
        addLibraryFile,
        deleteLibraryFileItem,
        toggleBookmarkFile,
        toggleOfflineSaveFile,
        toggleBookmarkLecture,
        notes,
        addNote,
        deleteNote: deleteNoteHandler,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        searchQuery,
        setSearchQuery,
        tickets,
        addTicket,
        updateTicketStatus,
        pomodoroSecondsLeft,
        setPomodoroSecondsLeft,
        isPomodoroRunning,
        setIsPomodoroRunning,
        pomodoroSubject,
        setPomodoroSubject,
        pomodoroPreset,
        setPomodoroPreset,
        completedPomodoros,
        setCompletedPomodoros,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
