"use client";

import { SquarePen, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateWarehouseAdmin from "@/app/components/UpdateWarehouseAdmin";
import CreateWarehouseAdmin from "@/app/components/CreateWarehouseAdmin";

export default function UserListPage() {
  interface User {
    _id: number;
    name: string;
    email: string;
    phone: number;
    role: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/get-user");
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditWarehouseAdmin = (id: number) => {
    const user = users.find((p) => p._id === id);
    if (!user) return;
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleAddWarehouseAdmin = () => {
    setIsCreateOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch("/api/users/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userToDelete._id }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${result.error}`);
        return;
      }

      toast.success(`${userToDelete.name} has been deleted.`);

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setIsDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Warehouse Admin</h1>
      <button
        onClick={handleAddWarehouseAdmin}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md"
      >
        <UserRoundPlus size={20} />
        Add Admin
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto pt-4">
          <table className="min-w-full bg-black border border-red-500">
            <thead>
              <tr className="text-left border-b border-red-500">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Edit</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-red-500">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEditWarehouseAdmin(user._id)}
                      className="text-white hover:text-gray-300"
                    >
                      <SquarePen size={20} />
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-black"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <UpdateWarehouseAdmin
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={selectedUser}
        refreshUsers={fetchUsers}
      />

      <CreateWarehouseAdmin
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        refreshUsers={fetchUsers}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteUser}
        userName={userToDelete?.name || "this user"}
      />
    </div>
  );
}

// Modal Component
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full">
        <h2 className="text-lg font-bold text-black mb-4">Confirm Action</h2>
        <p className="text-black mb-6">
          Are you sure you want to delete <strong>{userName}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-1.5 bg-gray-300 rounded-lg text-black hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
