import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const sections = [
  {
    title: 'Условия возврата',
    text: 'Возврат средств возможен в следующих случаях: услуга не была доставлена в указанный срок, произошла техническая ошибка при генерации результата, произведена дублирующая оплата. Возврат не предоставляется, если услуга была оказана в полном объёме.',
  },
  {
    title: 'Сроки возврата',
    text: 'Запрос на возврат должен быть подан в течение 24 часов с момента оплаты. После одобрения запроса денежные средства возвращаются на исходный способ оплаты в течение 3-5 рабочих дней.',
  },
  {
    title: 'Как оформить возврат',
    text: 'Для оформления возврата напишите на support@astromarket.shop с указанием номера заказа, даты оплаты и причины возврата. Мы рассмотрим обращение в течение 24 часов и сообщим о решении.',
  },
  {
    title: 'Частичный возврат',
    text: 'Если услуга была оказана частично (например, расклад доставлен, но без ответов на уточняющие вопросы), возможен частичный возврат пропорционально неоказанной части услуги.',
  },
  {
    title: 'Спорные ситуации',
    text: 'В случае несогласия с решением по возврату вы можете направить повторное обращение с дополнительными доказательствами. Мы стремимся решать все спорные ситуации в пользу клиента.',
  },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Возврат средств</h1>
        <p className="text-xs text-mystic-600 mb-8">Последнее обновление: 1 апреля 2026</p>

        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.title} className="p-6 rounded-2xl glass-light">
              <h2 className="font-display text-base font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-sm text-mystic-300 leading-relaxed">{s.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
