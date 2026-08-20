import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { ClipboardPlus, LayoutDashboard } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const metadata = {
  title: "Blue Shield Towers | Facilities Management",
  description: "Facility issue reporting and maintenance management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label="Blue Shield Facilities Management home">
              <Image className="brand-logo" src="/logo.png" alt="Blue Shield Facilities Management" width={72} height={72} priority />
              <span><b>Blue Shield Towers</b><small>Facilities Management</small></span>
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/report"><ClipboardPlus size={17} aria-hidden="true" />Report Issue</Link>
              <Link href="/dashboard"><LayoutDashboard size={17} aria-hidden="true" />Dashboard</Link>
              <UserNav />
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
