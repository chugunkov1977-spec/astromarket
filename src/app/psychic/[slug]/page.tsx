import { psychics } from '@/data/seed-data';
import PsychicPageClient from './PsychicPageClient';

export function generateStaticParams() {
  return psychics.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const psychic = psychics.find((p) => p.slug === params.slug);
  return {
    title: psychic ? `${psychic.name} — мастер | AstroMarket` : 'Мастер | AstroMarket',
    description: psychic?.shortBio || '',
  };
}

export default function PsychicPage() {
  return <PsychicPageClient />;
}
