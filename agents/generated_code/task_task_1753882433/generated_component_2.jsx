import React from 'react';

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail, password, setPassword, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      
      <label className="mb-2 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      
      <button
        type="submit"
        disabled={loading}
        className={`p-2 bg-blue-500 text-white rounded ${loading ? 'opacity-50' : 'hover:bg-blue-600'}`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;