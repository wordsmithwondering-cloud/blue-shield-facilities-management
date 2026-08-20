'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { AuthShell } from '@/components/auth-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    void supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
      setCheckingSession(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: updateError } = await createBrowserSupabaseClient().auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  }

  if (checkingSession) return <AuthShell title="Checking your account" description="Please wait while we verify your secure session."><p className="text-center text-sm text-slate-600" role="status">Checking session…</p></AuthShell>;

  if (!ready) return <AuthShell title="Reset link required" description="For security, you need to be signed in or open a valid password-reset link."><Alert role="alert">Your session is missing or the reset link has expired.</Alert><div className="mt-6 grid gap-3"><Link className="flex h-11 items-center justify-center rounded-md bg-blue-800 px-6 text-sm font-semibold text-white hover:bg-blue-900" href="/forgot-password">Send a new reset link</Link><Link className="text-center text-sm font-semibold text-blue-800 hover:underline" href="/login">Return to sign in</Link></div></AuthShell>;

  if (saved) return <AuthShell title="Password changed" description="Your account is secure with your new password."><Alert variant="success" role="status">Your new password has been saved successfully.</Alert><Link className="mt-6 flex h-11 items-center justify-center rounded-md bg-blue-800 px-6 text-sm font-semibold text-white hover:bg-blue-900" href="/login">Continue to sign in</Link></AuthShell>;

  return <AuthShell title="Choose a new password" description="Use a strong password you have not used before.">{error && <Alert role="alert" className="mb-5">{error}</Alert>}<form className="space-y-5" onSubmit={submit}><div><Label htmlFor="password">New password</Label><Input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /><p className="mt-1.5 text-xs text-slate-500">Use at least 8 characters.</p></div><div><Label htmlFor="confirmPassword">Confirm new password</Label><Input id="confirmPassword" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div><Button className="w-full" size="lg" disabled={loading}><KeyRound className="size-4" />{loading ? 'Saving…' : 'Change password'}</Button></form></AuthShell>;
}
