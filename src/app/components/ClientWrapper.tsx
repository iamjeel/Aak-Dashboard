'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = ['/login', '/logout'].includes(pathname)

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
