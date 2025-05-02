'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (!res?.ok || res.error) {
      toast.error('Login failed')
      return
    }
    // Fetch user role from session
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role

    // if(res?.ok){
    //   router.refresh()
    // }

    if (role === 'warehouseAdmin' || role === 'admin') {
      router.push('/admin/dashboard')
    } else if (role === 'pharmacy') {
      router.push('/pharmacy/dashboard')
    } else {
      toast.error('Unauthorized role')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-black border border-red-500 px-8 pb-8 pt-4 rounded w-96"
      >
        <div className="flex justify-between pb-4">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl">Login</h1>
          </div>
          <div>
            <Image
              src="/images/AAk.png"
              alt="AAK Deliveries Logo"
              width={60}
              height={60}
            />
          </div>
        </div>

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
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </main>
  )
}
