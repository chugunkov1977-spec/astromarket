# AstroMarket.shop — AI-маркетплейс эзотерических услуг

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка окружения
```bash
cp .env.example .env
# Заполните .env своими ключами
```

### 3. Настройка базы данных
```bash
# Убедитесь что PostgreSQL запущен
npx prisma generate
npx prisma db push
```

### 4. (Опционально) Заполнение базы seed-данными
```bash
npm run db:seed
```

### 5. Запуск dev-сервера
```bash
npm run dev
```

Сайт будет доступен на http://localhost:3000

---

## 📁 Структура проекта

```
astromarket/
├── prisma/
│   └── schema.prisma        # Схема базы данных
├── public/
│   └── images/               # Статические изображения
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Авторизация
│   │   │   ├── orders/        # Заказы
│   │   │   ├── products/      # Каталог
│   │   │   └── generate/      # AI-генерация
│   │   ├── catalog/           # Страница каталога
│   │   ├── product/[slug]/    # Страница товара
│   │   ├── psychic/[slug]/    # Профиль мастера
│   │   ├── auth/              # Авторизация
│   │   ├── orders/            # Мои заказы
│   │   └── page.tsx           # Главная
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── catalog/           # ProductCard, CatalogFilters
│   │   ├── psychic/           # PsychicCard
│   │   └── ui/                # Общие UI-компоненты
│   ├── data/
│   │   └── seed-data.ts       # Seed: 5 персонажей, 30+ товаров
│   ├── hooks/                 # React хуки (auth store)
│   ├── lib/
│   │   ├── utils.ts           # Утилиты
│   │   ├── db.ts              # Prisma client
│   │   └── ai-generation.ts   # AI-генерация (OpenAI)
│   └── types/
│       └── index.ts           # TypeScript типы
└── tailwind.config.ts         # Кастомная тема
```

## 🎨 Дизайн-система

- **Тёмная мистическая тема** с фиолетовыми/золотыми акцентами
- **Шрифты**: Playfair Display (заголовки), Nunito Sans (текст), Cormorant Garamond (мистический)
- **Glassmorphism** эффекты для карточек и панелей
- **Анимации**: fade-in, slide-up, float, shimmer, pulse-glow

## 📋 Фаза 1 MVP — Чеклист

- [x] Схема БД (Prisma)
- [x] Главная страница (Hero + каталог + мастера)
- [x] Каталог с фильтрами
- [x] Страница товара (с отзывами)
- [x] Профили мастеров
- [x] 5 AI-персонажей с промптами
- [x] 30+ товаров с seed-данными
- [x] AI-генерация (OpenAI integration)
- [x] API: товары, заказы, авторизация, генерация
- [x] Адаптивная вёрстка
- [ ] Подключение оплаты (ЮKassa)
- [ ] Чат заказа (WebSocket)
- [ ] Сидинг отзывов (AI-генерация)
- [ ] Реальные изображения (аватары, карточки)
- [ ] Авторизация через OAuth (Google, VK)

## 🔧 Стек

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **DB**: PostgreSQL + Redis
- **AI**: OpenAI API (GPT-4o-mini)
- **Auth**: JWT + bcrypt
- **State**: Zustand
