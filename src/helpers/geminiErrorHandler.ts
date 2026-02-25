export const geminiErrorHandler = (error: any): string => {
    const status =
        error?.status ||
        error?.code ||
        error?.response?.status ||
        error?.error?.code ||
        (typeof error === 'number' ? error : 0);

    const message = (error?.message || (typeof error === 'string' ? error : "")).toUpperCase();
    const errorCode = (error?.code || error?.error?.status || "").toUpperCase();
    const reason = (error?.error?.details?.[0]?.reason || "").toUpperCase();

    // Erros de Modelo não encontrado (404)
    if (status === 404 || message.includes('NOT FOUND') || message.includes('MODEL')) {
        return "Modelo do Gemini não encontrado! Verifique a configuração de modelo nas configurações.";
    }

    // Erros de API Key Inválida (400)
    if (status === 400 || message.includes('API KEY NOT VALID') || message.includes('INVALID API KEY') || errorCode.includes('INVALID_ARGUMENT') || reason === 'API_KEY_INVALID') {
        return "Chave de API do Gemini inválida! Verifique se a chave está correta.";
    }

    // Erros de Cota / Rate Limit (429)
    if (status === 429 || message.includes('RESOURCE_EXHAUSTED') || message.includes('QUOTA_EXCEEDED')) {
        return "Limite de requisições do Gemini atingido! Tente trocar para um modelo 'Flash' ou aguarde um momento.";
    }

    // Erros de Segurança / Bloqueio (403)
    if (status === 403 || message.includes('PERMISSION_DENIED')) {
        return "Acesso negado ao Gemini. Verifique se sua chave tem as permissões necessárias.";
    }

    console.warn("Gemini Error não mapeado:", error);
    return "Erro no processamento da IA: " + (error?.message || "Erro inesperado.");
};
