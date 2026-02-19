import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { fetchJobApplications } from "../../services/gmail";
import { useEffect, useState } from "react";
import { JobApp } from "../../components/JobApp/JobApp";
import { getApiKey } from "../../services/gemini";



export function Applications() {
    const { user, accessToken } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Todos");


    const filteredJobs = jobs.filter((job: any) => {
        if (statusFilter === "Todos") return true;
        return job.status === statusFilter;
    });

    const loadData = async (reset: boolean = false) => {
        try {
            if (!accessToken) return;
            setLoading(true);

            const tokenToUse = reset ? null : nextPageToken;

            if (reset) {
                setJobs([]);
                setNextPageToken(null);
            }

            const data = await fetchJobApplications(accessToken, 30, tokenToUse);

            setJobs(prev => reset ? (data.jobs || []) : [...prev, ...(data.jobs || [])]);
            setNextPageToken(data.nextPageToken);

        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData(true);
    }, [accessToken]);

    if (!user || !accessToken) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Você precisa estar logado para acessar esta página</h1>
                    <p className="text-gray-600">Faça login para continuar</p>
                </div>
            </div>
        )
    }

    if (!getApiKey()) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Você precisa adicionar uma chave de API para acessar esta página</h1>
                    <p className="text-gray-600">Adicione sua chave de API para continuar</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex gap-4 p-4 flex-wrap justify-between lg:w-10/12 lg:mx-auto">
                <button className="btn btn-outline btn-primary" onClick={() => loadData(true)}>
                    <FontAwesomeIcon icon={faRefresh} className="size-4 me-2 inline-block" />
                    Recarregar Vagas
                </button>


                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered"
                >
                    <option value="Todos">Todos</option>
                    <option value="Candidatado">Candidatado</option>
                    <option value="Entrevista">Entrevista</option>
                    <option value="Negativa">Negativa</option>
                    <option value="Aguardando Teste">Aguardando Teste</option>
                </select>

            </div>

            <div className="flex gap-4 p-4 justify-center flex-wrap mb-8">
                {filteredJobs.map((job: any) => (
                    <JobApp key={job.id} job={job} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center p-4">
                    <span className="loading loading-infinity loading-xl"></span>
                </div>
            )}

            {!loading && nextPageToken && (
                <div className="flex justify-center p-4 pb-10">
                    <button className="btn btn-wide btn-primary" onClick={() => loadData(false)}>
                        Carregar Mais
                    </button>
                </div>
            )}
        </>
    )
}