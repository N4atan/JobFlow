

const refreshTokenSilently = async () => {
    try {
        await signInWithGoogle();
    } catch (error) {
        console.error(error);
        throw error;
    }
}