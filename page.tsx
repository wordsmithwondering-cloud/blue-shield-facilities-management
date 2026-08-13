'use client';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {locationName} from '@/lib/locations';

export default function ReportPage(){
 const p=useSearchParams(), loc=locationName(p.get('location'));
 const [done,setDone]=useState<string|null>(null);
 const [loading,setLoading]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault(); setLoading(true);
   const fd=new FormData(e.currentTarget); fd.set('location',loc);
   const r=await fetch('/api/tickets',{method:'POST',body:fd});
   const data=await r.json(); setLoading(false);
   if(r.ok)setDone(data.ticket);
   else alert(data.error||'Unable to submit report');
 }
 if(done)return <main><div className="card success"><h2>Report Received</h2><p>Your facility issue has been logged successfully.</p><h1>{done}</h1><p>Please keep this reference for follow-up.</p></div></main>;
 return <main><div className="card"><h1>Report a Facility Issue</h1><p>Please report defects or facility-related problems at Blue Shield Towers.</p><div className="location">📍 <b>Location:</b> {loc}</div><br/>
 <form onSubmit={submit}><div className="grid">
 <div><label>Issue category</label><select name="category"><option>Electrical / Lighting</option><option>Plumbing / Leakage</option><option>Washroom</option><option>Lift</option><option>Cleaning</option><option>HVAC / Air Conditioning</option><option>Door / Window</option><option>Security</option><option>Other</option></select></div>
 <div><label>Priority</label><select name="priority"><option>Normal</option><option>Urgent</option><option>Emergency</option></select></div>
 <div className="full"><label>Description</label><textarea name="description" required placeholder="Describe the problem and exact area if possible"/></div>
 <div><label>Name</label><input name="name" required/></div><div><label>Company / Suite</label><input name="company"/></div>
 <div><label>Phone</label><input name="phone"/></div><div><label>Photo</label><input name="photo" type="file" accept="image/*"/></div>
 <div className="full"><button className="primary" disabled={loading}>{loading?'SUBMITTING...':'SUBMIT REPORT'}</button></div>
 </div></form></div></main>
}
