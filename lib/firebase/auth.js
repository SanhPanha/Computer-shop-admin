import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebaseConfiguration";
import { getFirestore, doc, setDoc } from "firebase/firestore"
;
const db = getFirestore();

const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'The email is already in use. Please use a different email.';
      case 'auth/user-not-found':
        return 'No account found with the provided email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(getErrorMessage(error));
    }
  };
  

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      throw error; // Rethrow the error for further handling
    }
  };
  

  export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  
    // Add user to Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    });
  
    return user;
  };

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    return updatePassword(auth.currentUser, password);
  };
  

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `/`,
  });
};
