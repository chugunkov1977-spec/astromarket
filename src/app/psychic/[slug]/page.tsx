import { psychics } from '@/data/seed-data';
import PsychicPageClient from './PsychicPageClient';

export function generateStaticParams() {
  return psychics.map((p) => ({ slug: p.slug }));
}

export default function PsychicPage() {
  return <PsychicPageClient />;
}
