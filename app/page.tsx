import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="card">
        <h1>Blue Shield Towers</h1>
        <p>Facility issue reporting and maintenance management.</p>
        <div className="actions">
          <Link className="primary" href="/report">
            Report an issue
          </Link>
          <Link className="secondary" href="/login">
            Sign in
          </Link>
          <Link className="secondary" href="/signup">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
