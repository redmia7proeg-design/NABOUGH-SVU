import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestoreErrors';
import {
  UserProfile,
  Role,
  StudentPosition,
  Subject,
  Lecture,
  ScheduleItem,
  Exam,
  LibraryFile,
  GroupAnnouncement,
  NotificationItem,
  Post,
  Comment,
  Task,
  Note,
  Question,
  PracticalTraining,
  StudentTicket,
  ActivityLog,
  PlatformSetting,
  PermissionKey,
} from '../types';

/**
 * Deeply removes undefined fields from an object or array so Firestore SDK
 * never throws "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null) {
    return null as any;
  }
  if (data === undefined) {
    return undefined as any;
  }
  if (typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data;
  }
  // Preserve Firestore FieldValue tokens
  if ((data as any)?._methodName || (data as any)?.constructor?.name === 'FieldValue') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined) as any;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      const sanitized = sanitizeForFirestore(value);
      if (sanitized !== undefined) {
        cleaned[key] = sanitized;
      }
    }
  }
  return cleaned as T;
}

// ==========================================
// 1. ACTIVITY LOGS (AUDIT TRAIL)
// ==========================================
export async function logActivityToFirestore(log: {
  actorUserId?: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  affectedUserId?: string;
  scope?: string;
  previousValue?: string;
  newValue?: string;
  metadata?: Record<string, any>;
}) {
  const collectionName = 'activityLogs';
  try {
    const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newLog: ActivityLog = {
      id,
      timestamp: formattedDate,
      actorName: log.actorName || 'النظام',
      actorRole: log.actorRole || 'super_admin',
      actionType: (log.action as any) || 'GENERAL_ACTION',
      details: `${log.action}: ${log.entityName || ''} ${log.scope ? `[${log.scope}]` : ''}`.trim(),
      target: log.affectedUserId || log.entityId || '',
      actorUserId: log.actorUserId || '',
      entityType: log.entityType || 'general',
      entityId: log.entityId || '',
      entityName: log.entityName || '',
      scope: log.scope || '',
      previousValue: log.previousValue || '',
      newValue: log.newValue || '',
      metadata: log.metadata || {},
      createdAtIso: now.toISOString(),
    };

    const sanitized = sanitizeForFirestore(newLog);
    await setDoc(doc(db, collectionName, id), sanitized);
    return sanitized;
  } catch (err) {
    console.error('Failed to log activity:', err);
    // Don't throw to avoid blocking the main user flow, but log
  }
}

export function subscribeToActivityLogs(
  onUpdate: (logs: ActivityLog[]) => void,
  onError?: (err: Error) => void
) {
  const collectionName = 'activityLogs';
  const q = query(collection(db, collectionName), limit(150));
  return onSnapshot(
    q,
    (snapshot) => {
      const logs: ActivityLog[] = [];
      snapshot.forEach((d) => {
        logs.push(d.data() as ActivityLog);
      });
      // Sort newest first
      logs.sort((a, b) => (b.createdAtIso || b.timestamp || '').localeCompare(a.createdAtIso || a.timestamp || ''));
      onUpdate(logs);
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, collectionName);
    }
  );
}

// ==========================================
// 2. USERS
// ==========================================
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const sanitized = sanitizeForFirestore(user);
    await setDoc(doc(db, 'users', user.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  const path = `users/${userId}`;
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToUsers(onUpdate: (users: UserProfile[]) => void) {
  const path = 'users';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((d) => list.push(d.data() as UserProfile));
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

// ==========================================
// 3. OFFICIAL COLLEGE REGISTRY
// ==========================================
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

export async function lookupCollegeStudentRecord(
  nationalId: string,
  phone: string
): Promise<CollegeStudentRecord | null> {
  const path = 'collegeRegistry';
  try {
    const cleanNationalId = nationalId.trim();
    const cleanPhone = phone.trim();

    // Check by ID or query
    const docRef = doc(db, path, cleanNationalId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CollegeStudentRecord;
      if (data.phone === cleanPhone) {
        return data;
      }
    }

    // Fallback query by nationalId and phone
    const q = query(
      collection(db, path),
      where('nationalId', '==', cleanNationalId),
      where('phone', '==', cleanPhone)
    );
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as CollegeStudentRecord;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// ==========================================
// 4. COURSES / SUBJECTS
// ==========================================
export function subscribeToCourses(onUpdate: (courses: Subject[]) => void) {
  const path = 'courses';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: Subject[] = [];
      snap.forEach((d) => list.push(d.data() as Subject));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveCourse(course: Subject) {
  const path = `courses/${course.id}`;
  try {
    const sanitized = sanitizeForFirestore(course);
    await setDoc(doc(db, 'courses', course.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteCourse(courseId: string) {
  const path = `courses/${courseId}`;
  try {
    await deleteDoc(doc(db, 'courses', courseId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 5. LECTURES
// ==========================================
export function subscribeToLectures(onUpdate: (lectures: Lecture[]) => void) {
  const path = 'lectures';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: Lecture[] = [];
      snap.forEach((d) => list.push(d.data() as Lecture));
      list.sort((a, b) => (a.number || 0) - (b.number || 0));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveLecture(lecture: Lecture) {
  const path = `lectures/${lecture.id}`;
  try {
    const sanitized = sanitizeForFirestore(lecture);
    await setDoc(doc(db, 'lectures', lecture.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteLecture(lectureId: string) {
  const path = `lectures/${lectureId}`;
  try {
    await deleteDoc(doc(db, 'lectures', lectureId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 6. SCHEDULES
// ==========================================
export function subscribeToSchedules(onUpdate: (items: ScheduleItem[]) => void) {
  const path = 'schedules';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: ScheduleItem[] = [];
      snap.forEach((d) => list.push(d.data() as ScheduleItem));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveSchedule(item: ScheduleItem) {
  const path = `schedules/${item.id}`;
  try {
    const sanitized = sanitizeForFirestore(item);
    await setDoc(doc(db, 'schedules', item.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteSchedule(scheduleId: string) {
  const path = `schedules/${scheduleId}`;
  try {
    await deleteDoc(doc(db, 'schedules', scheduleId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 7. EXAMS
// ==========================================
export function subscribeToExams(onUpdate: (exams: Exam[]) => void) {
  const path = 'exams';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: Exam[] = [];
      snap.forEach((d) => list.push(d.data() as Exam));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveExam(exam: Exam) {
  const path = `exams/${exam.id}`;
  try {
    const sanitized = sanitizeForFirestore(exam);
    await setDoc(doc(db, 'exams', exam.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteExam(examId: string) {
  const path = `exams/${examId}`;
  try {
    await deleteDoc(doc(db, 'exams', examId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 8. LIBRARY FILES
// ==========================================
export function subscribeToFiles(onUpdate: (files: LibraryFile[]) => void) {
  const path = 'libraryFiles';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: LibraryFile[] = [];
      snap.forEach((d) => list.push(d.data() as LibraryFile));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveLibraryFile(file: LibraryFile) {
  const path = `libraryFiles/${file.id}`;
  try {
    const sanitized = sanitizeForFirestore(file);
    await setDoc(doc(db, 'libraryFiles', file.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteLibraryFile(fileId: string) {
  const path = `libraryFiles/${fileId}`;
  try {
    await deleteDoc(doc(db, 'libraryFiles', fileId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 9. ANNOUNCEMENTS
// ==========================================
export function subscribeToAnnouncements(onUpdate: (items: GroupAnnouncement[]) => void) {
  const path = 'announcements';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: GroupAnnouncement[] = [];
      snap.forEach((d) => list.push(d.data() as GroupAnnouncement));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveAnnouncement(ann: GroupAnnouncement) {
  const path = `announcements/${ann.id}`;
  try {
    const sanitized = sanitizeForFirestore(ann);
    await setDoc(doc(db, 'announcements', ann.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncement(announcementId: string) {
  const path = `announcements/${announcementId}`;
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 10. NOTIFICATIONS
// ==========================================
export function subscribeToNotifications(userId: string, onUpdate: (items: NotificationItem[]) => void) {
  const path = 'notifications';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: NotificationItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        if (!data.userId || data.userId === userId || data.userId === 'all') {
          list.push(data as NotificationItem);
        }
      });
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function updateNotificationRead(notifId: string, read: boolean) {
  const path = `notifications/${notifId}`;
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ==========================================
// 11. COMMUNITY POSTS & COMMENTS
// ==========================================
export function subscribeToCommunityPosts(onUpdate: (posts: Post[]) => void) {
  const path = 'communityPosts';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: Post[] = [];
      snap.forEach((d) => list.push(d.data() as Post));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveCommunityPost(post: Post) {
  const path = `communityPosts/${post.id}`;
  try {
    await setDoc(doc(db, 'communityPosts', post.id), post, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function togglePostLike(postId: string, userId: string) {
  const path = `communityPosts/${postId}`;
  try {
    const postRef = doc(db, 'communityPosts', postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return;
    const data = snap.data() as Post & { likedBy?: string[] };
    const likedBy = data.likedBy || [];
    const hasLiked = likedBy.includes(userId);
    const updatedLikedBy = hasLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId];
    const likes = updatedLikedBy.length;
    await updateDoc(postRef, { likedBy: updatedLikedBy, likes });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function addCommentToPost(postId: string, comment: Comment) {
  const path = `communityPosts/${postId}`;
  try {
    const postRef = doc(db, 'communityPosts', postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return;
    const post = snap.data() as Post;
    const currentComments = post.comments || [];
    const updatedComments = [...currentComments, comment];
    await updateDoc(postRef, {
      comments: updatedComments,
      commentsCount: updatedComments.length,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteCommunityPost(postId: string) {
  const path = `communityPosts/${postId}`;
  try {
    await deleteDoc(doc(db, 'communityPosts', postId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 12. STUDENT TICKETS & COMPLAINTS
// ==========================================
export function subscribeToStudentTickets(onUpdate: (tickets: StudentTicket[]) => void) {
  const path = 'studentTickets';
  return onSnapshot(
    collection(db, path),
    (snap) => {
      const list: StudentTicket[] = [];
      snap.forEach((d) => list.push(d.data() as StudentTicket));
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveStudentTicket(ticket: StudentTicket) {
  const path = `studentTickets/${ticket.id}`;
  try {
    const sanitized = sanitizeForFirestore(ticket);
    await setDoc(doc(db, 'studentTickets', ticket.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateStudentTicketStatus(
  ticketId: string,
  status: StudentTicket['status'],
  response?: string
) {
  const path = `studentTickets/${ticketId}`;
  try {
    const dataToUpdate: any = { status };
    if (response) {
      dataToUpdate.response = response;
      dataToUpdate.resolvedAt = new Date().toISOString().substring(0, 10);
    }
    const sanitized = sanitizeForFirestore(dataToUpdate);
    await updateDoc(doc(db, 'studentTickets', ticketId), sanitized);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// ==========================================
// 12. TASKS & NOTES
// ==========================================
export function subscribeToTasks(userId: string, onUpdate: (tasks: Task[]) => void) {
  const path = 'tasks';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const list: Task[] = [];
      snap.forEach((d) => list.push(d.data() as Task));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveTask(task: Task) {
  const path = `tasks/${task.id}`;
  try {
    const sanitized = sanitizeForFirestore(task);
    await setDoc(doc(db, 'tasks', task.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteTask(taskId: string) {
  const path = `tasks/${taskId}`;
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToNotes(userId: string, onUpdate: (notes: Note[]) => void) {
  const path = 'notes';
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const list: Note[] = [];
      snap.forEach((d) => list.push(d.data() as Note));
      onUpdate(list);
    },
    (err) => handleFirestoreError(err, OperationType.LIST, path)
  );
}

export async function saveNote(note: Note) {
  const path = `notes/${note.id}`;
  try {
    const sanitized = sanitizeForFirestore(note);
    await setDoc(doc(db, 'notes', note.id), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteNote(noteId: string) {
  const path = `notes/${noteId}`;
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ==========================================
// 13. PLATFORM SETTINGS
// ==========================================
export function subscribeToPlatformSettings(onUpdate: (settings: PlatformSetting) => void) {
  const path = 'settings/platform_config';
  return onSnapshot(
    doc(db, 'settings', 'platform_config'),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as PlatformSetting);
      }
    },
    (err) => handleFirestoreError(err, OperationType.GET, path)
  );
}

export async function savePlatformSettings(settings: Partial<PlatformSetting>) {
  const path = 'settings/platform_config';
  try {
    const sanitized = sanitizeForFirestore(settings);
    await setDoc(doc(db, 'settings', 'platform_config'), sanitized, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// ==========================================
// 14. DATABASE INITIAL SEEDING (FOR PRODUCTION READY SETUP)
// ==========================================
export async function bootstrapProductionDatabaseIfEmpty() {
  if (!auth.currentUser) {
    return;
  }
  try {
    // Check if settings doc already exists
    const settingsDoc = await getDoc(doc(db, 'settings', 'platform_config'));
    if (settingsDoc.exists()) {
      return; // Already initialized!
    }

    console.log('Initializing production Firestore database for Nabough platform...');

    // 1. Initial Platform Settings
    const defaultSettings: PlatformSetting = {
      systemName: 'منصة نَبُوغ التعليمية — كلية التربية',
      currentAcademicYear: '2025 / 2026',
      currentSemester: 'الفصل الدراسي الثاني',
      studentRegistrationOpen: true,
      allowStudentUploads: true,
      maintenanceMode: false,
      allowLeaderAnnouncements: true,
      defaultDoctorStorageLimitGB: 10,
    };
    await setDoc(doc(db, 'settings', 'platform_config'), defaultSettings);

    // 2. Official College Registry for Egyptian National ID student onboarding
    const officialStudents: CollegeStudentRecord[] = [
      {
        nationalId: '30309211204856',
        phone: '01012345678',
        fullName: 'أحمد محمود إبراهيم النجار',
        faculty: 'كلية التربية',
        department: 'قسم علم النفس التربوي والصحة النفسية',
        specialization: 'شعبة علم النفس التربوي',
        level: 'الفرقة الثالثة',
        section: 'الشعبة الثانية (ب)',
        studentId: 'EDU-2023-4109',
        gpa: 3.82,
        completedCreditHours: 94,
        totalCreditHours: 132,
        academicYear: '2025 / 2026',
        isRegisteredAccount: true,
      },
      {
        nationalId: '30305141203344',
        phone: '01099887766',
        fullName: 'محمد إبراهيم حسنين (ليدر)',
        faculty: 'كلية التربية',
        department: 'قسم المناهج وطرق التدريس',
        specialization: 'شعبة اللغة العربية',
        level: 'الفرقة الثالثة',
        section: 'الشعبة الأولى (أ)',
        studentId: 'EDU-2023-3882',
        gpa: 3.91,
        completedCreditHours: 98,
        totalCreditHours: 132,
        academicYear: '2025 / 2026',
        isRegisteredAccount: true,
      },
      {
        nationalId: '30401101402211',
        phone: '01044556677',
        fullName: 'سارة عبد الرحمن محمود (منسقة)',
        faculty: 'كلية التربية',
        department: 'قسم تكنولوجيا التعليم والمعلومات',
        specialization: 'شعبة الحاسب الآلي والتعليم الرقمي',
        level: 'الفرقة الرابعة',
        section: 'الشعبة الأولى',
        studentId: 'EDU-2022-2114',
        gpa: 3.88,
        completedCreditHours: 118,
        totalCreditHours: 136,
        academicYear: '2025 / 2026',
        isRegisteredAccount: true,
      },
      {
        nationalId: '30402181401234',
        phone: '01023456789',
        fullName: 'يوسف كريم منصور رضوان',
        faculty: 'كلية التربية',
        department: 'قسم علم النفس التربوي والصحة النفسية',
        specialization: 'شعبة علم النفس المدرسي',
        level: 'الفرقة الثالثة',
        section: 'الشعبة الثانية (ب)',
        studentId: 'EDU-2023-5520',
        gpa: 3.65,
        completedCreditHours: 92,
        totalCreditHours: 132,
        academicYear: '2025 / 2026',
        isRegisteredAccount: false,
      },
    ];

    for (const std of officialStudents) {
      await setDoc(doc(db, 'collegeRegistry', std.nationalId), std);
    }

    // 3. Official Courses
    const courses: Subject[] = [
      {
        id: 'sub_01',
        code: 'PSY-301',
        name: 'علم النفس التربوي المتقدم',
        instructor: 'أ.د. عصام عبد الرحمن الشناوي',
        department: 'قسم علم النفس التربوي',
        creditHours: 3,
        room: 'مدرج 4 (مبنى ج)',
        scheduleTime: 'الأحد 09:00 - 11:00 ص',
        color: 'from-blue-600 to-indigo-700',
        progress: 68,
        description: 'دراسة متعمقة لنظريات التعلم المعرفية وتطبيقاتها في البيئة الصفية المصرية.',
        totalLectures: 12,
        completedLectures: 8,
        totalFiles: 14,
        iconName: 'Brain',
      },
      {
        id: 'sub_02',
        code: 'MET-302',
        name: 'استراتيجيات التدريس الفعال والنشط',
        instructor: 'د. منى عبد الفتاح قنديل',
        department: 'قسم المناهج وطرق التدريس',
        creditHours: 3,
        room: 'قاعة 12 (مبنى ب)',
        scheduleTime: 'الإثنين 11:30 - 01:30 م',
        color: 'from-purple-600 to-pink-600',
        progress: 75,
        description: 'تصميم وتنفيذ مواقف التعلم النشط وتطبيق أساليب التفكير الناقد والإبداعي.',
        totalLectures: 10,
        completedLectures: 7,
        totalFiles: 18,
        iconName: 'Sparkles',
      },
      {
        id: 'sub_03',
        code: 'TEC-303',
        name: 'تكنولوجيا التعليم والوسائط التفاعلية',
        instructor: 'د. حسام الدين نبيل الغندور',
        department: 'قسم تكنولوجيا التعليم',
        creditHours: 2,
        room: 'معمل الحاسب المتقدم 2',
        scheduleTime: 'الثلاثاء 09:00 - 11:00 ص',
        color: 'from-emerald-600 to-teal-700',
        progress: 80,
        description: 'إنتاج الوسائط المتعددة التعليمية وبناء بيئات التعلم المدمج والافتراضي.',
        totalLectures: 10,
        completedLectures: 8,
        totalFiles: 12,
        iconName: 'Laptop',
      },
      {
        id: 'sub_04',
        code: 'EVA-304',
        name: 'التقويم والقياس التربوي وبناء الاختبارات',
        instructor: 'أ.د. نادية محمود السيد',
        department: 'قسم علم النفس التربوي',
        creditHours: 3,
        room: 'مدرج 2 (مبنى أ)',
        scheduleTime: 'الأربعاء 10:00 - 12:00 م',
        color: 'from-amber-600 to-orange-600',
        progress: 60,
        description: 'معايير إعداد الاختبارات التحصيلية، جدول المواصفات، والتحليل الإحصائي للفقرات.',
        totalLectures: 12,
        completedLectures: 7,
        totalFiles: 15,
        iconName: 'CheckSquare',
      },
      {
        id: 'sub_05',
        code: 'PRAC-305',
        name: 'التربية العملية والمشاهدة الميدانية',
        instructor: 'د. خالد إبراهيم الدسوقي',
        department: 'مكتب التدريب الميداني',
        creditHours: 4,
        room: 'مدارس التجريبيات الشريكة',
        scheduleTime: 'الخميس 08:30 - 01:30 م',
        color: 'from-rose-600 to-red-700',
        progress: 85,
        description: 'التدريب الميداني بالمدارس الحكومية والتجريبية والملاحظة الصفية الموجهة.',
        totalLectures: 8,
        completedLectures: 7,
        totalFiles: 9,
        iconName: 'Briefcase',
      },
    ];

    for (const c of courses) {
      await setDoc(doc(db, 'courses', c.id), c);
    }

    // 4. Official Lectures
    const lectures: Lecture[] = [
      {
        id: 'lec_01',
        subjectId: 'sub_01',
        subjectName: 'علم النفس التربوي المتقدم',
        title: 'نظريات التعلم المعرفية وتطبيقاتها الصفية',
        number: 1,
        instructor: 'أ.د. عصام عبد الرحمن الشناوي',
        date: '2026-03-01',
        room: 'مدرج 4 (مبنى ج)',
        duration: '1:45:00',
        durationSeconds: 6300,
        audioUrl: 'https://archive.org/download/sample-educational-audio/cognitive_learning.mp3',
        description: 'شرح مفصل لنظرية بياجيه وفيجوتسكي في النمو المعرفي والمفاهيم الأساسية لنطاق النمو التقريبي (ZPD).',
        progressPercent: 100,
        isBookmarked: true,
        notesCount: 4,
        questionsCount: 15,
        timestampNotes: [
          { timeInSeconds: 300, displayTime: '05:00', text: 'مقدمة في الانتقال من السلوكية إلى المعرفية' },
          { timeInSeconds: 1200, displayTime: '20:00', text: 'مراحل التطور العقلي الأربعة عند جان بياجيه' },
          { timeInSeconds: 2700, displayTime: '45:00', text: 'الدعائم التعليمية ونظرية النشاط الاجتماعي لفيجوتسكي' },
        ],
      },
      {
        id: 'lec_02',
        subjectId: 'sub_02',
        subjectName: 'استراتيجيات التدريس الفعال والنشط',
        title: 'استراتيجيات التعلم التعاوني وحل المشكلات',
        number: 2,
        instructor: 'د. منى عبد الفتاح قنديل',
        date: '2026-03-08',
        room: 'قاعة 12 (مبنى ب)',
        duration: '1:30:00',
        durationSeconds: 5400,
        audioUrl: 'https://archive.org/download/sample-educational-audio/active_learning.mp3',
        description: 'الخطوات العملية لتطبيق التعلم التعاوني وتقسيم المجموعات واستراتيجية فكر - زاوج - شارك.',
        progressPercent: 70,
        isBookmarked: false,
        notesCount: 2,
        questionsCount: 10,
        timestampNotes: [
          { timeInSeconds: 600, displayTime: '10:00', text: 'الفرق بين العمل الجماعي والتعلم التعاوني الحقيقي' },
          { timeInSeconds: 2400, displayTime: '40:00', text: 'أدوار المتعلمين داخل مجموعات العمل التعاونية' },
        ],
      },
    ];

    for (const l of lectures) {
      await setDoc(doc(db, 'lectures', l.id), l);
    }

    // 5. Official Schedules
    const schedules: ScheduleItem[] = [
      {
        id: 'sch_01',
        subject: 'علم النفس التربوي المتقدم',
        subjectId: 'sub_01',
        instructor: 'أ.د. عصام عبد الرحمن الشناوي',
        room: 'مدرج 4 (مبنى ج)',
        day: 'Sunday',
        dayArabic: 'الأحد',
        startTime: '09:00 ص',
        endTime: '11:00 ص',
        duration: 'ساعتان',
        type: 'lecture',
        isToday: false,
      },
      {
        id: 'sch_02',
        subject: 'استراتيجيات التدريس الفعال',
        subjectId: 'sub_02',
        instructor: 'د. منى عبد الفتاح قنديل',
        room: 'قاعة 12 (مبنى ب)',
        day: 'Monday',
        dayArabic: 'الإثنين',
        startTime: '11:30 ص',
        endTime: '01:30 م',
        duration: 'ساعتان',
        type: 'lecture',
        isToday: true,
      },
      {
        id: 'sch_03',
        subject: 'تكنولوجيا التعليم والوسائط',
        subjectId: 'sub_03',
        instructor: 'د. حسام الدين نبيل',
        room: 'معمل الحاسب 2',
        day: 'Tuesday',
        dayArabic: 'الثلاثاء',
        startTime: '09:00 ص',
        endTime: '11:00 ص',
        duration: 'ساعتان',
        type: 'lab',
        isToday: false,
      },
    ];

    for (const s of schedules) {
      await setDoc(doc(db, 'schedules', s.id), s);
    }

    // 6. Official Announcements
    const announcements: GroupAnnouncement[] = [
      {
        id: 'ann_01',
        title: 'موعد تسليم خطط دروس التربية العملية (التدريب الميداني)',
        content: 'تنويه لجميع طلاب الفرقة الثالثة والرابعة: آخر موعد لتسليم كراسات التحضير وخطط الدروس المعتمدة من مديري المدارس الشريكة هو يوم الخميس القادم بمكتب منسق التدريب.',
        authorName: 'أ.د. عصام عبد الرحمن',
        authorRole: 'doctor',
        scope: 'جميع الفرق - التربية العملية',
        createdAt: 'اليوم 09:30 ص',
        isUrgent: true,
        likesCount: 34,
      },
      {
        id: 'ann_02',
        title: 'تحديد قاعة المحاضرة التعويضية لمادة التقويم التربوي',
        content: 'تقرر عقد المحاضرة التعويضية لمادة القياس والتقويم يوم الثلاثاء القادم بمدرج 1 الساعة العاشرة صباحاً.',
        authorName: 'محمد حسنين (ليدر)',
        authorRole: 'student',
        authorPosition: 'leader',
        scope: 'الفرقة الثالثة - الشعبة العامة',
        createdAt: 'أمس 04:15 م',
        isUrgent: false,
        likesCount: 19,
      },
    ];

    for (const a of announcements) {
      await setDoc(doc(db, 'announcements', a.id), a);
    }

    // 7. Initial Activity Log
    await logActivityToFirestore({
      actorName: 'نظام نَبُوغ المركزي',
      actorRole: 'super_admin',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'platform',
      entityName: 'تهيئة منصة كلية التربية وقاعدة بيانات الفايربيس الرسمية',
      metadata: { initializedAt: new Date().toISOString() },
    });

    console.log('Production database successfully seeded with official college data!');
  } catch (error) {
    console.error('Error during database bootstrap:', error);
  }
}
