import { Suspense } from 'react';
import ReportForm from './report-form';

export default function ReportPage() {
  return (
    <Suspense fallback={<main><div className="card"><p>Loading report form...</p></div></main>}>
      <ReportForm />
    </Suspense>
  );
}
