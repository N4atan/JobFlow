import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import './home.css';
import { JobApp } from "../../components/JobApp/JobApp";



export default function PageHome() {
  const { signInWithGoogle, loading, user } = useAuth();

  return (
    <main className="hero bg-base-100 min-h-screen p-4 lg:p-10 fundo-quadriculado">
      <div className="hero-content flex-col gap-8 lg:gap-16">
        <div className="w-full lg:w-11/12 text-center lg:p-10">
          <h1 className="text-6xl font-bold uppercase tracking-tighter italic">
            Transforme seu Gmail no seu Dashboard de Vagas.
          </h1>

          <p className="text-lg my-5">
            O JobFlow utiliza inteligência artificial para minerar automaticamente suas
            candidaturas no e-mail, organizando status, empresas e feedbacks em um só lugar.
          </p>

          {!user ? (
            <button onClick={signInWithGoogle} className="btn bg-base-100 text-black border-[#e5e5e5] lg:w-1/2 mt-10">
              {loading ? 'Carregando...' :
                <>
                  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill='transparent'></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                  Login with Google
                </>
              }
            </button>
          ) : (
            <NavLink to='/applications' className="btn btn-outline btn-default lg:w-1/2 mt-10">
              Ver candidaturas
            </NavLink>
          )}
        </div>



        <div className="mockup-browser border border-base-300 bg-base-100 shadow-2xl w-full lg:w-11/12 shadow-md">
          <div className="mockup-browser-toolbar border-b-1 border-base-300 pb-4">
            <div className="input border border-base-300">app.jobflow.com/dashboard</div>
          </div>
          <div className="flex flex-col gap-4 p-8 bg-base-100">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">Suas Candidaturas</h2>
              <div className="badge badge-outline badge-primary hidden lg:block">12 novas hoje</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-center px-1 lg:px-0">
              {/* Card Simulado 1 */}
              <JobApp job={{ cargo: "Desenvolvedor Web", empresa: "Google", dominio: "google.com", status: "Entrevista", data_iso: `${new Date().toISOString().split('T')[0]}`, localizacao: "Remoto", url: "/" }} />
              {/* Card Simulado 2 com Skeleton (dá um ar de "carregando dados") */}
              <div className="skeleton h-60 w-full lg:w-96"></div>
              <div className="skeleton h-60 w-full lg:w-96 hidden lg:block"></div>
              <div className="skeleton h-60 w-full lg:w-96 hidden lg:block"></div>
            </div>
          </div>
        </div>

      </div>
    </main>

  )
}


