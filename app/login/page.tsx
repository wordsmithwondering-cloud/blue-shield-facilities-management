'use client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { AuthShell } from '@/components/auth-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function LoginPage() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState<string|null>(null); const [loading,setLoading]=useState(false); const [signupHref,setSignupHref]=useState('/signup');
  useEffect(()=>setSignupHref(`/signup${window.location.search}`),[]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setError(null);setLoading(true);const {error:signInError}=await createBrowserSupabaseClient().auth.signInWithPassword({email,password});if(signInError){setError(signInError.message);setLoading(false);return;}const next=new URLSearchParams(window.location.search).get('next');window.location.assign(next?.startsWith('/')&&!next.startsWith('//')?next:'/report');}
  return <AuthShell title="Welcome back" description="Sign in to report or manage facility issues.">{error&&<Alert role="alert" className="mb-5">{error}</Alert>}<form className="space-y-5" onSubmit={submit}><div><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" placeholder="name@example.com" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link className="mb-2 text-sm font-medium text-blue-800 hover:underline" href="/forgot-password">Forgot password?</Link></div><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></div><Button className="w-full" size="lg" disabled={loading}><LogIn className="size-4"/>{loading?'Signing in…':'Sign in'}</Button></form><p className="mt-6 text-center text-sm text-slate-600">New user? <Link className="font-semibold text-blue-800 hover:underline" href={signupHref}>Create an account</Link></p></AuthShell>;
}
