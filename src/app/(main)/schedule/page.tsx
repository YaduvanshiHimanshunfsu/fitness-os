import { getTemplates } from '@/actions/templates'
import ClientSchedulePage from './ClientSchedulePage'

export default async function SchedulePage() {
  const templates = await getTemplates()
  return <ClientSchedulePage templates={templates} />
}
