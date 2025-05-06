"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { SquarePen, UploadCloud, X } from "lucide-react";
import UpdatePharmacyModal from "@/app/components/UpdatePharmacy";
import { signOut, useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  interface Pharmacy {
    _id: number;
    username: string;
    email: string;
    planType: string;
    planName: string;
    deliveries_allocated: number;
    deliveries_used?: number;
  }

  const { data: session } = useSession();

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );

  const [stats, setStats] = useState({
    newOrdersToday: 0,
    totalPharmacies: 0,
    deliveriesThisMonth: 0,
    pendingDeliveries: 0,
  });

  const [zoneData] = useState<{ zone: string; deliveries: number }[]>([]);
  const [teamData] = useState<{ team: string; deliveries: number }[]>([]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pharmacyToDelete, setPharmacyToDelete] = useState<Pharmacy | null>(
    null
  );

  const [uploadedFiles, setUploadedFiles] = useState<{
    [pharmacyId: number]: File | null;
  }>({});
  const [fileUrls, setFileUrls] = useState<{ [pharmacyId: number]: string }>(
    {}
  );
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [pharmacyToRemoveFileFrom, setPharmacyToRemoveFileFrom] = useState<
    number | null
  >(null);

  const handleDeleteClick = (pharmacy: Pharmacy) => {
    setPharmacyToDelete(pharmacy);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pharmacy/get-pharmacy");
      const data = await response.json();

      if (response.ok) {
        setPharmacies(data);
        setStats((prev) => ({ ...prev, totalPharmacies: data.length }));
      } else {
        toast.error("Failed to fetch pharmacies");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPharmacy = (id: number) => {
    const pharmacy = pharmacies.find((p) => p._id === id);
    if (!pharmacy) return;
    setSelectedPharmacy(pharmacy);
    setIsOpen(true);
  };

  const confirmDeletePharmacy = async () => {
    if (!pharmacyToDelete) return;

    try {
      const res = await fetch("/api/pharmacy/delete-pharmacy", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pharmacy_id: pharmacyToDelete._id }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${result.error}`);
        return;
      }

      toast.success(`${pharmacyToDelete.username} has been deleted.`);

      setPharmacies((prev) =>
        prev.filter((p) => p._id !== pharmacyToDelete._id)
      );
    } catch (error) {
      toast.error("Failed to delete pharmacy.");
    } finally {
      setIsDeleteOpen(false);
      setPharmacyToDelete(null);
    }
  };

  // const { data: session } = useSession();

  // useEffect(() => {
  //   if (session) {
  //     const timer = setTimeout(() => {
  //       signOut({
  //         callbackUrl: "/login",});
  //     }, 10000); // 10 seconds

  //     return () => clearTimeout(timer); // Clear on unmount or session change
  //   }
  // }, [session]);

  return (
    <div className="p-8 text-white ">
      <h1 className="text-2xl font-bold mb-6">
        {session?.user?.role === "warehouseAdmin"
          ? "Warehouse Admin"
          : "Admin Dashboard"}
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Orders Today" value={stats.newOrdersToday} />
        <StatCard label="Total Pharmacies" value={stats.totalPharmacies} />
        <StatCard
          label="Deliveries This Month"
          value={stats.deliveriesThisMonth}
        />
        <StatCard label="Pending Deliveries" value={stats.pendingDeliveries} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ChartCard title="Deliveries by Zone" data={zoneData} dataKey="zone" />
        <ChartCard title="Deliveries by Team" data={teamData} dataKey="team" />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <h1 className="pb-6 text-xl font-bond">PHARMACIES</h1>
          <table className="min-w-full bg-black border border-red-500">
            <thead>
              <tr className="text-left border-b border-red-500">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Plan</th>
                <th className="p-2">Allocated</th>
                <th className="p-2">Used</th>
                <th className="p-2">Edit</th>
                <th className="p-2">Actions</th>
                <th className="p-2">Upload</th>
              </tr>
            </thead>
            <tbody>
              {pharmacies.map((pharmacy) => (
                <tr key={pharmacy._id} className="border-b border-red-500">
                  <td className="p-2" onClick={() => {}}>
                    {pharmacy.username}
                  </td>
                  <td className="p-2">{pharmacy.email}</td>
                  <td className="p-2">
                    {pharmacy.planType} - {pharmacy.planName}
                  </td>
                  <td className="p-2">{pharmacy.deliveries_allocated}</td>
                  <td className="p-2">{pharmacy.deliveries_used ?? "-"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEditPharmacy(pharmacy._id)}
                      className="text-white hover:text-gray-300"
                    >
                      <SquarePen size={20} />
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      className="border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-black"
                      onClick={() => handleDeleteClick(pharmacy)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="p-2">
                    {uploadedFiles[pharmacy._id] ? (
                      <div className="flex items-center gap-2 group">
                        {fileUrls[pharmacy._id]?.startsWith("blob:") &&
                        uploadedFiles[pharmacy._id]?.type.startsWith(
                          "image/"
                        ) ? (
                          <div className="relative">
                            <img
                              src={fileUrls[pharmacy._id]}
                              alt="preview"
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() =>
                                window.open(fileUrls[pharmacy._id], "_blank")
                              }
                            />
                            <div className="absolute bottom-[-24px] left-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              Click here to download file
                            </div>
                          </div>
                        ) : (
                          <div className="relative max-w-[150px] truncate">
                            <span
                              className="text-sm text-blue-400 underline cursor-pointer"
                              onClick={() =>
                                window.open(fileUrls[pharmacy._id], "_blank")
                              }
                            >
                              {uploadedFiles[pharmacy._id]?.name}
                            </span>
                            <div className="absolute bottom-[-24px] left-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              Click here to download file
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setPharmacyToRemoveFileFrom(pharmacy._id);
                            setShowRemoveModal(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove uploaded file"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor={`file-upload-${pharmacy._id}`}
                          className="cursor-pointer text-white hover:text-gray-300"
                        >
                          <UploadCloud size={22} />
                        </label>
                        <input
                          id={`file-upload-${pharmacy._id}`}
                          type="file"
                          accept=".pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadedFiles((prev) => ({
                                ...prev,
                                [pharmacy._id]: file,
                              }));
                              setFileUrls((prev) => ({
                                ...prev,
                                [pharmacy._id]: URL.createObjectURL(file),
                              }));
                            }
                          }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UpdatePharmacyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pharmacy={selectedPharmacy}
        onUpdated={fetchPharmacies}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeletePharmacy}
        pharmacyName={pharmacyToDelete?.username || "this pharmacy"}
      />
      <RemoveFileConfirmationModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={() => {
          if (pharmacyToRemoveFileFrom !== null) {
            setUploadedFiles((prev) => {
              const updated = { ...prev };
              delete updated[pharmacyToRemoveFileFrom];
              return updated;
            });

            setFileUrls((prev) => {
              const updated = { ...prev };
              delete updated[pharmacyToRemoveFileFrom];
              return updated;
            });

            setPharmacyToRemoveFileFrom(null);
            setShowRemoveModal(false);
          }
        }}
        pharmacyName={
          pharmacies.find((p) => p._id === pharmacyToRemoveFileFrom)
            ?.username || ""
        }
      />
    </div>
  );
}

// --- Components ---
function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-black border border-red-500 p-4 rounded shadow text-center">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: { [key: string]: string | number }[];
  dataKey: string;
}) {
  return (
    <div className="bg-black border border-red-500 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey={dataKey} />
          {/* <YAxis /> */}
          <Tooltip />
          <Legend />
          <Bar dataKey="deliveries" fill="#e11d48" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  pharmacyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pharmacyName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full">
        <h2 className="text-lg font-bold text-black mb-4">Confirm Action</h2>
        <p className="text-black mb-6">
          Are you sure you want to delete <strong>{pharmacyName}</strong>{" "}
          pharmacy?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-1.5 bg-gray-300 rounded-lg text-black  hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1.5 bg-red-600 text-white rounded-lg  hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// remove uploaded file modal
function RemoveFileConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  pharmacyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pharmacyName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full">
        <h2 className="text-lg font-bold text-black mb-4">Remove File</h2>
        <p className="text-black mb-6">
          Are you sure you want to remove the uploaded file for{" "}
          <strong>{pharmacyName}</strong>?
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
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
