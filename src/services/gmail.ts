
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
    console.clear();

    // O filtro (q) continua o mesmo, ele funciona perfeitamente para threads
    let url = `${baseThreadsUrl}?q=${encodeURIComponent(q)}&maxResults=${maxResults}`;

    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }

    const result = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const listThreads = await result.json();

    if (!listThreads.threads) return { jobs: [], nextPageToken: null };

    console.log('listThreads:', listThreads);

    // 2. Buscamos os detalhes de cada THREAD
    const detailedThreads = await Promise.all(
        listThreads.threads.map(async (thread: { id: string }) => {
            const response = await fetch(`${baseThreadsUrl}/${thread.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.json();
        })
    );

    console.log('detailedThreads:', detailedThreads);

    // 3. Processamos as threads para pegar apenas a ÚLTIMA mensagem de cada uma
    const jobsForAI = detailedThreads.map((thread: any) => {
        // A última mensagem da conversa é a que tem o status mais atualizado
        const lastMessage = thread.messages[thread.messages.length - 1];

        return {
            id: lastMessage.id, // ID da mensagem para a IA processar
            threadId: thread.id, // Mantemos o ID da conversa para a UI
            snippet: lastMessage.snippet,
            content: extractEmailContent(lastMessage) // Sua função auxiliar de extração
        };
    });

    console.log('jobsForAI:', jobsForAI);

    // 4. Filtramos conteúdos vazios antes de enviar para a IA
    const validJobs = jobsForAI.filter(job => job.content.length > 0);

    console.log('validJobs:', validJobs);

    // 5. Chamada para a IA (Gemini) processar o lote
    const processedResults = await processEmailsWithGemini(validJobs);

    return {
        jobs: processedResults,
        nextPageToken: listThreads.nextPageToken || null
    };
}





