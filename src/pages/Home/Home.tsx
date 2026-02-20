import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";



export default function PageHome() {
  const { signInWithGoogle, loading, user } = useAuth();

  return (
    <main className="hero bg-base-200 min-h-screen p-4 lg:p-10">
      <div className="hero-content flex-col lg:flex-row gap-8 lg:gap-16">
        <div>
          <h1 className="text-5xl font-bold ">
            Transforme seu Gmail no seu Dashboard de Vagas.
          </h1>

          <p className="text-lg my-5">
            O JobFlow utiliza inteligência artificial para minerar automaticamente suas candidaturas no e-mail, organizando status, empresas e feedbacks em um só lugar. Chega de planilhas manuais.
          </p>

          { !user ? (
            <button onClick={signInWithGoogle} className="btn bg-white text-black border-[#e5e5e5] lg:w-1/2 mt-10">
            {loading ? 'Carregando...' : 
            <>
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
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

        <div className="mockup-window bg-base-100 border border-base-300 w-full lg:w-11/12">
          <div className="grid place-content-center h-80">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              className="max-w-sm rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </main>

  )
}


