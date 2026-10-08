import { useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth, authConfigured } from "../services/auth";
import { AuthContext } from "./AuthContext";
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(authConfigured);
  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, (value) => {
      setUser(value);
      setLoading(false);
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: authConfigured,
        signIn: async (email, password) => {
          if (!firebaseAuth)
            throw new Error("Firebase Auth configuration pending.");
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        },
        signUp: async (email, password, name) => {
          if (!firebaseAuth)
            throw new Error("Firebase Auth configuration pending.");
          const result = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          await updateProfile(result.user, { displayName: name });
          setUser(result.user);
        },
        signOut: async () => {
          if (firebaseAuth) await signOut(firebaseAuth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
