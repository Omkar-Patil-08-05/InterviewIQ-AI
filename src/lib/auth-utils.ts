import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Standardized utility to require authentication in API routes.
 * Throws a standard 401 response if the user is not authenticated.
 * @returns The authenticated Supabase user object
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
