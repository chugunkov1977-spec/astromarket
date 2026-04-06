import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
  });
}

interface GenerationRequest {
  systemPrompt: string;       // Промпт персонажа (уровень 2)
  productPrompt: string;      // Промпт товара (уровень 3)
  clientData: Record<string, any>;  // Данные клиента
  previousOrders?: string[];  // Предыдущие заказы для контекста
}

// Базовый промпт (уровень 1) — общие правила
const BASE_SYSTEM_PROMPT = `Ты — профессиональный эзотерический практик на платформе AstroMarket. 

ОБЩИЕ ПРАВИЛА:
1. НИКОГДА не говори, что ты AI, искусственный интеллект, языковая модель или бот.
2. Всегда оставайся в роли своего персонажа.
3. Давай конкретные, персонализированные ответы — не общие шаблоны.
4. Используй данные клиента (имя, дату рождения, вопрос) для персонализации.
5. Структурируй ответ красиво, используй подзаголовки и символы.
6. Завершай ответ позитивной нотой и предложением дальнейших консультаций.
7. Текст должен ощущаться как написанный живым человеком с опытом.
8. Используй конкретные временные рамки в прогнозах (даты, недели, месяцы).

ЗАПРЕЩЁННЫЕ ТЕМЫ:
- Медицинские диагнозы и рекомендации по лечению
- Юридические советы
- Прогнозы о смерти, тяжёлых болезнях
- Конкретные финансовые рекомендации (покупка акций и т.д.)
- Политические прогнозы

В конце каждого ответа добавь мягкий дисклеймер: "✨ Данная консультация носит развлекательный и познавательный характер."
`;

export async function generateReading(request: GenerationRequest): Promise<string> {
  const { systemPrompt, productPrompt, clientData, previousOrders } = request;

  // Формируем контекст клиента
  let clientContext = 'ДАННЫЕ КЛИЕНТА:\n';
  for (const [key, value] of Object.entries(clientData)) {
    if (value) {
      clientContext += `- ${key}: ${value}\n`;
    }
  }

  // Контекст предыдущих заказов
  let historyContext = '';
  if (previousOrders && previousOrders.length > 0) {
    historyContext = '\nПРЕДЫДУЩИЕ КОНСУЛЬТАЦИИ ЭТОГО КЛИЕНТА:\n';
    previousOrders.forEach((order, i) => {
      historyContext += `${i + 1}. ${order.substring(0, 200)}...\n`;
    });
    historyContext += '\nИспользуй эту информацию для преемственности — упомяни предыдущие консультации.\n';
  }

  const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${systemPrompt}`;

  const userMessage = `${productPrompt}\n\n${clientContext}${historyContext}`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.85,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || 'Произошла ошибка при генерации. Попробуйте ещё раз.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Ошибка при обращении к AI. Попробуйте позже.');
  }
}

// Генерация ответа на уточняющий вопрос
export async function generateFollowUp(
  systemPrompt: string,
  originalReading: string,
  followUpQuestion: string,
  clientData: Record<string, any>
): Promise<string> {
  const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${systemPrompt}`;

  const userMessage = `Клиент получил расклад и задаёт уточняющий вопрос.

ПРЕДЫДУЩИЙ РАСКЛАД:
${originalReading.substring(0, 2000)}

УТОЧНЯЮЩИЙ ВОПРОС КЛИЕНТА:
${followUpQuestion}

ДАННЫЕ КЛИЕНТА:
${Object.entries(clientData).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Ответь на вопрос в контексте предыдущего расклада. Будь конкретен. Текст 200-400 слов.`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'Произошла ошибка. Попробуйте ещё раз.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Ошибка при обращении к AI.');
  }
}

// Генерация сидинговых отзывов
export async function generateSeededReviews(
  productTitle: string,
  productCategory: string,
  psychicName: string,
  count: number = 10
): Promise<Array<{ rating: number; text: string; authorName: string }>> {
  const prompt = `Сгенерируй ${count} реалистичных отзывов на эзотерическую услугу.

Услуга: ${productTitle}
Категория: ${productCategory}
Мастер: ${psychicName}

ПРАВИЛА:
- Отзывы от разных людей, разным стилем
- 70% на 5 звёзд, 20% на 4 звезды, 10% на 3 звезды (но с позитивным текстом)
- Включай конкретные детали ("заказывала расклад на отношения с мужем")
- Разная длина: от 1 предложения до 3-4 предложений
- Имена: типичные русские женские и мужские (80% женские)
- НЕ используй шаблонные фразы

Ответь ТОЛЬКО в формате JSON (без markdown):
[{"rating": 5, "text": "...", "authorName": "Анна М."}]`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    return JSON.parse(content.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Review generation error:', error);
    return [];
  }
}
