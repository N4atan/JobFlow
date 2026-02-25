export const gmailErrorHandler = (error: any): string => {
    const status =
        error?.status ||
        error?.code ||
        error?.response?.status ||
        error?.error?.code ||
        (typeof error === 'number' ? error : 0);

    const message = (error?.message || (typeof error === 'string' ? error : "")).toUpperCase();
    const errorCodeLower = (error?.code || "").toLowerCase();

    // Erros de Autenticação (401)
    if (status === 401 || errorCodeLower.includes('auth/id-token-expired') || errorCodeLower.includes('auth/user-token-expired') || message.includes('UNAUTHORIZED')) {
        return "Sessão do Google expirada. Clique no perfil e faça login novamente.";
    }

    // Erros de Permissão / Scopes (403)
    if (status === 403 || message.includes('PERMISSION_DENIED') || message.includes('ACCESS_DENIED')) {
        return "Permissão insuficiente para ler e-mails. Verifique as autorizações da sua conta Google.";
    }

    // Erros de Rate Limit (429)
    if (status === 429 || message.includes('RATE_LIMIT_EXCEEDED')) {
        return "Limite de requisições do Gmail atingido. Aguarde alguns instantes.";
    }

    // Erros de Rede
    if (!navigator.onLine || message.includes('NETWORK') || message.includes('FETCH')) {
        return "Problema de conexão com o Gmail. Verifique sua internet.";
    }

    console.warn("Gmail Error não mapeado:", error);
    return "Erro ao acessar Gmail: " + (error?.message || "Erro inesperado.");
};
