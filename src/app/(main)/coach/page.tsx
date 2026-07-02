import React from 'react'
import { Metadata } from 'next'
import ClientCoachPage from './ClientCoachPage'

export const metadata: Metadata = {
  title: 'AI Coach | FITNESS OS',
  description: 'Your personal AI fitness and nutrition coach.',
}

export default function CoachPage() {
  return <ClientCoachPage />
}
