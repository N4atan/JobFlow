import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { JobApp } from "../../components/JobApp/JobApp";
import { getApiKey } from "../../services/gemini";
import { useJob } from "../../contexts/JobContext";
import { useAuth } from "../../contexts/AuthContext";



export function PageApplications() {
  
    const { jobs, loadJobs, loading } = useJob();
    const { accessToken } = useAuth();
 
    const [statusFilter, setStatusFilter] = useState("Todos");


    const filteredJobs = jobs.filter((job: any) => {
        if (statusFilter === "Todos") return true;
        return job.status === statusFilter;
    });



    if (!getApiKey()) {
        return (
            <div className="card bg-base-100 w-96 shadow-sm mx-auto my-10">
                <div className="card-body">
                    <h1 className="card-title">Você precisa adicionar uma chave de API para acessar esta página</h1>

                    <ul className="steps steps-vertical ">
                        {/* PASSO 1 */}
                        <li className="step step-primary">
                            <div className="text-left w-full pl-4 py-2">
                                <span className="font-bold">Acesse o link</span>
                                <p className="text-sm">Vá para o <a href="https://aistudio.google.com/app/apikey" target="_blank" className="link link-primary font-semibold">Google AI Studio (API Keys)</a>.</p>
                            </div>
                        </li>

                        {/* PASSO 2 */}
                        <li className="step step-primary">
                            <div className="text-left w-full pl-4 py-2">
                                <span className="font-bold">Faça Login</span>
                                <p className="text-sm">Entre com a mesma conta Google que você está usando no projeto.</p>
                            </div>
                        </li>

                        {/* PASSO 3 */}
                        <li className="step step-primary">
                            <div className="text-left w-full pl-4 py-2">
                                <span className="font-bold">Crie a Chave</span>
                                <p className="text-sm">Clique no botão <span className="badge badge-outline font-bold">"Create API key"</span>.</p>
                                <p className="text-xs italic opacity-60">Escolha a opção "Create API key in new project" para isolar as configurações.</p>
                            </div>
                        </li>

                        {/* PASSO 4 */}
                        <li className="step step-primary">
                            <div className="text-left w-full pl-4 py-2">
                                <span className="font-bold">Copie o Código</span>
                                <p className="text-sm">Copie a sequência que começa com <code className="bg-base-300 px-1 rounded">AIza...</code> e guarde em segurança.</p>
                            </div>
                        </li>

                        {/* PASSO 5 */}
                        <li className="step">
                            <div className="text-left w-full pl-4 py-2">
                                <span className="font-bold text-primary">Ative no JobFlow</span>
                                <p className="text-sm">Clique na sua <span className="font-semibold">foto de perfil</span> (topo direito), selecione <span className="font-semibold">"Chave Gemini"</span> e cole o código.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        )
    }

    useEffect(() => {
        loadJobs(true);
    }, [accessToken]);

    return (
        <>
            <div className="flex gap-4 p-4 flex-wrap justify-between lg:w-10/12 lg:mx-auto">
                <button className="btn btn-outline btn-primary" onClick={() => loadJobs(true)} disabled={loading}>
                    <FontAwesomeIcon icon={faRefresh} className="size-4 me-2 inline-block" />
                    Recarregar Vagas
                </button>


                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select select-bordered"
                    disabled={loading}
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
                <div className="flex flex-col justify-center p-4 gap-4 ">
                    <span className="skeleton skeleton-text text-2xl text-center">AI is thinking harder... <span className="loading loading-infinity loading-xl skeleton"></span></span>


                    <div className="flex gap-4 p-4 justify-center flex-wrap mb-8">
                        <div className="flex w-96 flex-col gap-4">
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                        <div className="flex w-96 flex-col gap-4">
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                        <div className="flex w-96 flex-col gap-4">
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && jobs.length > 0 && (
                <div className="flex justify-center p-4 pb-10">
                    <button className="btn btn-wide btn-primary" onClick={() => loadJobs()}>
                        Carregar Mais
                    </button>
                </div>
            )}
        </>
    )
}
