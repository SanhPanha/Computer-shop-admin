'use client';
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfiguration";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Loading from "@/app/loading";


// Define the shape of the AuthContext value
interface AuthContextType {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

// Create the AuthContext with a default value of undefined
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  console.log("useAuth called, context:", context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCurrentUser(user);

  //       // Check if provider is email and password login
  //       const isEmail = user.providerData.some(
  //         (provider) => provider.providerId === "password"
  //       );
  //       setIsEmailUser(isEmail);

  //       // Check if provider is Google
  //       const isGoogle = user.providerData.some(
  //         (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
  //       );
  //       setIsGoogleUser(isGoogle);

  //       setUserLoggedIn(true);
  //     } else {
  //       setCurrentUser(null);
  //       setUserLoggedIn(false);
  //     }

  //     setLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsEmailUser(
          user.providerData.some(
            (provider) => provider.providerId === "password"
          )
        );
        setIsGoogleUser(
          user.providerData.some(
            (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
          )
        );
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIsEmailUser(false);
        setIsGoogleUser(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);

      // Redirect to the home page after logout
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value: AuthContextType = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
       {!loading ? 
        children : 
        <Loading />
      }
    </AuthContext.Provider>
  );
}

