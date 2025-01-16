import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfiguration";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Interfaces
interface FirebaseAuthError extends Error {
  code: string;
}


// Helper to map Firebase Auth errors to user-friendly messages
const getErrorMessage = (error: FirebaseAuthError): string => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "The email is already in use. Please use a different email.";
    case "auth/user-not-found":
      return "No account found with the provided email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

// Add a new user to Firestore
const createUserInFirestore = async (user: User): Promise<void> => {
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(
    userDocRef,
    {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

// Create a user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserInFirestore(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error creating user:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};

// Sign in with a provider (Google/Facebook)
const doSignInWithProvider = async (
  provider: GoogleAuthProvider | FacebookAuthProvider
): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await createUserInFirestore(user);
    return user;
  } catch (error) {
    console.error("Error signing in with provider:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};

export const doSignInWithGoogle = () => doSignInWithProvider(new GoogleAuthProvider());
export const doSignInWithFacebook = () => doSignInWithProvider(new FacebookAuthProvider());

// Reset password
export const doSendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};

// Send email verification
export const doSendEmailVerification = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error("Error sending email verification:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};

// Update user password
export const doUpdatePassword = async (newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", (error as FirebaseAuthError).code, error);
    throw new Error(getErrorMessage(error as FirebaseAuthError));
  }
};
