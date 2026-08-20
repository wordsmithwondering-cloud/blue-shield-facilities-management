import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AuthShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <main className="flex min-h-[calc(100vh-110px)] items-start justify-center px-4 py-10 sm:items-center"><Card className="w-full max-w-md overflow-hidden"><div className="h-1.5 bg-blue-800" /><CardHeader className="space-y-3 pb-4"><div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-800"><ShieldCheck className="size-6" aria-hidden="true" /></div><div><h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>{description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}</div></CardHeader><CardContent className="pt-2">{children}</CardContent></Card></main>;
}
