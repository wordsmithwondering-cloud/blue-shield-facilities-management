import type { HTMLAttributes } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Alert({ className, variant = 'error', children, ...props }: HTMLAttributes<HTMLDivElement> & { variant?: 'error' | 'success' }) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;
  return <div className={cn('flex gap-3 rounded-lg border p-4 text-sm', variant === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900', className)} {...props}><Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div>{children}</div></div>;
}
