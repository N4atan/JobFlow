import { GoogleGenAI } from '@google/genai';
import CryptoJS from 'crypto-js';

export const saveApiKey = (key: string) => {
    const encrypted = CryptoJS.AES.encrypt(key, import.meta.env.VITE_ENCRYPTION_KEY!).toString();
    localStorage.setItem('@jobflow:gemini-key', encrypted);
};

export const getApiKey = () => {
    const encrypted = localStorage.getItem('@jobflow:gemini-key');
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, import.meta.env.VITE_ENCRYPTION_KEY!);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const removeApiKey = () => {
    localStorage.removeItem('@jobflow:gemini-key');
};

export const saveModel = (model: string) => {
    localStorage.setItem('@jobflow:gemini-model', model);
}

export const getModel = () => {
    return localStorage.getItem('@jobflow:gemini-model');
}

export const removeModel = () => {
    localStorage.removeItem('@jobflow:gemini-model');
}


export const processEmailsWithGemini = async (emailsContent: any[]) => {
    if (!getApiKey()) {
        throw new Error('API key not found');
    }

    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey()! });

        const model = getModel() || 'gemini-2.5-flash';

        const prompt = `
    "Você é um assistente especializado em recrutamento e seleção. Abaixo, fornecerei um array de e-mails extraídos do Gmail.

    Sua tarefa:
    Para cada e-mail no array, identifique:
    
    O nome da empresa (ex: Google, Gupy, Sicredi).
    
    O cargo ou título da vaga (ex: Desenvolvedor Frontend).
    
    O domínio da empresa para o ícone (ex: google.com, gupy.io).
    
    O status atual da candidatura baseado no contexto (Valores permitidos: 'Candidatado', 'Entrevista', 'Negativa', 'Aguardando Teste').
    
    Um resumo curto de uma frase sobre o último contato.
    
    Regras Estritas:
    
    Retorne APENAS um array JSON válido.
    
    Não inclua explicações ou formatação markdown fora do JSON.
    
    Se o e-mail não for relacionado a uma vaga, ignore-o.

    Lógica de Consolidação (Deduplicação):

    Se houver múltiplos e-mails referentes à mesma vaga (mesma empresa E mesmo cargo), verifique a data e o link da vaga.

    Em alguns casos, no corpo do e-mail pode haver um outro código de vaga, usado internamente pela empresa. Verifique se o código de vaga é o mesmo. Retorne apenas um objeto por vaga única encontrada no lote.

    Caso a data seja a mesma e o link (URL) seja idêntico, considere como uma única candidatura. 

    Status: Priorize sempre o status mais avançado ou recente (ex: se um e-mail diz 'Candidatura enviada' e outro diz 'Negativa' para a mesma vaga, o status final deve ser 'Negativa').

    Retorne apenas um objeto por vaga única encontrada no lote.

    REGRAS DE OURO DE LIMPEZA:

    Vaga Única: Se houver 2 e-mails da mesma EMPRESA e mesmo CARGO, retorne apenas UM objeto. Use como parametro a candidatura mais recente (se tiver data), caso não tenha data, use o status mais avançado.

    Soberania de Status: Ao consolidar, escolha o status na seguinte ordem de prioridade: 1º Negativa, 2º Entrevista, 3º Aguardando Teste, 4º Candidatado.

    Proibido NULL: Faça um esforço extra para achar o 'cargo' e a 'data_iso'. Se não houver data no texto, use 'Não informado' como fallback.

    Filtro de Alerta: Se o texto contiver listas de várias empresas, é um alerta. DELETE e não retorne nada.

    Em último caso se não houver nada para cada propriedade, retorne null.


    

    
    Formato de Saída:
    [
    {
    "id": "ID_DO_EMAIL",
    "empresa": "string",
    "cargo": "string",
    "dominio": "string",
    "status": "string",
    "localizacao": "Cidade/Estado ou 'Remoto'",
    "data_iso": "A data da candidatura no formato YYYY-MM-DD.",
    "resumo": "string",
    "url": "O link montado que redireciona para o e-mail utilizando o id do email (https://mail.google.com/mail/u/0/#inbox/ID_DO_EMAIL)"
    }
    ]
    
    Array de e-mails para processar:
    [${JSON.stringify(emailsContent)}]"`



        const resultAI = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        const text = resultAI.text;


        if (!text) return [];

        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);

    } catch (error: any) {
        console.error("Error processing emails with Gemini:", error);
        throw error;
    }
}



