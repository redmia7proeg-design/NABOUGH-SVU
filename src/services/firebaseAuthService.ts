import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/firestoreErrors';
import { UserProfile, Role, StudentPosition, AuthAccount } from '../types';
import { logActivityToFirestore, lookupCollegeStudentRecord, sanitizeForFirestore } from './firestoreDataService';

// Format email identifier for Firebase Auth
export function normalizeIdentifierToEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (clean === 'admin@kjb' || clean === 'adminkjb') {
    return 'admin@kjb.edu';
  }
  if (clean.includes('@')) {
    return clean;
  }
  // If digits (phone or national ID), create standard email
  return `${clean.replace(/[^a-z0-9]/g, '')}@student.nabough.edu`;
}

// Map role to target dashboard tab
export function getInitialDashboardTabForRole(role: Role): string {
  switch (role) {
    case 'super_admin':
      return 'super_admin_panel';
    case 'admin':
      return 'super_admin_panel';
    case 'doctor':
    case 'teacher':
      return 'teachers';
    case 'coordinator':
      return 'practical_training';
    case 'student':
    default:
      return 'home';
  }
}

// Resolve user's actual email from Firestore by phone, nationalId, studentId or email
export async function resolveEmailFromIdentifier(identifier: string): Promise<string> {
  const clean = identifier.trim();
  const lower = clean.toLowerCase();

  if (lower === 'admin@kjb') {
    return 'admin@kjb.edu';
  }

  if (lower.includes('@')) {
    return lower;
  }

  // Look up in users collection
  try {
    const usersRef = collection(db, 'users');

    // Check phone
    const qPhone = query(usersRef, where('phone', '==', clean));
    const snapPhone = await getDocs(qPhone);
    if (!snapPhone.empty) {
      return snapPhone.docs[0].data().email;
    }

    // Check nationalId
    const qNat = query(usersRef, where('nationalId', '==', clean));
    const snapNat = await getDocs(qNat);
    if (!snapNat.empty) {
      return snapNat.docs[0].data().email;
    }

    // Check studentId
    const qStd = query(usersRef, where('studentId', '==', clean));
    const snapStd = await getDocs(qStd);
    if (!snapStd.empty) {
      return snapStd.docs[0].data().email;
    }
  } catch (err) {
    console.warn('Error resolving email from identifier:', err);
  }

  // Default synthesis
  return normalizeIdentifierToEmail(clean);
}

