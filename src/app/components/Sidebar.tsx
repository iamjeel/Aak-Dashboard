'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRole, Role } from '@/context/RoleContext';

const Sidebar = () => {
  const { data: session } = useSession();
  const { role, setRole } = useRole() as { role: Role; setRole: (role: Role) => void };

  useEffect(() => {
    const sessionRole = session?.user?.role;
    if (sessionRole) {
      setRole(sessionRole as any);
    }
  }, [session, setRole]);

  return (
    <aside className="w-64 h-screen bg-black border-r border-red-500 p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6 text-red-500">AAK Deliveries</h2>

      <nav className="space-y-4 text-white">
        {role === 'admin' && (
          <>
            <Link href="/admin/dashboard" className="block hover:text-red-500">
              🛠️ Admin Dashboard
            </Link>
            <Link href="/admin/warehouse" className="block hover:text-red-500">
              👤 Manage Warehouse Admin
            </Link>
            <Link href="/admin/pharmacies" className="block hover:text-red-500">
              🏥 Manage Pharmacies
            </Link>
          </>
        )}

        {role === 'warehouseAdmin' && (
          <>
            <Link href="/admin/dashboard" className="block hover:text-red-500">
              🛠️ Admin Dashboard
            </Link>
            <Link href="/admin/pharmacies" className="block hover:text-red-500">
              🏥 Manage Pharmacies
            </Link>
          </>
        )}

        {role === 'pharmacy' && (
          <>
            <Link
              href="/pharmacy/dashboard"
              className="block hover:text-red-500"
            >
              📊 Pharmacy Dashboard
            </Link>
            <Link
              href="/pharmacy/request-delivery"
              className="block hover:text-red-500"
            >
              📦 Request Delivery
            </Link>
          </>
        )}

        <Link
          href="/logout"
          className="block mt-10 text-sm text-gray-400 hover:text-white"
        >
          Log Out
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
