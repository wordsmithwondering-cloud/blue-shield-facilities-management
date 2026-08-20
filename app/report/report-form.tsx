'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Building2, Camera, ClipboardPlus, Info, MapPin } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { locationName } from '@/lib/locations';

export default function ReportForm() {
  const params = useSearchParams();
  const location = locationName(params.get('location'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set('location', location);

    try {
      const response = await fetch('/api/tickets', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to submit report.');
        return;
      }
      sessionStorage.setItem('latestSubmittedTicket', JSON.stringify(data.submittedTicket));
      window.location.assign(`/dashboard?ticket=${encodeURIComponent(data.ticket)}`);
    } catch {
      setError('The report could not be submitted. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="py-8 sm:py-12">
    <Card className="mx-auto max-w-4xl overflow-hidden">
      <div className="h-1.5 bg-blue-800" />
      <CardHeader className="border-b border-slate-100 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800"><ClipboardPlus className="size-6" aria-hidden="true" /></div>
          <div><p className="mb-1 text-xs font-bold tracking-widest text-blue-800">NEW SERVICE REQUEST</p><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Report a Facility Issue</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Provide enough detail for the facilities team to locate, assess, and resolve the problem quickly.</p></div>
        </div>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-950"><MapPin className="size-5 shrink-0 text-blue-800" aria-hidden="true" /><div><span className="block text-xs font-semibold uppercase tracking-wide text-blue-700">Issue location</span><b>{location}</b></div></div>
        {error && <Alert role="alert" className="mb-6">{error}</Alert>}
        <form className="space-y-8" onSubmit={submit}>
          <fieldset><legend className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950"><Info className="size-5 text-blue-800" aria-hidden="true" />Issue details</legend><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="category">Issue category</Label><Select id="category" name="category"><option>Electrical / Lighting</option><option>Plumbing / Leakage</option><option>Washroom</option><option>Lift</option><option>Cleaning</option><option>HVAC / Air Conditioning</option><option>Door / Window</option><option>Security</option><option>Other</option></Select></div><div><Label htmlFor="priority">Priority</Label><Select id="priority" name="priority"><option>Normal</option><option>Urgent</option><option>Emergency</option></Select><p className="mt-1.5 text-xs text-slate-500">Use Emergency only for immediate safety or major service risks.</p></div><div className="sm:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" required placeholder="Describe the problem and exact area. Include anything that could help the maintenance team." /></div></div></fieldset>
          <div className="h-px bg-slate-200" />
          <fieldset><legend className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950"><Building2 className="size-5 text-blue-800" aria-hidden="true" />Reporter details</legend><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="firstName">First name</Label><Input id="firstName" name="firstName" autoComplete="given-name" required /></div><div><Label htmlFor="lastName">Last name</Label><Input id="lastName" name="lastName" autoComplete="family-name" required /></div><div><Label htmlFor="company">Company / Suite</Label><Input id="company" name="company" autoComplete="organization" /></div><div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" minLength={10} maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" placeholder="0712345678" required /><p className="mt-1.5 text-xs text-slate-500">Enter exactly 10 digits.</p></div></div></fieldset>
          <div className="h-px bg-slate-200" />
          <fieldset><legend className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950"><Camera className="size-5 text-blue-800" aria-hidden="true" />Supporting photo <span className="font-normal text-slate-500">(optional)</span></legend><Label className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50" htmlFor="photo"><Camera className="mx-auto mb-2 size-7 text-slate-500" aria-hidden="true" /><span className="block font-semibold text-slate-800">Choose an image</span><span className="mt-1 block text-xs font-normal text-slate-500">JPG, PNG, or other image up to 5 MB</span></Label><Input className="sr-only" id="photo" name="photo" type="file" accept="image/*" /></fieldset>
          <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center"><p className="text-xs leading-5 text-slate-500">After submission, you’ll be taken to the dashboard to view your ticket reference and status.</p><Button className="shrink-0" size="lg" disabled={loading}><ClipboardPlus className="size-4" />{loading ? 'Submitting…' : 'Submit report'}</Button></div>
        </form>
      </CardContent>
    </Card>
  </main>;
}
