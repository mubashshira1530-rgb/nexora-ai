import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Nexora AI — Intelligent Conversations',
  description:
    'Nexora AI is a premium AI chat assistant that delivers intelligent, context-aware conversations in a beautiful interface.',
  themeColor: '#0a0a0f',
  openGraph: {
    title: 'Nexora AI — Intelligent Conversations',
    description:
      'Premium AI chat assistant with context-aware responses and a beautiful dark interface.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
