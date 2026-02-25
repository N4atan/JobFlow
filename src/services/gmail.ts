
import { extractEmailContent } from "../helpers/gmail-extrator";
import { processEmailsWithGemini } from "./gemini";



const q = '(' +
    'subject:("recebemos" OR "confirmada" OR "confirmamos" OR "sucesso" OR "inscrito" OR "recebido" OR "enviada") ' +
    'OR "agradecemos seu interesse"' +
    ') ' +
    '("candidatura" OR "inscrição" OR "processo seletivo") ' +
    '-subject:("alerta" OR "alert" OR "vagas para você" OR "recomendadas" OR "sugeridas" OR "novas vagas" OR "newsletter") ' +
    '-"vagas que combinam"';






// 1. Mudamos o endpoint base para threads
const baseThreadsUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/threads';

export const fetchJobApplications = async (
    token: string | null,
    maxResults: number,
    pageToken: string | null = null,
    refreshTokenSilently?: () => Promise<void>
): Promise<any> => {
    try {

        let url = `${baseThreadsUrl}?q=${encodeURIComponent(q)}&maxResults=${maxResults}`;

        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        const result = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!result.ok) {
            if (result.status === 401 && refreshTokenSilently) {
                console.log("Token expired, refreshing...");
                await refreshTokenSilently();
                // O token novo deve vir via contexto, mas aqui para a recursão funcionar
                // o ideal é que o refreshTokenSilently retorne o novo token ou que
                // busquemos ele novamente se for atualizado no storage.
                // Mas geralmente, recarregar a página ou disparar o loadData novamente é mais seguro.
                throw new Error("401");
            }

            console.error("Erro ao buscar threads:", result);
            throw new Error(`Erro ao buscar threads: ${result.statusText}`);
        }

        const listThreads = await result.json();

        if (!listThreads.threads) return { jobs: [], nextPageToken: null };

        // 2. Buscamos os detalhes de cada THREAD
        const detailedThreads = await Promise.all(
            listThreads.threads.map(async (thread: { id: string }) => {
                const response = await fetch(`${baseThreadsUrl}/${thread.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error(`Erro ao buscar detalhes da thread ${thread.id}`);
                }
                return response.json();
            })
        );

        // 3. Processamos as threads para pegar apenas a ÚLTIMA mensagem de cada uma
        const jobsForAI = detailedThreads.map((thread: any) => {
            const lastMessage = thread.messages[thread.messages.length - 1];

            return {
                id: lastMessage.id,
                threadId: thread.id,
                snippet: lastMessage.snippet,
                content: extractEmailContent(lastMessage)
            };
        });

        // 4. Filtramos conteúdos vazios antes de enviar para a IA
        const validJobs = jobsForAI.filter(job => job.content.length > 0);

        // 5. Chamada para a IA (Gemini) processar o lote
        let processedResults = [];
        try {
            processedResults = await processEmailsWithGemini(validJobs);
        } catch (geminiError: any) {
            console.error("Gemini failed inside gmail service:", geminiError);
            // Adiciona uma flag para o componente saber que o erro foi no Gemini
            geminiError.isGeminiError = true;
            throw geminiError;
        }

        return {
            jobs: processedResults,
            nextPageToken: listThreads.nextPageToken || null
        };
    } catch (error: any) {
        if (error.isGeminiError) throw error; // Re-throw Gemini errors

        console.error("Error in fetchJobApplications:", error);
        throw error;
    }
}


