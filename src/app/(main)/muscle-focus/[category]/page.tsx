import ClientMuscleFocusPage from './ClientMuscleFocusPage'
import { MUSCLE_FOCUS_CATEGORIES, MUSCLE_FOCUS_TEMPLATES } from '@/constants/muscleFocus'
import { notFound } from 'next/navigation'

export default async function MuscleFocusPage({ params }: { params: { category: string } }) {
  const categoryId = params.category;
  const categoryInfo = MUSCLE_FOCUS_CATEGORIES.find(c => c.id === categoryId);
  
  if (!categoryInfo) {
    notFound();
  }

  // Fallback to hardcoded template data if DB is not seeded
  const drills = MUSCLE_FOCUS_TEMPLATES[categoryId] || [];

  return <ClientMuscleFocusPage category={categoryInfo} drills={drills} />
}
