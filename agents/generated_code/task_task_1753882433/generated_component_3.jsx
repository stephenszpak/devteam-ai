export const login = async (credentials: { email: string; password: string }): Promise<void> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  // You can handle token storage or user data here
};