import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface GeminiContextType {
    apiKey: string;
    saveApiKey: (key: string) => void;
    removeApiKey: () => void;
}

const GeminiContext = createContext<GeminiContextType>({} as GeminiContextType);

export function GeminiContextProvider({ children }: { children: ReactNode }) {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");

    useEffect(() => {
        // Sync state with localStorage if it changes explicitly elsewhere (optional but good practice)
        const handleStorageChange = () => {
            setApiKey(localStorage.getItem("gemini_api_key") || "");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const saveApiKey = (key: string) => {
        localStorage.setItem("gemini_api_key", key);
        setApiKey(key);
    };

    const removeApiKey = () => {
        localStorage.removeItem("gemini_api_key");
        setApiKey("");
    };

    return (
        <GeminiContext.Provider value={{ apiKey, saveApiKey, removeApiKey }}>
            {children}
        </GeminiContext.Provider>
    );
}

export function useGemini() {
    return useContext(GeminiContext);
}
