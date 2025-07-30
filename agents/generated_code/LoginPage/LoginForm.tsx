// src/components/LoginForm.tsx

import React, { useState } from 'react';

interface LoginFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement your login logic here
        try {
            // Call your API for login
            // If successful:
            onSuccess();
        } catch (error) {
            // Handle error and call onError
            onError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;