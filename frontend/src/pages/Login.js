import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useContext(AuthContext);
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username: email, password });
            login(response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h1>{t('login')}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{t('login')}</button>
            </form>
        </div>
    );
};

export default Login;