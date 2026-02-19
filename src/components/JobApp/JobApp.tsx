import { faBuilding, faLocationDot, faMoneyBill, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type JobAppProps = {
    job: {
        id: string;
        empresa: string;
        cargo: string;
        dominio: string;
        status: string;
        localizacao: string;
        data_iso: string;
        resumo: string;
        url: string;
    }
}


export const JobApp = ({ job }: JobAppProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Candidatado':
                return 'badge-primary';
            case 'Entrevista':
                return 'badge-accent';
            case 'Negativa':
                return 'badge-error';
            case 'Aguardando Teste':
                return 'badge-warning';
            default:
                return 'badge-soft';
        }
    }

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">

                <div className="flex justify-between">
                    <h2 className="card-title text-lg font-bold">{job.cargo}</h2>
                    <div className="avatar">
                        <div className="w-8 rounded cursor-pointer" onClick={() => window.open(`${job.url}`, '_blank')}>
                            <img
                                src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${job.dominio}&size=128`} alt={`${job.empresa} logo`}
                            />
                        </div>
                    </div>
                </div>


                <ul className="flex flex-col gap-2 text-xs">
                    <li>
                        <FontAwesomeIcon icon={faBuilding} className="size-4 me-2 inline-block" />
                        <span>Empresa: {job.empresa}</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faLocationDot} className="size-4 me-2 inline-block" />
                        <span>Localização: {job.localizacao}</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faMoneyBill} className="size-4 me-2 inline-block" />
                        <span>Média Salarial: -</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faCalendar} className="size-4 me-2 inline-block" />
                        <span>Data da Candidatura: {job.data_iso}</span>
                    </li>
                </ul>

                <div className="card-actions justify-end mt-4">
                    <span className={`badge badge-soft ${getStatusColor(job.status)}`}>{job.status}</span>
                </div>
            </div>
        </div>
    )
}