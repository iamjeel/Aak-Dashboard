"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";

interface Pharmacy {
  _id: number;
  username: string;
  email: string;
  planType: string;
  planName: string;
  deliveries_allocated: number;
  deliveries_used?: number;
  contactName?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  deliveryTeam?: string;
}


export default function PharmacyTable() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pharmacy/get-my-pharmacy");
      const data = await response.json();

      if (response.ok) {
        // If data is an object, wrap it in an array
        const normalizedData = Array.isArray(data) ? data : [data];
        setPharmacies(normalizedData);
      } else {
        toast.error("Failed to fetch pharmacies");
      }
    } catch (error) {
      toast.error("Failed to fetch pharmacies");
    } finally {
      setLoading(false);
    }
  };

  console.log("pharmacies >>", pharmacies);
  return (
    <div className="overflow-x-auto p-6 mb-6 border border-red-600 rounded bg-[#111]">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Request Express Delivery
      </h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-red-400">
              <th className="border border-red-600 px-2 py-1 text-left">
                Pharmacy Name
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                Recipient Name
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                Phone Number
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                Address Line 1
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                City
              </th>
              {/* <th className="border border-red-600 px-2 py-1 text-left">State</th> */}
              <th className="border border-red-600 px-2 py-1 text-left">
                Postal Code
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                Delivery Team
              </th>
              <th className="border border-red-600 px-2 py-1 text-left">
                Upload
              </th>
            </tr>
          </thead>
          <tbody>
            {pharmacies.map((pharmacy) => (
              <tr key={pharmacy._id} className="text-white">
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.username}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.contactName ?? "-"}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.phone ?? "-"}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.address ?? "-"}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.address ?? "-"}
                </td>
                {/* <td className="border border-red-800 px-2 py-1">{pharmacy.state ?? "-"}</td> */}
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.postalCode ?? "A1A 1A1"}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {pharmacy.deliveryTeam ?? "Aak Teams"}
                </td>
                <td className="border border-red-800 px-2 py-1">
                  {uploadedFiles[pharmacy._id] ? (
                    <div className="flex items-center gap-2 group">
                      {fileUrls[pharmacy._id]?.startsWith("blob:") &&
                      uploadedFiles[pharmacy._id]?.type.startsWith("image/") ? (
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
                            Click to download file
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
                            Click to download file
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
      )}

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
