'use client';

import { FormEvent, useState } from 'react';
import { Pencil, Plus, RotateCcw, Trash2, UsersRound, X } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaintainerIcon } from '@/components/maintainer-picker';
import { type Maintainer, maintainerColourClasses } from '@/lib/maintainers';

export function MaintainerManager({ maintainers, onChanged }: { maintainers: Maintainer[]; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<Maintainer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function startAdd() { setEditing(null); setShowForm(true); setError(null); setNotice(null); }
  function startEdit(person: Maintainer) { setEditing(person); setShowForm(true); setError(null); setNotice(null); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null); setNotice(null);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch('/api/maintainers', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing ? { id: editing.id, ...values } : values) });
    const data = await response.json(); setSaving(false);
    if (!response.ok) { setError(data.error || 'Worker could not be saved.'); return; }
    setShowForm(false); setEditing(null); setNotice(editing ? 'Worker details updated.' : 'Worker added to the team.'); await onChanged();
  }

  async function toggleActive(person: Maintainer) {
    setSaving(true); setError(null); setNotice(null);
    const response = await fetch('/api/maintainers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: person.id, active: !person.active }) });
    const data = await response.json(); setSaving(false);
    if (!response.ok) { setError(data.error || 'Worker status could not be changed.'); return; }
    setNotice(person.active ? 'Worker deactivated and removed from new assignments.' : 'Worker reactivated.'); await onChanged();
  }

  async function remove(person: Maintainer) {
    if (!window.confirm(`Remove ${person.name}? Workers with ticket history will be deactivated instead.`)) return;
    setSaving(true); setError(null); setNotice(null);
    const response = await fetch(`/api/maintainers?id=${encodeURIComponent(person.id)}`, { method: 'DELETE' });
    const data = await response.json(); setSaving(false);
    if (!response.ok) { setError(data.error || 'Worker could not be removed.'); return; }
    setNotice(data.message || 'Worker removed.'); await onChanged();
  }

  return <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800"><UsersRound className="size-5" /></span><div><h2 className="font-bold text-slate-950">Maintenance team</h2><p className="text-sm text-slate-500">Add workers and control who appears in ticket assignments.</p></div></div><Button type="button" onClick={startAdd}><Plus className="size-4" />Add worker</Button></div><div className="p-6">{error && <Alert role="alert" className="mb-4">{error}</Alert>}{notice && <Alert variant="success" role="status" className="mb-4">{notice}</Alert>}{showForm && <form className="mb-6 grid gap-4 rounded-lg border border-blue-200 bg-blue-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={submit}><div><Label htmlFor="worker-name">Name</Label><Input id="worker-name" name="name" defaultValue={editing?.name || ''} required /></div><div><Label htmlFor="worker-trade">Trade</Label><Input id="worker-trade" name="trade" defaultValue={editing?.trade || ''} placeholder="e.g. Plumber" required /><p className="mt-1.5 text-xs text-slate-500">Colour and icon are assigned automatically by trade.</p></div><div><Label htmlFor="worker-phone">Phone</Label><Input id="worker-phone" name="phone" defaultValue={editing?.phone || ''} /></div><div><Label htmlFor="worker-email">Email</Label><Input id="worker-email" name="email" type="email" defaultValue={editing?.email || ''} /></div><div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4"><Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add worker'}</Button><Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }} disabled={saving}><X className="size-4" />Cancel</Button></div></form>}<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{maintainers.map((person) => <article key={person.id} className={`flex items-center gap-3 rounded-lg border p-4 ${person.active ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'}`}><span className={`flex size-11 shrink-0 items-center justify-center rounded-full ring-1 ${maintainerColourClasses[person.colour] || maintainerColourClasses.blue}`}><MaintainerIcon maintainer={person} className="size-5" /></span><div className="min-w-0 flex-1"><b className="block truncate text-sm text-slate-950">{person.name}</b><span className="block truncate text-xs text-slate-500">{person.trade}</span>{!person.active && <span className="text-xs font-semibold text-amber-700">Inactive</span>}</div><div className="flex shrink-0"><button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-800" onClick={() => startEdit(person)} aria-label={`Edit ${person.name}`}><Pencil className="size-4" /></button><button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700" onClick={() => void toggleActive(person)} disabled={saving} aria-label={person.active ? `Deactivate ${person.name}` : `Reactivate ${person.name}`}>{person.active ? <X className="size-4" /> : <RotateCcw className="size-4" />}</button><button type="button" className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700" onClick={() => void remove(person)} disabled={saving} aria-label={`Remove ${person.name}`}><Trash2 className="size-4" /></button></div></article>)}</div>{maintainers.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No workers have been added yet.</p>}</div></section>;
}
