export const errorHandle = (error: any): string => {
    // 1. Extrai o código/status de diferentes estruturas possíveis
    const status =
        error?.status ||
        error?.code ||
        error?.response?.status ||
        error?.error?.code ||
        (typeof error === 'number' ? error : 0);

    // 2. Transforma códigos de erro e mensagens em strings comparáveis
    const message = (error?.message || (typeof error === 'string' ? error : "")).toUpperCase();
    const errorCode = (error?.code || error?.error?.status || "").toUpperCase();
    const reason = (error?.error?.details?.[0]?.reason || "").toUpperCase();

    // Erros de API Key Inválida
    if (status === 400 || message.includes('API KEY NOT VALID') || message.includes('INVALID API KEY') || errorCode.includes('INVALID_ARGUMENT') || reason === 'API_KEY_INVALID') {
        return "Chave de API do Gemini inválida! ";
    }

    // Erros de Cota (Gemini)
    if (status === 429 || message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('QUOTA_EXCEEDED')) {
        return "Limite de requisições atingido! Troque de modelo ou aguarde 24 horas.";
    }

    // Erros de Autenticação (Gmail/Firebase)
    const errorCodeLower = (error?.code || "").toLowerCase();
    if (status === 401 || errorCodeLower.includes('auth/id-token-expired') || errorCodeLower.includes('auth/user-token-expired') || message.includes('UNAUTHORIZED')) {
        return "Sua sessão expirou. Clique no perfil e faça login novamente.";
    }

    // Erros de Permissão (Scopes/Google API)
    if (status === 403 || message.includes('403') || message.includes('PERMISSION_DENIED') || message.includes('ACCESS_DENIED')) {
        return "O JobFlow não tem permissão suficiente. Verifique os acessos concedidos.";
    }

    // Erros de Rede / Offline
    if (!navigator.onLine || message.includes('NETWORK') || message.includes('FETCH') || message.includes('OFFLINE')) {
        return "Você parece estar offline ou com problemas de conexão.";
    }

    // Erros de Servidor Google
    if (status >= 500 || message.includes('INTERNAL_SERVER_ERROR')) {
        return "Os servidores estão instáveis agora. Tente novamente em instantes.";
    }

    // Fallback para erros desconhecidos
    console.warn("Erro não mapeado:", error);
    return "Ops! Ocorreu um erro inesperado. Tente recarregar a página.";
};