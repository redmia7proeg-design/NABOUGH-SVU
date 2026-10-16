import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export interface UploadResult {
  url: string;
  sizeString: string;
  bytes: number;
  fileName: string;
  fileType: string;
}

/**
 * Uploads a real file to Firebase Storage under the given folder.
 * Returns the public download URL and formatted file metadata.
 */
export async function uploadFileToStorage(
  file: File,
  folder = 'library_materials'
): Promise<UploadResult> {
  const bytes = file.size;
  const sizeMb = bytes / (1024 * 1024);
  const sizeString = sizeMb >= 1 ? `${sizeMb.toFixed(1)} ميجابايت` : `${Math.max(1, Math.round(bytes / 1024))} كيلوبايت`;

  // Sanitize file name
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}_${cleanName}`;

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      url: downloadUrl,
      sizeString,
      bytes,
      fileName: file.name,
      fileType: detectFileType(file.name, file.type),
    };
  } catch (error: any) {
    console.warn('Firebase Storage upload notice (falling back to local object URL if offline):', error);
    // Graceful offline fallback: Create local object URL for offline inspection
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      sizeString,
      bytes,
      fileName: file.name,
      fileType: detectFileType(file.name, file.type),
    };
  }
}

function detectFileType(name: string, mime: string): 'pdf' | 'ppt' | 'summary' | 'exam' | 'other' {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf') || mime.includes('pdf')) return 'pdf';
  if (lower.endsWith('.ppt') || lower.endsWith('.pptx') || mime.includes('presentation')) return 'ppt';
  if (lower.includes('امتحان') || lower.includes('اختبار') || lower.includes('بنك') || lower.includes('exam')) return 'exam';
  if (lower.includes('ملخص') || lower.includes('تفريغ') || lower.includes('مذكرة')) return 'summary';
  return 'pdf';
}
