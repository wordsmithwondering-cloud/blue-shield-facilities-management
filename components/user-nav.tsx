'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export function UserNav() {
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await createBrowserSupabaseClient().auth.signOut();
    window.location.assign('/login');
  }

  return <button className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 disabled:opacity-60" type="button" onClick={signOut} disabled={signingOut}><LogOut className="size-4" aria-hidden="true" />{signingOut ? 'Signing out…' : 'Sign out'}</button>;
}
