import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Erreur dans la requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
    (response) => {
        console.log('Réponse reçue:', response.data);
        return response;
    },
    (error) => {
        console.error('Erreur dans la réponse:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api; 