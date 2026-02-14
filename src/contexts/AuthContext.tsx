import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth, provider } from "../services/firebase";

interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                signInWithRedirect(auth, provider);
            } else {
                signInWithPopup(auth, provider);
            }
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, logOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
