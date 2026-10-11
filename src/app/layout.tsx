import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'AirOps Copilot — AI Travel Agent Workspace & OS',
  description: 'AI-Powered Travel Management Company (TMC) Operating System inspired by OptimusX and Sabre GDS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
