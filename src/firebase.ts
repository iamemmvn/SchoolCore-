import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  User,
  browserLocalPersistence,
  setPersistence,
  initializeAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where,
  deleteDoc,
  writeBatch,
  getDocFromServer,
  enableMultiTabIndexedDbPersistence,
  addDoc,
  updateDoc,
  collectionGroup,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
console.log(`Initializing Firebase with Project ID: ${firebaseConfig.projectId}`);
const app = initializeApp(firebaseConfig);

// Initialize Auth with explicit persistence for better iframe support
// This reduces 'auth/network-request-failed' by ensuring persistence is handled correctly
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

console.log(`Initializing Firestore with Database ID: ${firebaseConfig.firestoreDatabaseId}`);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
}, firebaseConfig.firestoreDatabaseId);

// Offline Persistence Support for Firestore
enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser doesn\'t support all of the features required to enable persistence');
    }
});

export const googleProvider = new GoogleAuthProvider();

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  writeBatch,
  getDocFromServer,
  addDoc,
  updateDoc,
  collectionGroup,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment
};

// Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Test with timeout and retries
export async function testFirestoreConnection(retries = 3, timeoutMs = 15000) {
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`connection timeout (attempt ${attempt}/${retries})`)), timeoutMs)
    );

    try {
      console.log(`Testing Firestore connectivity (attempt ${attempt}/${retries})...`);
      
      await Promise.race([
        getDocFromServer(doc(db, 'test', 'connection')),
        timeoutPromise
      ]);
      
      console.log("Firestore connection successful");
      return; // Connection succeeded!
    } catch (error) {
      lastError = error;
      
      // If we receive a permission-denied or security-rules rejection from Firestore,
      // it means we successfully reached the backend and it answered. This is a working connection!
      const isPermissionDenied = error && typeof error === 'object' && (
        ('code' in error && (error.code === 'permission-denied' || error.code === 'unauthenticated')) ||
        ('message' in error && typeof error.message === 'string' && (
          error.message.includes('permission') || 
          error.message.includes('unauthenticated') ||
          error.message.includes('insufficient permissions')
        ))
      );

      if (isPermissionDenied) {
        console.log("Firestore connection verified successfully via security rules response (permission-denied)");
        return; // Treated as connected!
      }

      console.warn(`Firestore connection attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt < retries) {
        // Linear backoff before retry (1s, 2s)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  if (lastError instanceof Error) {
    if (lastError.message.includes('the client is offline') || lastError.message.includes('connection timeout')) {
      console.warn("Firestore appears to be in offline mode. Check connectivity or Firebase config.");
    } else if (lastError.message.includes('code=unavailable')) {
      console.error("CRITICAL: Firestore backend unavailable. This might be a DNS or regional issue.");
    } else {
      console.error("Firestore test failed after all attempts:", lastError);
    }
  }
  throw lastError || new Error("Firestore connection test failed after retries");
}
