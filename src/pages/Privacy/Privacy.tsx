import React from 'react';
import { useNavigate } from 'react-router-dom';


export const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-100 text-base-content antialiased selection:bg-primary/20">
      
      {/* Banner de Alerta (Só aparece se vier redirecionado) */}
      <div className="bg-warning/10 border-b border-warning/20 p-4 text-center">
        <p className="text-sm font-medium text-warning-content flex items-center justify-center gap-2">

          Ação necessária: Leia e aceite os termos para ativar sua conta.
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Cabeçalho Minimalista */}
        <header className="mb-16">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-ghost btn-sm gap-2 mb-8 hover:bg-base-200"
          >

          </button>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Privacidade <span className="text-primary">&</span> Dados
          </h1>
          <p className="text-lg opacity-60">
            Transparência total sobre como o JobFlow utiliza a IA para organizar sua carreira.
          </p>
        </header>

        {/* Seções em Grid de Cards Limpos */}
        <div className="grid gap-6">
          
          {/* Card 1: O que fazemos */}
          <div className="group p-6 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/50 transition-all shadow-sm">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary h-fit">
                
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Processamento por IA</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  O JobFlow utiliza o <strong>Gemini 3 Flash</strong> para ler seus e-mails de candidatura. A IA identifica apenas dados estruturados (empresa, cargo e datas), ignorando qualquer informação pessoal não relacionada à vaga.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: O que NÃO salvamos */}
          <div className="group p-6 rounded-2xl border border-base-300 bg-base-100 hover:border-error/50 transition-all shadow-sm">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-error/10 text-error h-fit">
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Zero Armazenamento de E-mail</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  O corpo do seu e-mail <strong>nunca toca nosso banco de dados</strong>. Ele é processado em tempo real e descartado imediatamente. Guardamos apenas os cartões que você vê no dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Segurança da Chave */}
          <div className="group p-6 rounded-2xl border border-base-300 bg-base-100 hover:border-success/50 transition-all shadow-sm">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-success/10 text-success h-fit">

              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Sua Chave, Seu Controle</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Sua Gemini API Key fica guardada no <code>localStorage</code> do seu navegador. Nós não temos acesso a ela e você pode removê-la com um clique a qualquer momento.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé de Ação */}
        <footer className="mt-16 pt-8 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs opacity-50 text-center md:text-left">
            <p>JobFlow © 2026 • Desenvolvido em São Leopoldo, RS</p>
            <p>Conforme as diretrizes da LGPD brasileira.</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary btn-wide rounded-full shadow-lg shadow-primary/20"
          >
            Li e aceito os termos
          </button>
        </footer>

      </main>
    </div>
  );
};