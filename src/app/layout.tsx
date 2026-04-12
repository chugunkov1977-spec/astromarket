import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'AstroMarket — AI-маркетплейс эзотерических услуг',
  description: 'Персональные расклады Таро, астрологические прогнозы, нумерологические расчёты от лучших AI-мастеров. Точные предсказания, красивое оформление, быстрый результат.',
  keywords: 'таро онлайн, гадание, астрология, нумерология, расклад таро, гороскоп, руны, предсказания',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'AstroMarket — AI-маркетплейс эзотерических услуг',
    description: 'Персональные расклады Таро, астрологические прогнозы от AI-мастеров',
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
        <div className="relative z-10">
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
