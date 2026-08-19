'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '../../lib/supabase/browser';

type Ticket = {
  id: string;
  ticket_no: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  photo_url: string | null;
};

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    await createBrowserSupabaseClient().auth.signOut();
    window.location.assign('/login');
  }

  async function load() {
    const response = await fetch('/api/tickets');
    const data = await response.json();
    if (response.ok) setTickets(data);
    else setError(data.error || 'Tickets could not be loaded.');
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function updateTicket(id: string, status: string, assignedTo?: string) {
    setSavingId(id);
    setError(null);
    const response = await fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, assignedTo }),
    });
    const data = await response.json();
    setSavingId(null);

    if (!response.ok) {
      setError(data.error || 'Ticket could not be updated.');
      return;
    }

    setTickets((current) => current.map((ticket) => ticket.id === id ? data : ticket));
  }

  const open = tickets.filter((ticket) => !['RESOLVED', 'CLOSED'].includes(ticket.status)).length;
  const urgent = tickets.filter((ticket) => ['Urgent', 'Emergency'].includes(ticket.priority) && !['RESOLVED', 'CLOSED'].includes(ticket.status)).length;
  const progress = tickets.filter((ticket) => ticket.status === 'IN PROGRESS').length;
  const resolved = tickets.filter((ticket) => ['RESOLVED', 'CLOSED'].includes(ticket.status)).length;

  return <main><div className="card"><button onClick={signOut}>Sign out</button></div><div className="stats"><div className="stat">Open<b>{open}</b></div><div className="stat">Urgent / Emergency<b>{urgent}</b></div><div className="stat">In Progress<b>{progress}</b></div><div className="stat">Resolved / Closed<b>{resolved}</b></div></div><div className="card"><h2>Maintenance Tickets</h2>{error && <p role="alert">{error}</p>}{loading ? <p>Loading tickets...</p> : <table><thead><tr><th>Ticket</th><th>Location</th><th>Issue</th><th>Priority</th><th>Photo</th><th>Assigned to</th><th>Status</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td><b>{ticket.ticket_no}</b></td><td>{ticket.location}</td><td>{ticket.category}</td><td><span className="tag">{ticket.priority}</span></td><td>{ticket.photo_url ? <a href={ticket.photo_url} target="_blank" rel="noreferrer">View</a> : '—'}</td><td><input aria-label={`Assign ${ticket.ticket_no}`} defaultValue={ticket.assigned_to || ''} placeholder="Staff member" onBlur={(event) => { if (event.currentTarget.value !== (ticket.assigned_to || '')) void updateTicket(ticket.id, ticket.status, event.currentTarget.value); }} disabled={savingId === ticket.id} /></td><td><select aria-label={`Status for ${ticket.ticket_no}`} value={ticket.status} disabled={savingId === ticket.id} onChange={(event) => void updateTicket(ticket.id, event.target.value)}><option>NEW</option><option>ACKNOWLEDGED</option><option>ASSIGNED</option><option>IN PROGRESS</option><option>RESOLVED</option><option>CLOSED</option></select></td></tr>)}</tbody></table>}</div></main>;
}
