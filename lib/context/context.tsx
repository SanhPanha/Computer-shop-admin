'use client';
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfiguration";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

// Define the shape of the AuthContext value
type AuthContextType = {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

// Create the AuthContext with a default value of undefined
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
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
  const router = useRouter();

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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value: AuthContextType = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    setCurrentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}
