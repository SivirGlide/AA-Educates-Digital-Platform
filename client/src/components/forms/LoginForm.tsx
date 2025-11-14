import React, { useState, FormEvent } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Checkbox } from '@/src/components/ui/checkbox';
import { api } from '@/lib/api';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.login(email, password);

      if (response.error || !response.data) {
        setError(response.error || 'Unable to login. Please try again.');
        setLoading(false);
        return;
      }

      // Validate response structure
      const { access, refresh, user } = response.data;
      
      if (!access || !refresh || !user) {
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }

      // Store tokens and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('userId', String(user.id ?? ''));
        localStorage.setItem('userRole', user.role ?? '');
        if (user.profile_id) {
          localStorage.setItem('profileId', String(user.profile_id));
        }
      }

      setLoading(false);

      // Redirect based on user role
      const role = (user.role ?? '').toLowerCase();
      const destination =
        role === 'corporate_partner'
          ? '/corporate/dashboard'
          : role === 'parent'
          ? '/parent/dashboard'
          : role === 'admin'
          ? '/admin/dashboard'
          : '/student/dashboard';

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(destination);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          required
          disabled={loading}
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          required
          disabled={loading}
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            disabled={loading}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/contact"
          className="text-primary hover:text-primary/80 font-medium"
        >
          Need help?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
};

