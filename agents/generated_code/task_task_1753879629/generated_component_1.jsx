// LoginPage.tsx
import React from 'react';
import LoginForm from './LoginForm';
import SimpleButton from './SimpleButton';

const LoginPage: React.FC = () => {
    // Function to handle the login form submission
    const handleLogin = (email: string, password: string) => {
        // Logic to handle login (e.g., API call)
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <LoginForm onSubmit={handleLogin} />
            <div className="mt-4">
                <SimpleButton label="Forgot Password?" onClick={() => alert('Redirect to forgot password')} />
            </div>
        </div>
    );
};

export default LoginPage;