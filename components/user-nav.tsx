'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KeyRound, LogOut } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export function UserNav() {
  const [authenticated, setAuthenticated] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    void supabase.auth.getSession().then(({ data }) => setAuthenticated(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    setSigningOut(true);
    await createBrowserSupabaseClient().auth.signOut();
    window.location.assign('/login');
  }

  if (!authenticated) return null;

  return <><Link className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700" href="/reset-password"><KeyRound className="size-4" aria-hidden="true" />Change password</Link><button className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 disabled:opacity-60" type="button" onClick={signOut} disabled={signingOut}><LogOut className="size-4" aria-hidden="true" />{signingOut ? 'Signing out…' : 'Sign out'}</button></>;
}
