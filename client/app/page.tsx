'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Example: Fetch users from Django REST API
    apiClient
      .get('/users/users/')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch users');
        setLoading(false);
        console.error('API Error:', err);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">AA Educates</h1>
        <p className="text-xl mb-8">Digital Learning Platform</p>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Welcome to the AA Educates Digital Learning Platform.
          </p>
          
          {/* API Connection Example */}
          <div className="mt-8 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">API Connection Test</h2>
            {loading && <p>Loading users from Django API...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!loading && !error && users.length > 0 && (
              <div>
                <p className="text-green-600 mb-2">✅ Successfully connected to Django API!</p>
                <p className="text-sm text-gray-500">Found {users.length} user(s)</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {users.slice(0, 5).map((user) => (
                    <li key={user.id}>
                      {user.email} ({user.role})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!loading && !error && users.length === 0 && (
              <p className="text-yellow-600">No users found. Make sure your Django backend is running.</p>
            )}
          </div>

          <div className="mt-8">
            <a
              href="http://127.0.0.1:8000/api/docs/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

