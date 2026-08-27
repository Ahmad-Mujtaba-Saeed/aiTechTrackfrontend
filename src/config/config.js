const config = {
    appUrl: import.meta.env.VITE_APP_URL,
    apiUrl: import.meta.env.VITE_API_URL,

    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    },

    stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
};

export default config;