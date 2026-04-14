import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '@/components/ui/Toast';
import SyncProvider from '@/components/providers/SyncProvider';

export const metadata: Metadata = {
  title: 'AstroMarket — Маркетплейс эзотерических услуг',
  description: 'Персональные расклады Таро, астрологические прогнозы, нумерологические расчёты от лучших мастеров. Точные предсказания, красивое оформление, быстрый результат.',
  keywords: 'таро онлайн, гадание, астрология, нумерология, расклад таро, гороскоп, руны, предсказания',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'AstroMarket — Маркетплейс эзотерических услуг',
    description: 'Персональные расклады Таро, астрологические прогнозы от лучших мастеров',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen">
        <div className="particles-bg" />
        <SyncProvider>
          <div className="relative z-10">
            {children}
          </div>
          <ToastContainer />
        </SyncProvider>
      </body>
    </html>
  );
}
