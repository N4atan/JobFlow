// helpers/gmail-extractor.ts



export const extractEmailContent = (messageData: any): string => {
    try {
        const payload = messageData.payload;
        const parts = payload?.parts || [];
        
        // Prioridade: 1. Texto Puro, 2. HTML, 3. Corpo direto
        const selectedPart = parts.find((p: any) => p.mimeType === "text/plain") 
                           || parts.find((p: any) => p.mimeType === "text/html")
                           || payload;

        const encodedBody = selectedPart?.body?.data;
        if (!encodedBody) return "";

        // Decodificação robusta para UTF-8 e Base64URL
        const base64 = encodedBody.replace(/-/g, '+').replace(/_/g, '/');
        const decodedBody = decodeURIComponent(escape(atob(base64)));

        // Se for HTML, limpamos. Se for texto puro, retornamos direto.
        return selectedPart.mimeType === "text/html" ? cleanHTML(decodedBody) : decodedBody;
    } catch (error) {
        console.error("Falha na extração do conteúdo:", error);
        return "";
    }
};

function cleanHTML(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Remove o lixo pesado
    const tagsToRemove = ['style', 'script', 'head', 'meta', 'link'];
    tagsToRemove.forEach(tag => {
        doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    // Retorna apenas o texto, removendo espaços e quebras excessivas
    return doc.body.innerText.replace(/\s\s+/g, ' ').trim();
}