// Log in with Real Firebase Auth
export async function loginWithFirebase(
  identifier: string,
  pass: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const emailToUse = await resolveEmailFromIdentifier(identifier);
    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, pass);
    const uid = userCredential.user.uid;
    const userDocSnap = await getDoc(doc(db, 'users', uid));

    if (!userDocSnap.exists()) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: 'الحساب موجود في Firebase لكن لم يتم إنشاء ملف المستخدم داخل المنصة. تواصل مع إدارة نبوغ.',
      };
    }

    const profile = userDocSnap.data() as UserProfile;
    if (profile.status === 'suspended') {
      await firebaseSignOut(auth);
      return { success: false, error: 'تم تعطيل هذا الحساب مؤقتًا من قِبل إدارة منصة نبوغ.' };
    }

    await logActivityToFirestore({
      actorUserId: profile.id,
      actorName: profile.name,
      actorRole: profile.role,
      action: 'LOGIN',
      entityType: 'user',
      entityId: profile.id,
      entityName: profile.name,
    });

    return { success: true, profile };
  } catch (error: any) {
    let errorMessage = 'بيانات الدخول غير صحيحة، يرجى التأكد من البيانات وكلمة المرور.';
    if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password') {
      errorMessage = 'كلمة المرور غير صحيحة أو الحساب غير موجود.';
    } else if (error?.code === 'auth/user-not-found') {
      errorMessage = 'لم يتم العثور على حساب مرتبط بهذه البيانات.';
    } else if (error?.code === 'auth/too-many-requests') {
      errorMessage = 'تمت محاولات كثيرة. حاول مرة أخرى لاحقًا.';
    } else if (error?.code === 'auth/operation-not-allowed') {
      errorMessage = 'تسجيل الدخول بالبريد الإلكتروني غير مفعّل في إعدادات Firebase.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function registerStudentWithRealFirebase(data: {
  nationalId: string;
  phone: string;
  password: string;
}): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const cleanNationalId = data.nationalId.trim();
    const cleanPhone = data.phone.trim();

    // 1. Verify in official college registry
    const collegeRecord = await lookupCollegeStudentRecord(cleanNationalId, cleanPhone);
    if (!collegeRecord) {
      return {
        success: false,
        error: 'لم يتم العثور على قيد رسمي مطابق للرقم القومي ورقم الهاتف في سجلات الكلية.',
      };
    }

    // 2. Form unique auth email
    const email = `${collegeRecord.studentId.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.nabough.edu`;

    // 3. Create Firebase Authentication account
    let userCred;
    try {
      userCred = await createUserWithEmailAndPassword(auth, email, data.password);
    } catch (authErr: any) {
      if (authErr.code === 'auth/email-already-in-use') {
        // Try to sign in with password to see if already registered
        try {
          userCred = await signInWithEmailAndPassword(auth, email, data.password);
        } catch {
          return {
            success: false,
            error: 'يوجد حساب مسجل بالفعل لهذا الطالب في المنصة. يرجى تسجيل الدخول أو استعادة كلمة المرور.',
          };
        }
      } else {
        throw authErr;
      }
    }

    const uid = userCred.user.uid;

    // 4. Create Student Firestore Profile (Without exposing National ID publicly)
    const newProfile: UserProfile = {
      id: uid,
      name: collegeRecord.fullName,
      email: email,
      phone: cleanPhone,
      nationalId: cleanNationalId, // Guarded in profile
      role: 'student',
      studentPosition: 'normal',
      studentPositions: ['normal'],
      faculty: collegeRecord.faculty,
      department: collegeRecord.department,
      specialization: collegeRecord.specialization,
      level: collegeRecord.level,
      section: collegeRecord.section,
      academicYear: collegeRecord.academicYear,
      studentId: collegeRecord.studentId,
      gpa: collegeRecord.gpa,
      totalCreditHours: collegeRecord.totalCreditHours,
      completedCreditHours: collegeRecord.completedCreditHours,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      status: 'active',
      permissions: [],
    };

    await setDoc(doc(db, 'users', uid), sanitizeForFirestore(newProfile));

    // 5. Update college registry status
    await updateDoc(doc(db, 'collegeRegistry', cleanNationalId), {
      isRegisteredAccount: true,
    }).catch(() => {});

    // 6. Log Registration
    await logActivityToFirestore({
      actorUserId: uid,
      actorName: newProfile.name,
      actorRole: 'student',
      action: 'STUDENT_REGISTER',
      entityType: 'user',
      entityId: uid,
      entityName: newProfile.name,
      scope: `${newProfile.level} - ${newProfile.section || ''}`,
    });

    return { success: true, profile: newProfile };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'حدث خطأ أثناء إتمام تسجيل حساب الطالب في Firebase.',
    };
  }
}

// Reset Password with Firebase Auth
export async function sendFirebasePasswordReset(identifier: string): Promise<{ success: boolean; error?: string }> {
  try {
    const email = await resolveEmailFromIdentifier(identifier);
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'تعذر إرسال رابط استعادة كلمة المرور.',
    };
  }
}

// Logout
export async function logoutFromFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}

// Demo accounts are intentionally disabled in production builds.
// All authentication must go through Firebase Authentication and a Firestore user profile.
export async function loginWithDemoAccount(
  _roleKey: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  return { success: false, error: 'تسجيل الدخول التجريبي معطل. استخدم حسابًا حقيقيًا.' };
}
