import ClientMuscleFocusPage from './ClientMuscleFocusPage'
import { MUSCLE_FOCUS_CATEGORIES, MUSCLE_FOCUS_TEMPLATES } from '@/constants/muscleFocus'
import { notFound } from 'next/navigation'

export default async function MuscleFocusPage({ params }: { params: { category: string } }) {
  // Handle both 'chest-focus' and 'chest_focus' URLs by normalizing to underscores
  const normalizedCategory = params.category.replace(/-/g, '_');
  
  const categoryInfo = MUSCLE_FOCUS_CATEGORIES.find(
    c => c.id === normalizedCategory || c.id === params.category
  );
  
  if (!categoryInfo) {
    notFound();
  }

  // Fallback to hardcoded template data if DB is not seeded
  const drills = MUSCLE_FOCUS_TEMPLATES[categoryInfo.id] || [];

  return <ClientMuscleFocusPage category={categoryInfo} drills={drills} />
}
