'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSupabase } from '../utils/supabase-provider'
import { useRole } from '@/context/RoleContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { setRole } = useRole()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      toast.error('Login failed')
      return
    }

    const userEmail = data.user.email

    // Set role based on email
    if (userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setRole('admin')
      router.push('/admin/dashboard')
    } else {
      setRole('pharmacy')
      router.push('/pharmacy/dashboard')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-black border border-red-500 p-8 rounded w-96">
        <h1 className="text-2xl mb-4 text-white">Login</h1>
        <input
          className="w-full p-2 mb-4 bg-white text-black rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-4 bg-white text-black rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
          Sign In
        </button>
      </form>
    </main>
  )
}
