import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, error: authError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('LoginForm - État actuel:', { user, authError });
        if (user) {
            console.log('LoginForm - Utilisateur connecté, redirection vers le dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (authError) {
            console.log('LoginForm - Erreur d\'authentification:', authError);
            setError(authError);
        }
    }, [authError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log('LoginForm - Tentative de connexion avec:', email);
            await login(email, password);
            console.log('LoginForm - Connexion réussie');
        } catch (err) {
            console.error('LoginForm - Erreur de connexion:', err);
            setError(err.message || 'Erreur de connexion');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Se connecter
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:text-blue-800"
                    >
                        Créer un compte
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm; 