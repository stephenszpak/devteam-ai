// src/components/LoginPage.tsx

import React, { useState } from 'react';
import LoginForm from './LoginForm'; // Assuming LoginForm is a separate component
import { useHistory } from 'react-router-dom'; // Assuming you are using react-router for navigation

const LoginPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();

    const handleLoginSuccess = () => {
        // Redirect to the dashboard or another page after successful login
        history.push('/dashboard');
    };

    const handleLoginError = (errorMessage: string) => {
        setError(errorMessage);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
            </div>
        </div>
    );
};

export default LoginPage;