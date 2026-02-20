import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, type User, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../services/firebase";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    useEffect(() => {
        let unsubscribe: () => void; // Criar a variável fora

        async function initAuth() {
            setLoading(true);
            try {
                // 1. Tenta capturar o resultado do redirect primeiro
                const result = await getRedirectResult(auth);
                if (result) {
                    alert("Login capturado com sucesso!");
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    if (token) {
                        setAccessToken(token);
                        localStorage.setItem("@jobflow:google-token", token);
                    }
                }
            } catch (error: any) {
                console.error("Erro no redirect:", error);
                alert("Erro ao recuperar login: " + (error.message || "Erro desconhecido"));
            }

            // 2. Atribuir a subscrição à variável externa para o cleanup funcionar
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                if (!currentUser) {
                    setAccessToken(null);
                    localStorage.removeItem("@jobflow:google-token");
                }
                setLoading(false); // Só libera o app aqui
            });
        }

        initAuth();

        // O useEffect deve retornar uma função simples de limpeza
        return () => {
            if (unsubscribe) unsubscribe();
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
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            const message = error.message || "Erro ao entrar com o Google";
            alert(message);
            throw new Error(message);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("@jobflow:google-token");
            setAccessToken(null);
            navigate('/', { replace: true })
        } catch (error: any) {
            console.error("Error signing out", error);
            const message = error.message || "Erro ao sair";
            alert(message);
            throw new Error(message);
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