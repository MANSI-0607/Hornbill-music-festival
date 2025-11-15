import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, PlusCircle, Loader2, X } from "lucide-react";

type MerchItem = {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  price: number;
  stock: number;
  isActive: boolean;
};

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

export default function AdminMerchManage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    images: [] as string[],
    price: "",
    stock: "0",
    isActive: true,
  });

  const token = localStorage.getItem("adminToken");

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/merch`);
      if (!res.ok) throw new Error("Failed to fetch merchandise");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      toast.error("Failed to load merchandise");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Enforce max 3 images total
    const remainingSlots = 3 - form.images.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    const toUpload = files.slice(0, remainingSlots);

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];
      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select only image files");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Each image must be less than 5MB");
          continue;
        }
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE_URL}/merch/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        if (data?.url) uploadedUrls.push(data.url);
      }
      if (uploadedUrls.length) {
        setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls], imageUrl: f.imageUrl || uploadedUrls[0] }));
        toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (e) {
      toast.error("Failed to upload image(s)");
    } finally {
      setUploading(false);
      // reset input value to allow re-selecting the same file
      if (e.target) e.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => {
      const next = [...f.images];
      next.splice(idx, 1);
      return { ...f, images: next, imageUrl: next[0] || "" };
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price === "") {
      toast.error("Name and price are required");
      return;
    }
    try {
      setLoading(true);
      if (editingId) {
        const res = await fetch(`${API_BASE_URL}/merch/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            imageUrl: (form.imageUrl || form.images[0] || "").trim(),
            images: form.images,
            price: Number(form.price),
            stock: Number(form.stock || 0),
            isActive: form.isActive,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Item updated");
      } else {
        const res = await fetch(`${API_BASE_URL}/merch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            imageUrl: (form.imageUrl || form.images[0] || "").trim(),
            images: form.images,
            price: Number(form.price),
            stock: Number(form.stock || 0),
            isActive: form.isActive,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
        toast.success("Item created");
      }
      setForm({ name: "", description: "", imageUrl: "", images: [], price: "", stock: "0", isActive: true });
      setEditingId(null);
      fetchItems();
    } catch (e) {
      toast.error(editingId ? "Failed to update item" : "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const beginEdit = (item: MerchItem) => {
    const imgs = item.images && item.images.length ? item.images : (item.imageUrl ? [item.imageUrl] : []);
    setForm({
      name: item.name,
      description: item.description || "",
      imageUrl: imgs[0] || "",
      images: imgs,
      price: String(item.price ?? ""),
      stock: String(item.stock ?? 0),
      isActive: item.isActive,
    });
    setEditingId(item._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", imageUrl: "", images: [], price: "", stock: "0", isActive: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/merch/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const toggleActive = async (item: MerchItem) => {
    try {
      const res = await fetch(`${API_BASE_URL}/merch/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (!res.ok) throw new Error("Update failed");
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, isActive: !i.isActive } : i
        )
      );
      toast.success("Updated");
    } catch {
      toast.error("Failed to update item");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Merchandise</h1>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Item" : "New Item"}</CardTitle>
              <CardDescription>{editingId ? "Update the selected merchandise item" : "Add a new merchandise item"}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Hornbill T-Shirt"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="images">Images (max 3)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading || form.images.length >= 3}
                        className="flex-1"
                      />
                      {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    {form.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {form.images.map((url, idx) => (
                          <div key={url} className="relative">
                            <img src={url} alt={`Img ${idx + 1}`} className="w-20 h-20 object-cover rounded border" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1">
                              <X className="h-3 w-3" />
                            </button>
                            {idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/60 text-white rounded-b">Primary</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      placeholder="Short description"
                      rows={3}
                    />
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={form.isActive}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, isActive: v }))
                      }
                    />
                    <Label htmlFor="isActive">Active (visible on store)</Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={loading || uploading}>
                    <PlusCircle className="mr-2 h-4 w-4" />{" "}
                    {loading ? (editingId ? "Updating..." : "Saving...") : (editingId ? "Update Item" : "Create Item")}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit} disabled={loading || uploading}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Items ({items.length})</CardTitle>
              <CardDescription>Manage current store items</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No items yet. Create your first merchandise item!
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-start gap-3 border rounded-md p-3 cursor-pointer ${editingId === item._id ? 'ring-2 ring-pink-500' : ''}`}
                      onClick={() => beginEdit(item)}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-muted rounded flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{item.price.toFixed(2)} • Stock: {item.stock}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.isActive ? (
                            <span className="text-green-600">● Active</span>
                          ) : (
                            <span className="text-gray-500">○ Hidden</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(ev) => { ev.stopPropagation(); toggleActive(item); }}
                        >
                          {item.isActive ? "Hide" : "Show"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(ev) => { ev.stopPropagation(); handleDelete(item._id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}