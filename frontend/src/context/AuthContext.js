import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Vérifier la validité du token
            api.get('/auth/me')
                .then(response => {
                    console.log('Utilisateur récupéré:', response.data);
                    setUser(response.data);
                })
                .catch((err) => {
                    console.error('Erreur lors de la vérification du token:', err);
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            console.log('Envoi de la requête de connexion...');
            const response = await api.post('/auth/login', { 
                username: email,
                password: password 
            });
            console.log('Réponse du serveur:', response.data);
            
            if (!response.data || !response.data.token) {
                throw new Error('Réponse invalide du serveur');
            }

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return user;
        } catch (err) {
            console.error('Erreur lors de la connexion:', err);
            setError(err.response?.data?.message || 'Erreur de connexion');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur d\'inscription');
            throw err;
        }
    };

    const logout = () => {
        console.log('Logout called');
        try {
            // Supprimer le token
            localStorage.removeItem('token');
            // Réinitialiser l'état
            setUser(null);
            setError(null);
            console.log('Logout successful');
        } catch (error) {
            console.error('Error during logout:', error);
            setError('Erreur lors de la déconnexion');
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};