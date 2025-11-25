import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import Head from 'next/head';

export default function DebugAuth() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    // Read all localStorage data
    if (typeof window !== 'undefined') {
      const data: Record<string, string> = {};
      const keys = ['access_token', 'refresh_token', 'userId', 'userRole', 'profileId', 'user'];

      keys.forEach(key => {
        const value = localStorage.getItem(key);
        data[key] = value || '(not set)';
      });

      setLocalStorageData(data);
    }
  }, []);

  const testLogin = async () => {
    setApiError('');
    setApiResponse(null);

    try {
      console.log('Attempting login to: http://127.0.0.1:8000/api/users/auth/login/');

      const response = await fetch('http://127.0.0.1:8000/api/users/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'student@test.com',
          password: 'testpass123'
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setApiResponse(data);

        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          localStorage.setItem('userId', String(data.user.id));
          localStorage.setItem('userRole', data.user.role);
          if (data.user.profile_id) {
            localStorage.setItem('profileId', String(data.user.profile_id));
          }
        }

        // Refresh display
        const newData: Record<string, string> = {};
        const keys = ['access_token', 'refresh_token', 'userId', 'userRole', 'profileId'];
        keys.forEach(key => {
          const value = localStorage.getItem(key);
          newData[key] = value || '(not set)';
        });
        setLocalStorageData(newData);
      } else {
        setApiError(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      const data: Record<string, string> = {};
      const keys = ['access_token', 'refresh_token', 'userId', 'userRole', 'profileId'];
      keys.forEach(key => {
        data[key] = '(not set)';
      });
      setLocalStorageData(data);
    }
  };

  return (
    <>
      <Head>
        <title>Debug Auth - AA Educates</title>
      </Head>

      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Tool</h1>

        <div className="grid gap-6">
          {/* LocalStorage Data */}
          <Card>
            <CardHeader>
              <CardTitle>LocalStorage Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {Object.entries(localStorageData).map(([key, value]) => (
                  <div key={key} className="flex gap-4 border-b pb-2">
                    <span className="font-bold min-w-[150px]">{key}:</span>
                    <span className="break-all text-muted-foreground">
                      {value.length > 100 ? value.substring(0, 100) + '...' : value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={clearStorage} variant="destructive">
                  Clear LocalStorage
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Login */}
          <Card>
            <CardHeader>
              <CardTitle>Test Login API</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testLogin} className="mb-4">
                Test Login (student@test.com)
              </Button>

              {apiError && (
                <div className="bg-destructive/10 border border-destructive p-4 rounded-lg">
                  <p className="font-bold text-destructive mb-2">Error:</p>
                  <pre className="text-sm overflow-auto">{apiError}</pre>
                </div>
              )}

              {apiResponse && (
                <div className="bg-secondary/10 border border-secondary p-4 rounded-lg">
                  <p className="font-bold mb-2">API Response:</p>
                  <pre className="text-sm overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Steps</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
              <ol>
                <li>Click "Test Login" to test the API directly</li>
                <li>Check if <code>profile_id</code> is in the API response</li>
                <li>Check if <code>profileId</code> appears in LocalStorage</li>
                <li>If profileId is missing from localStorage but present in API response, there's a frontend bug</li>
                <li>If profileId is in localStorage but dashboard still shows error, there's a dashboard loading bug</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
