import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, type User, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../services/firebase";

interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
    loading: boolean;
    accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("@jobflow:google-token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isSubscribed = true;

        const initializeAuth = async () => {
            try {
                // 1. Primeiro, tenta pegar o resultado do redirecionamento
                const result = await getRedirectResult(auth);
                if (result && isSubscribed) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    if (token) {
                        setAccessToken(token);
                        localStorage.setItem("@jobflow:google-token", token);
                    }
                }
            } catch (error) {
                console.error("Erro no redirect:", error);
            }

            // 2. Depois (ou em paralelo), escuta a mudança de estado
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                if (isSubscribed) {
                    setUser(currentUser);
                    if (!currentUser) {
                        setAccessToken(null);
                        localStorage.removeItem("@jobflow:google-token");
                    }
                    setLoading(false); // Só termina o loading aqui
                }
            });

            return unsubscribe;
        };

        const unsubscribePromise = initializeAuth();

        return () => {
            isSubscribed = false;
            unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const isMobile = window.innerWidth <= 768; // Simple mobile check

            if (isMobile) {
                await signInWithRedirect(auth, provider);
                // Redirect happens here, code execution stops until return
            } else {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;

                if (token) {
                    setAccessToken(token);
                    localStorage.setItem("@jobflow:google-token", token);
                }
            }
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw new Error("Error signing in with Google");
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("@jobflow:google-token");
            setAccessToken(null);
        } catch (error) {
            console.error("Error signing out", error);
            throw new Error("Error signing out");
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, logOut, loading, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}