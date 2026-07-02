'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  // Verify we haven't hit the 5 user limit
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (count !== null && count >= 5) {
    return { error: 'Registration is closed. Maximum of 5 authorized users reached.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Handle case where user is created but email confirmation is pending
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: 'Account already exists. Try logging in.' }
  }

  // Insert profile immediately if possible
  if (data.user) {
    const name = email.split('@')[0]
    const { error: profileError } = await supabase.from().upsert({
      id: data.user.id,
      email: email,
      name: name.charAt(0).toUpperCase() + name.slice(1)
    }, { onConflict: 'id' })
    
    if (profileError) {
      // We must rollback or inform the user since profile creation failed
      return { error: 'Failed to initialize user profile: ' + profileError.message }
    }
  }

  // NOTE: If email confirmations are enabled in Supabase, this redirect won't have an active session yet.
  // The user needs to disable email confirmations, or check their email.
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
