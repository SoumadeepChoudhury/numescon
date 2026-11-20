import type {Metadata} from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NUMESCON 2026 - Academic Conference Portal',
  description: 'Official landing page, interactive brochure, cluster workshop selector, teaser trailer, and delegate registration system for NUMESCON 2026.',
  openGraph: {
    title: 'NUMESCON 2026 - Academic Conference Portal',
    description: 'Official landing page, interactive brochure, cluster workshop selector, teaser trailer, and delegate registration system for NUMESCON 2026.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NUMESCON 2026 - Academic Conference Portal',
    description: 'Official landing page, interactive brochure, cluster workshop selector, teaser trailer, and delegate registration system for NUMESCON 2026.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="font-sans bg-[#F8FAFC] text-slate-900 antialiased min-h-screen selection:bg-blue-100 selection:text-blue-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
