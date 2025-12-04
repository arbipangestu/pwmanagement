'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';

export default function LoginPageContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        ...formData,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-highlight-white">
      <div className="max-w-md w-full bg-form-background p-8 rounded-2xl shadow-xl border border-form-border text-secondary-DEFAULT">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-DEFAULT mb-2">Welcome Back!</h1>
          <p className="text-secondary-charcoal">Sign in to manage your credentials</p>
        </div>

        {error && (
          <div className="bg-primary-accent/10 text-primary-accent p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            placeholder="john@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full mt-2" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-secondary-charcoal">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-DEFAULT hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}