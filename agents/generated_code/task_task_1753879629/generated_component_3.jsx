// src/components/LoginPage.tsx

import React from 'react';
import LoginForm from './LoginForm';
import { useHistory } from 'react-router-dom'; // Assuming you're using react-router for navigation

const LoginPage: React.FC = () => {
  const history = useHistory();

  const handleLogin = (email: string, password: string) => {
    // Here you would typically call an API to validate the credentials
    // For demonstration, we'll just log them and redirect
    console.log('Logging in with:', { email, password });
    // Redirect to home or dashboard after successful login
    history.push('/home'); 
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;