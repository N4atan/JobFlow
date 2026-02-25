import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { fetchJobApplications } from "../services/gmail";
import toast from "react-hot-toast";
import { geminiErrorHandler } from "../helpers/geminiErrorHandler";
import { gmailErrorHandler } from "../helpers/gmailErrorHandler";

interface JobContextType {
    jobs: any[];
    loadJobs: (reset?: boolean) => Promise<void>;
    setJobs: (jobs: any[]) => void;
    nextPageToken?: string | null;
    loading: boolean;
}

export const JobContext = createContext<JobContextType>({} as JobContextType);

export function JobContextProvider({ children }: { children: ReactNode }) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { accessToken, refreshTokenSilently } = useAuth();

    const loadJobs = async (reset: boolean = false) => {
        try {
            if (!accessToken) {
                toast.error("Você precisa estar logado para carregar as vagas.");
                return;
            };
            setLoading(true);

            const tokenToUse = reset ? null : nextPageToken;

            if (reset) {
                setJobs([]);
                setNextPageToken(null);
            }

            const data = await fetchJobApplications(accessToken, 30, tokenToUse, refreshTokenSilently);

            setJobs(prev => reset ? (data.jobs || []) : [...prev, ...(data.jobs || [])]);
            setNextPageToken(data.nextPageToken);

        } catch (error: any) {
            console.error("LoadData error:", error);
            if (error.isGeminiError) {
                toast.error(geminiErrorHandler(error));
            } else {
                toast.error(gmailErrorHandler(error));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <JobContext.Provider value={{ jobs, setJobs, loading, loadJobs }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJob() {
    return useContext(JobContext);
}