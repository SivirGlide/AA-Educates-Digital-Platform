import React, { useState, FormEvent } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Checkbox } from '@/src/components/ui/checkbox';
import { useAuth } from '@/src/hooks/useAuthCore';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login } = useAuth();
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
      const result = await login(email, password);

      if (result.error || !result.data) {
        setError(result.error || 'Unable to login. Please try again.');
        setLoading(false);
        return;
      }

      // Keep loading state visible for smoother transition
      // Show success message briefly before redirecting
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Get the user role from the result or localStorage
      const userRole = result.data?.role || (typeof window !== 'undefined' ? localStorage.getItem('userRole') : null);
      const role = (userRole ?? '').toLowerCase();
      
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
        // Use router.replace to ensure clean navigation
        router.replace(destination);
      }
      
      // Keep loading state until navigation completes
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl shadow-lg p-8 flex flex-col items-center space-y-4 min-w-[280px] animate-in zoom-in-95 duration-300">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">Signing in</h3>
              <p className="text-sm text-muted-foreground">Please wait while we sign you in...</p>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

