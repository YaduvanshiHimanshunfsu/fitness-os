import ClientMuscleFocusPage from './ClientMuscleFocusPage'
import { MUSCLE_FOCUS_CATEGORIES, MUSCLE_FOCUS_TEMPLATES } from '@/constants/muscleFocus'
import { notFound } from 'next/navigation'

import { getMuscleFocusTemplates } from '@/actions/muscleFocus'
import { getCachedSettings } from '@/services/cache-service'

export default async function MuscleFocusPage({ params }: { params: { category: string } }) {
  // Handle both 'chest-focus' and 'chest_focus' URLs by normalizing to underscores
  const normalizedCategory = params.category.replace(/-/g, '_');
  
  const categoryInfo = MUSCLE_FOCUS_CATEGORIES.find(
    c => c.id === normalizedCategory || c.id === params.category
  );
  
  if (!categoryInfo) {
    notFound();
  }

  const settings = await getCachedSettings() || []
  const useDb = settings.find((s: any) => s.key === 'use_db_muscle_focus')?.value === 'true' || settings.find((s: any) => s.key === 'use_db_muscle_focus')?.value === true

  let drills = MUSCLE_FOCUS_TEMPLATES[categoryInfo.id] || [];

  if (useDb) {
    const templates = await getMuscleFocusTemplates();
    const dbTemplate = templates.find((t: any) => t.category === categoryInfo.id);
    
    if (dbTemplate) {
      drills = dbTemplate.muscle_focus_template_exercises
        .sort((a: any, b: any) => a.exercise_order - b.exercise_order)
        .map((d: any) => ({
          id: d.muscle_focus_exercises.id,
          name: d.muscle_focus_exercises.name,
          instruction: d.muscle_focus_exercises.instruction,
          image_url: d.muscle_focus_exercises.image_url,
          sets: d.sets,
          reps: d.reps,
        }));
    }
  }

  return <ClientMuscleFocusPage category={categoryInfo} drills={drills} />
}
