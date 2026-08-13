'use client';
import {useEffect,useState} from 'react';
export default function Dashboard(){
 const [tickets,setTickets]=useState<any[]>([]);
 async function load(){const r=await fetch('/api/tickets'); if(r.ok)setTickets(await r.json())}
 useEffect(()=>{load()},[]);
 const open=tickets.filter(x=>!['RESOLVED','CLOSED'].includes(x.status)).length;
 const urgent=tickets.filter(x=>['Urgent','Emergency'].includes(x.priority)&&!['RESOLVED','CLOSED'].includes(x.status)).length;
 const progress=tickets.filter(x=>x.status==='IN PROGRESS').length;
 const resolved=tickets.filter(x=>['RESOLVED','CLOSED'].includes(x.status)).length;
 return <main><div className="stats"><div className="stat">Open<b>{open}</b></div><div className="stat">Urgent / Emergency<b>{urgent}</b></div><div className="stat">In Progress<b>{progress}</b></div><div className="stat">Resolved / Closed<b>{resolved}</b></div></div><div className="card"><h2>Maintenance Tickets</h2><table><thead><tr><th>Ticket</th><th>Location</th><th>Issue</th><th>Priority</th><th>Status</th></tr></thead><tbody>{tickets.map(t=><tr key={t.id}><td><b>{t.ticket_no}</b></td><td>{t.location}</td><td>{t.category}</td><td><span className="tag">{t.priority}</span></td><td>{t.status}</td></tr>)}</tbody></table></div></main>
}
