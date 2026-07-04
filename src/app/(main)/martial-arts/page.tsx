import ClientMartialArtsPage from './ClientMartialArtsPage'
import { MUAY_THAI_PHASE_1 } from '@/constants/martialArts'

export default async function MartialArtsPage() {
  // We can hook this up to the Supabase database later.
  // For now, we use the constants as the user requested to keep the hardcoded option open.
  return <ClientMartialArtsPage templates={MUAY_THAI_PHASE_1} />
}
