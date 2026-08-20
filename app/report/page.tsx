import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReportForm from './report-form';

export default function ReportPage() {
  return (
    <Suspense fallback={<main className="py-12"><Card className="mx-auto max-w-4xl"><CardContent className="p-8 text-sm text-slate-600">Loading report form…</CardContent></Card></main>}>
      <ReportForm />
    </Suspense>
  );
}
