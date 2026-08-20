import "./globals.css";

export const metadata = {
  title: "Blue Shield Towers | Facilities Management",
  description: "Facility issue reporting and maintenance management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
