import { getTemplates } from '@/actions/templates'
import ClientSessionPage from './ClientSessionPage'

export default async function SessionPage() {
  const templates = await getTemplates()
  return <ClientSessionPage templates={templates} />
}
