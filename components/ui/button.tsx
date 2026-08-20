import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',{variants:{variant:{default:'bg-blue-800 text-white hover:bg-blue-900',outline:'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',ghost:'text-slate-700 hover:bg-slate-100'},size:{default:'h-10 px-4 py-2',sm:'h-9 px-3',lg:'h-11 px-6'}},defaultVariants:{variant:'default',size:'default'}});
export function Button({className,variant,size,...props}:ButtonHTMLAttributes<HTMLButtonElement>&VariantProps<typeof buttonVariants>){return <button className={cn(buttonVariants({variant,size}),className)} {...props}/>;}
export { buttonVariants };
