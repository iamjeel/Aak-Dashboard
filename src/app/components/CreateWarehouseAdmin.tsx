"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateWarehouseAdminProps {
  isOpen: boolean;
  onClose: () => void;
  refreshUsers: () => void;
}

export default function CreateWarehouseAdmin({
  isOpen,
  onClose,
  refreshUsers,
}: CreateWarehouseAdminProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "warehouseAdmin",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/users/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(`Error: ${result.error}`);
      setLoading(false);
      return;
    } else {
      toast.success("Warehouse admin created successfully!");
      setLoading(false);
      refreshUsers(); // ✅ Refresh the user list
      onClose(); // ✅ Close the modal
    }

    toast.success("Warehouse admin created successfully!");
    setLoading(false);
    onClose(); // ✅ close modal after success
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-md max-w-lg w-full text-white">
        <h1 className="text-2xl font-bold mb-6">Create Warehouse Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-red-500 bg-black text-white rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-red-500 bg-black text-white rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-2 pr-10 border border-red-500 bg-black text-white rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border border-red-500 bg-black text-white rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <input
              name="role"
              type="text"
              value={form.role}
              readOnly
              className="w-full p-2 border border-red-500 bg-black text-white rounded cursor-not-allowed"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white disabled:opacity-50 w-full"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
