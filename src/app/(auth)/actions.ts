'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/sign-in?message=' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/sign-up?message=' + error.message)
  }

  // Sync Supabase Auth User with Prisma Database
  if (authData.user) {
    try {
      await prisma.user.upsert({
        where: { id: authData.user.id },
        update: { name },
        create: {
          id: authData.user.id,
          email: authData.user.email || email,
          name: name || '',
        }
      })
    } catch (dbError) {
      console.error("Prisma Sync Error:", dbError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
