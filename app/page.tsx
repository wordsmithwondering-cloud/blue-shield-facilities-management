import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">Blue Shield Towers</p>
          <h1>Facility Management<br />Made Simple</h1>
          <p className="landing-summary">Manage maintenance, visitors, services and building operations from one secure portal.</p>
          <Link className="portal-button" href="/login">
            Access Portal <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="landing-visual">
          <Image
            className="landing-tower-image"
            src="/blue-shield-towers.png"
            alt="Blue Shield Towers building"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        </div>
      </section>
    </main>
  );
}
