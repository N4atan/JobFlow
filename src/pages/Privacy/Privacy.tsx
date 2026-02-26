
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export const PrivacyPage = () => {

  const location = useLocation();

  const { redirection } = location.state || {};

  if (redirection) {
    toast.error("Você foi redirecionado para esta página porque ainda não confirmou a leitura e o aceite dos termos de processamento de dados do JobFlow.")
  }


  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 md:p-12">
      <div className="max-w-3xl mx-auto">



        {/* TÍTULO PRINCIPAL */}
        <header className="mb-12 border-b border-base-300 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">
            Política de Privacidade <span className="text-primary">/</span> Termos de Uso
          </h1>
          <p className="text-lg opacity-60 leading-relaxed">
            Este documento detalha como o JobFlow interage com a sua conta Google e como os seus dados são processados pela Inteligência Artificial.
          </p>
        </header>

        {/* CONTEÚDO DOS TERMOS */}
        <div className="space-y-10">

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              01. Acesso à API do Gmail
            </h2>
            <p className="leading-relaxed">
              O JobFlow solicita acesso à sua conta através do Google OAuth. Utilizamos esta permissão exclusivamente para listar e ler mensagens de e-mail que contenham confirmações de candidaturas, agendamentos de entrevistas ou feedbacks de recrutamento. O sistema filtra as mensagens para garantir que apenas conteúdos profissionais sejam processados.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              02. Processamento via Google Gemini
            </h2>
            <p className="leading-relaxed">
              Para automatizar a organização do seu dashboard, o conteúdo dos e-mails identificados é enviado para o modelo de sua escolha. A IA realiza a extração semântica de dados estruturados (nome da empresa, título da vaga e status). Este envio é feito via conexão encriptada diretamente entre o seu navegador e os servidores da Google.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              03. Armazenamento e LocalStorage
            </h2>
            <p className="leading-relaxed">
              O JobFlow não possui base de dados centralizada para o corpo dos seus e-mails.
              <span className="block mt-4 p-4 bg-base-200 font-mono text-xs">
                {`// Segurança de Dados:
                - Email Body: Nunca armazenado.
                - Gemini API Key: Salva apenas no seu LocalStorage.
                - Dados das Vagas: Persistidos apenas no seu navegador.`}
              </span>
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              04. Conformidade LGPD
            </h2>
            <p className="leading-relaxed">
              Em conformidade com a Lei Geral de Proteção de Dados, você mantém total controlo sobre as suas informações. Pode remover a sua API Key, limpar os dados locais ou revogar o acesso do JobFlow à sua Conta Google a qualquer momento através das definições de segurança do Google.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
              05. Como aceitar os termos
            </h2>
            
            <ul className="list-decimal list-inside space-y-3 text-sm opacity-80">
              <li>Clique na sua <strong>foto de perfil</strong> no canto superior direito do app.</li>
              <li>Acesse o menu de <strong>Configurações da IA</strong>.</li>
              <li>Marque a <strong>checkbox</strong> de aceite.</li>
              <li>Salve as configurações para ativar o Dashboard.</li>
            </ul>
          </section>

        </div>


      </div>
    </div>
  );
};

