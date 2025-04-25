// app/layout.tsx
import './globals.css'
import { Caudex } from 'next/font/google'
import { RoleProvider } from '@/context/RoleContext'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from './utils/supabase-provider'

const caudex = Caudex({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'AAK Deliveries Inc',
  description: 'Delivery Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${caudex.className} bg-black text-white`}>
        <SupabaseProvider>
          <RoleProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#111',
                  color: '#fff',
                  border: '1px solid #f00',
                },
              }}
            />
            {children}
          </RoleProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
