import ClientMartialArtsPage from './ClientMartialArtsPage'
import { MUAY_THAI_PHASE_1 } from '@/constants/martialArts'
import { getMartialArtsTemplates } from '@/actions/martialArts'
import { getCachedSettings } from '@/services/cache-service'

export default async function MartialArtsPage() {
  const settings = await getCachedSettings() || []
  const useDb = settings.find((s: any) => s.key === 'use_db_martial_arts')?.value === 'true' || settings.find((s: any) => s.key === 'use_db_martial_arts')?.value === true

  let templatesToUse = MUAY_THAI_PHASE_1

  if (useDb) {
    const dbTemplates = await getMartialArtsTemplates()
    if (dbTemplates && dbTemplates.length > 0) {
      templatesToUse = dbTemplates
    }
  }

  return <ClientMartialArtsPage templates={templatesToUse} />
}
