import {
  signInWithPopup
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

// Unified Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      error: null
    };
  } catch (error) {
    return {
      user: null,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};
