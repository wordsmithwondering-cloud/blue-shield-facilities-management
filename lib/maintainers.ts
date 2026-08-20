export type Maintainer = {
  id: string;
  name: string;
  trade: string;
  phone: string | null;
  email: string | null;
  colour: string;
  icon: string;
  active: boolean;
  created_at: string;
};

export const MAINTAINER_COLOURS = ['blue', 'cyan', 'amber', 'sky', 'violet', 'indigo', 'emerald', 'slate'] as const;
export const MAINTAINER_ICONS = ['wrench', 'droplets', 'zap', 'wind', 'sparkles', 'settings', 'shield'] as const;

export function tradePresentation(trade: string) {
  const value = trade.trim().toLowerCase();
  if (value.includes('plumb')) return { colour: 'cyan', icon: 'droplets' };
  if (value.includes('electric')) return { colour: 'amber', icon: 'zap' };
  if (value.includes('hvac') || value.includes('air condition')) return { colour: 'sky', icon: 'wind' };
  if (value.includes('clean')) return { colour: 'violet', icon: 'sparkles' };
  if (value.includes('lift') || value.includes('elevator')) return { colour: 'indigo', icon: 'settings' };
  if (value.includes('security')) return { colour: 'emerald', icon: 'shield' };
  return { colour: 'slate', icon: 'wrench' };
}

export const maintainerColourClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 ring-blue-200',
  cyan: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  amber: 'bg-amber-100 text-amber-800 ring-amber-200',
  sky: 'bg-sky-100 text-sky-800 ring-sky-200',
  violet: 'bg-violet-100 text-violet-800 ring-violet-200',
  indigo: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  slate: 'bg-slate-200 text-slate-800 ring-slate-300',
};
