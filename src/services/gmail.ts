
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

export const fetchJobApplications = async (token: string, maxResults: number, pageToken?: string | null) => {
    try {

        let url = `${baseThreadsUrl}?q=${encodeURIComponent(q)}&maxResults=${maxResults}`;

        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        const result = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!result.ok) {
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
        const processedResults = await processEmailsWithGemini(validJobs);

        return {
            jobs: processedResults,
            nextPageToken: listThreads.nextPageToken || null
        };
    } catch (error: any) {
        console.error("Error in fetchJobApplications:", error);
        throw error;
    }
}





