import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  catalog: [
    { href: '/catalog?category=TAROT', label: 'Таро' },
    { href: '/catalog?category=ASTROLOGY', label: 'Астрология' },
    { href: '/catalog?category=NUMEROLOGY', label: 'Нумерология' },
    { href: '/catalog?category=RUNES', label: 'Руны' },
  ],
  company: [
    { href: '#', label: 'О нас' },
    { href: '#', label: 'Контакты' },
    { href: '#', label: 'Блог' },
  ],
  legal: [
    { href: '#', label: 'Пользовательское соглашение' },
    { href: '#', label: 'Политика конфиденциальности' },
    { href: '#', label: 'Возврат средств' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-mystic-800/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="AstroMarket"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-display text-lg font-bold text-white">
                Astro<span className="text-gold-400">Market</span>
              </span>
            </Link>
            <p className="text-sm text-mystic-500 leading-relaxed">
              Персональные расклады Таро, астрология, нумерология и руны от AI-мастеров.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-3">Каталог</h4>
            <ul className="space-y-2">
              {footerLinks.catalog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mystic-500 hover:text-mystic-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-3">Компания</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-mystic-500 hover:text-mystic-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правовая информация */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-3">Правовая информация</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-mystic-500 hover:text-mystic-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-10 pt-6 border-t border-mystic-800/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mystic-600">
            &copy; {new Date().getFullYear()} AstroMarket. Все права защищены.
          </p>
          <p className="text-xs text-mystic-700">
            Услуги носят развлекательный характер
          </p>
        </div>
      </div>
    </footer>
  );
}
