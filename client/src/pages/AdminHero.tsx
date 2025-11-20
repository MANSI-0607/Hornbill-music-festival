import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface HeroImage {
  _id?: string;
  desktop: string;
  mobile: string;
  alt: string;
  order: number;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
const AdminHero: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newImage, setNewImage] = useState({
    desktop: "",
    mobile: "",
    alt: "Hornbill Music Festival",
  });

  // -------------------------------------
  // FETCH HERO IMAGES
  // -------------------------------------
  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/hero`);
      const data = await res.json();
      setHeroImages(data);
    } catch {
      toast.error("Failed to load hero images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // -------------------------------------
  // UPLOAD IMAGE (Backend → Cloudinary)
  // -------------------------------------
  const uploadImage = async (file: File, type: "desktop" | "mobile") => {
    const formData = new FormData();
    formData.append("heroImage", file);

    try {
      setUploading(true);

      const res = await fetch(`${API_BASE_URL}/hero/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setNewImage((prev) => ({
        ...prev,
        [type]: data.url,
      }));

      toast.success(`${type === "desktop" ? "Desktop" : "Mobile"} banner uploaded`);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // -------------------------------------
  // DROPZONES
  // -------------------------------------
  const desktopDropzone = useDropzone({
    maxFiles: 1,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    onDrop: (files) => uploadImage(files[0], "desktop"),
  });

  const mobileDropzone = useDropzone({
    maxFiles: 1,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    onDrop: (files) => uploadImage(files[0], "mobile"),
  });

  // -------------------------------------
  // ADD NEW HERO IMAGE ENTRY
  // -------------------------------------
  const handleAddHeroImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newImage.desktop || !newImage.mobile) {
      toast.error("Upload both Desktop & Mobile banners");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/hero`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newImage,
          order: heroImages.length,
        }),
      });

      const data = await res.json();

      setHeroImages((prev) => [...prev, data]);
      setNewImage({
        desktop: "",
        mobile: "",
        alt: "Hornbill Music Festival",
      });

      toast.success("Hero banner added 🎉");
    } catch (err) {
      toast.error("Failed to add hero image");
    }
  };

  // -------------------------------------
  // DELETE
  // -------------------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero banner?")) return;

    try {
      await fetch(`${API_BASE_URL}/hero/${id}`, { method: "DELETE" });
      setHeroImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  // -------------------------------------
  // REORDER
  // -------------------------------------
  const updateOrder = async (id: string, newOrder: number) => {
    try {
      await fetch(`${API_BASE_URL}/hero/${id}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });

      const updated = heroImages.map((img) =>
        img._id === id ? { ...img, order: newOrder } : img
      );

      setHeroImages(updated.sort((a, b) => a.order - b.order));
    } catch {
      toast.error("Order update failed");
    }
  };

  // -------------------------------------
  // UI
  // -------------------------------------
  return (
  <div className="container mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold text-festival-orange mb-8">
      Hero Banner Manager
    </h1>

    {/* ADD NEW HERO IMAGE */}
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Upload New Hero Banner ( 10MB max)
      </h2>
      <p className="text-gray-700 mb-6">
        Upload separate high-quality banners for Desktop & Mobile screens.
      </p>

      <form onSubmit={handleAddHeroImage} className="space-y-6">

        {/* Upload Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* DESKTOP */}
          <div>
            <p className="font-medium text-gray-900 mb-2">
              Desktop Banner (Recommended 1920×1080)
            </p>
            <div
              {...desktopDropzone.getRootProps()}
              className="h-48 flex flex-col justify-center items-center border-2 border-dashed 
              border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <input {...desktopDropzone.getInputProps()} />

              {newImage.desktop ? (
                <img
                  src={newImage.desktop}
                  alt="Desktop preview"
                  className="max-h-40 rounded"
                />
              ) : (
                <p className="text-gray-800 text-center font-medium">
                  {uploading ? "Uploading..." : "Click or drag file here"}
                </p>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <p className="font-medium text-gray-900 mb-2">
              Mobile Banner (Recommended 750×1334)
            </p>
            <div
              {...mobileDropzone.getRootProps()}
              className="h-48 flex flex-col justify-center items-center border-2 border-dashed 
              border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <input {...mobileDropzone.getInputProps()} />

              {newImage.mobile ? (
                <img
                  src={newImage.mobile}
                  alt="Mobile preview"
                  className="max-h-40 rounded"
                />
              ) : (
                <p className="text-gray-800 text-center font-medium">
                  {uploading ? "Uploading..." : "Click or drag file here"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ALT TEXT */}
        <div>
          <label className="block font-medium text-gray-900 mb-2">
            Alt Text (visible to search engines & screen readers)
          </label>
          <input
            type="text"
            value={newImage.alt}
            onChange={(e) =>
              setNewImage((prev) => ({ ...prev, alt: e.target.value }))
            }
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-gray-900"
            placeholder="Describe the banner content"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !newImage.desktop || !newImage.mobile}
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          Add Hero Banner
        </button>
      </form>
    </div>

    {/* EXISTING HERO IMAGES */}
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Existing Hero Banners
      </h2>

      {loading ? (
        <p className="text-gray-700">Loading banners...</p>
      ) : heroImages.length === 0 ? (
        <p className="text-gray-700">No banners added yet.</p>
      ) : (
        heroImages
          .sort((a, b) => a.order - b.order)
          .map((image, index) => (
            <div key={image._id} className="border border-gray-300 rounded-lg p-4 mb-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  Banner {index + 1}
                </h3>

                <div className="space-x-3">
                  {index > 0 && (
                    <button
                      onClick={() => updateOrder(image._id!, image.order - 1)}
                      className="text-gray-800 hover:text-blue-600 font-medium"
                    >
                      ↑ Move Up
                    </button>
                  )}
                  {index < heroImages.length - 1 && (
                    <button
                      onClick={() => updateOrder(image._id!, image.order + 1)}
                      className="text-gray-800 hover:text-blue-600 font-medium"
                    >
                      ↓ Move Down
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-800 font-medium"
                    onClick={() => handleDelete(image._id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-800 mb-1 font-medium">
                    Desktop Version
                  </p>
                  <img
                    src={image.desktop}
                    className="rounded border border-gray-300 w-full"
                  />
                </div>
                <div>
                  <p className="text-gray-800 mb-1 font-medium">
                    Mobile Version
                  </p>
                  <img
                    src={image.mobile}
                    className="rounded border border-gray-300 w-full max-w-xs"
                  />
                </div>
              </div>

              <p className="mt-3 text-gray-800">
                <span className="font-medium">Alt Text:</span> {image.alt}
              </p>
            </div>
          ))
      )}
    </div>
  </div>
);

};

export default AdminHero;
