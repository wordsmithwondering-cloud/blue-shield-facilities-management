import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {Resend} from 'resend';

export async function POST(req:Request){
 try{
  const form=await req.formData();
  const category=String(form.get('category')||'');
  const priority=String(form.get('priority')||'Normal');
  const description=String(form.get('description')||'');
  const name=String(form.get('name')||'');
  const company=String(form.get('company')||'');
  const phone=String(form.get('phone')||'');
  const location=String(form.get('location')||'Blue Shield Towers');
  if(!description||!name)return NextResponse.json({error:'Name and description are required.'},{status:400});
  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const {data,error}=await supabase.rpc('create_facility_ticket',{p_location:location,p_category:category,p_priority:priority,p_description:description,p_reporter_name:name,p_company:company,p_phone:phone});
  if(error)throw error;
  const ticket=data as string;
  if(process.env.RESEND_API_KEY){
    const resend=new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({from:'Blue Shield Towers <noreply@propertylegend.com>',to:process.env.NOTIFICATION_EMAIL||'brian@propertylegend.com',subject:`New Facilities Ticket ${ticket}`,html:`<h2>New Facility Issue</h2><p><b>Ticket:</b> ${ticket}</p><p><b>Location:</b> ${location}</p><p><b>Category:</b> ${category}</p><p><b>Priority:</b> ${priority}</p><p><b>Reported by:</b> ${name}</p><p>${description}</p>`});
  }
  return NextResponse.json({ticket});
 }catch(e){console.error(e);return NextResponse.json({error:'Ticket could not be created.'},{status:500})}
}
