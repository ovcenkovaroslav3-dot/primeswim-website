import type { Metadata, Viewport } from 'next';
import { Unbounded, Inter } from 'next/font/google';

import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';
import { ScrollReveal } from '@/components/ScrollReveal';
import { MobileCta } from '@/components/MobileCta';
import { site } from '@/content/site';
import { seo, ogImage } from '@/content/seo';

/*
  Заголовочный шрифт. Нужен ровно в одном весе: им набраны знак, крупная
  надпись первого экрана и монограмма тренера — больше нигде. Каждое лишнее
  начертание это ещё два файла, латиница и кириллица, и они соревнуются
  за канал с показом первого экрана.
*/
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['800'],
  variable: '--font-unbounded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.home.title,
    template: `%s — ${site.name}`,
  },
  description: seo.home.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: site.name,
    title: seo.home.title,
    description: seo.home.description,
    url: site.url,
    images: [ogImage],
  },
  robots: { index: allowIndexing, follow: allowIndexing },
};

export const viewport: Viewport = {
  themeColor: '#4f017b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only rounded-lg bg-aqua-600 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100"
        >
          Перейти к содержанию
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <ScrollReveal />
        <MobileCta />
      </body>
    </html>
  );
}
