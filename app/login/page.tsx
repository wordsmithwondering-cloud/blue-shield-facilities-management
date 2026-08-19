'use client';

import { FormEvent, useState } from 'react';
import { createBrowserSupabaseClient } from '../../lib/supabase/browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    window.location.assign('/dashboard');
  }

  return <main><div className="card"><h1>Staff sign in</h1><p>Sign in to manage facilities tickets.</p>{error && <p role="alert">{error}</p>}<form onSubmit={submit}><div><label htmlFor="email">Email</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><div><label htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div><br /><button className="primary" disabled={loading}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</button></form></div></main>;
}
