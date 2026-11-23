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
import {
  Trash2,
  PlusCircle,
  Loader2,
  X,
  ArrowLeft,
  Edit,
  Plus,
  Image as ImageIcon,
  Ruler,
  Check,
  Eye,
  Palette,
  Sparkles,
  PackageCheck,
  Tag,
  ShoppingBag,
  UploadCloud,
  Grid,
} from "lucide-react";

export type DesignOption = {
  name: string;
  code: string;
};

export type ColourOption = {
  name: string;
  hex: string;
};

export type VariantImage = {
  design: string;
  colour: string;
  imageUrl: string;
  images?: string[];
};

export type CategoryShowcase = {
  category: "T-Shirts" | "Winterwear" | "Accessories" | "General";
  title?: string;
  description?: string;
  images: string[];
};

export type MerchItem = {
  _id: string;
  name: string;
  productCode: string;
  category: "T-Shirts" | "Winterwear" | "Accessories" | "General";
  description?: string;
  fabric?: string;
  weight?: string;
  fit?: string;
  price: number;
  hasPackOption?: boolean;
  packPrice?: number;
  packLabel?: string;
  imageUrl?: string;
  images?: string[];
  designs?: DesignOption[];
  colours?: ColourOption[];
  sizes?: string[];
  sizeChartUrl?: string;
  variantImages?: VariantImage[];
  stock: number;
  isActive: boolean;
  createdAt?: string;
};

// ---------------------------------------------
// Catalog Quick Presets (From Merchland Catalog)
// ---------------------------------------------
const CATALOG_PRESETS = [
  {
    label: "Classic Round-Neck Tee (HBF-RNT)",
    category: "T-Shirts" as const,
    name: "Classic Round-Neck Tee",
    productCode: "HBF-RNT",
    price: 535,
    fabric: "100% cotton, bio-washed",
    weight: "180 GSM",
    fit: "Regular, round neck",
    description: "Soft, bio-washed cotton with a small chest mark and one big back print.",
    designs: [
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Bamboo Grove", code: "BAMBOO" },
    ],
    colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Navy", hex: "#1B2A4A" },
      { name: "Cream", hex: "#F5EFE0" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Oversized Tee (HBF-OST)",
    category: "T-Shirts" as const,
    name: "Oversized Tee",
    productCode: "HBF-OST",
    price: 585,
    fabric: "100% cotton, bio-washed",
    weight: "180 GSM",
    fit: "Oversized, drop shoulder",
    description: "Drop-shoulder, boxy and roomy: the streetwear cut for the big back print.",
    designs: [
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Bamboo Grove", code: "BAMBOO" },
    ],
    colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Pullover Hoodie (HBF-HD320)",
    category: "Winterwear" as const,
    name: "Pullover Hoodie",
    productCode: "HBF-HD320",
    price: 999,
    fabric: "Poly-cotton 3-thread fleece",
    weight: "320 GSM",
    fit: "Regular pullover",
    description: "Warm 320 GSM fleece with a kangaroo pocket for cold Kisama evenings.",
    designs: [
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Bamboo Grove", code: "BAMBOO" },
    ],
    colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Off-white", hex: "#F3EDE2" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Crew Sweatshirt (HBF-SWT)",
    category: "Winterwear" as const,
    name: "Crew Sweatshirt",
    productCode: "HBF-SWT",
    price: 800,
    fabric: "Cotton 3-thread fleece",
    weight: "320 GSM",
    fit: "Regular crew neck",
    description: "Soft brushed fleece with ribbed cuffs and hem.",
    designs: [
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Bamboo Grove", code: "BAMBOO" },
    ],
    colours: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Tote Bag (HBF-TOTE)",
    category: "Accessories" as const,
    name: "Tote Bag",
    productCode: "HBF-TOTE",
    price: 370,
    fabric: "Cotton canvas, 16 × 14 in",
    weight: "Sturdy canvas",
    fit: "Long shoulder straps",
    description: "A sturdy canvas tote for the festival grounds and everyday adventures.",
    designs: [
      { name: "Postcard Hornbill", code: "POST" },
      { name: "Hornbill in Bloom", code: "BLOOM" },
    ],
    colours: [
      { name: "Natural", hex: "#E8DFC9" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["One Size"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Coffee Mug (HBF-MUG)",
    category: "Accessories" as const,
    name: "Coffee Mug",
    productCode: "HBF-MUG",
    price: 420,
    fabric: "White ceramic, glossy",
    weight: "Full colour print",
    fit: "Standard 330ml",
    description: "White ceramic mug with the full Hornbill Festival floral logo.",
    designs: [{ name: "Hornbill Floral Logo", code: "LOGO" }],
    colours: [{ name: "White", hex: "#FFFFFF" }],
    sizes: ["Standard"],
    hasPackOption: false,
    packPrice: 0,
    packLabel: "Pack of 10",
  },
  {
    label: "Round Pin Badge (HBF-BDG)",
    category: "Accessories" as const,
    name: "Round Pin Badge",
    productCode: "HBF-BDG",
    price: 35,
    fabric: "Glossy finish, safety pin",
    weight: "58 mm round",
    fit: "Pin badge",
    description: "The hornbill stamp, full logo, and festival plants as collectible pin badges.",
    designs: [
      { name: "Hornbill Stamp", code: "STAMP" },
      { name: "Hornbill in Bloom", code: "BLOOM" },
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Wild Orchid", code: "ORCHID" },
      { name: "Bamboo Grove", code: "BAMBOO" },
      { name: "Bamboo Shoots", code: "SHOOTS" },
    ],
    colours: [{ name: "Standard", hex: "#E0E0E0" }],
    sizes: ["58 mm"],
    hasPackOption: true,
    packPrice: 470,
    packLabel: "Pack of 10 (Mixed Designs)",
  },
  {
    label: "Die-cut Sticker (HBF-STK)",
    category: "Accessories" as const,
    name: "Die-cut Sticker",
    productCode: "HBF-STK",
    price: 15,
    fabric: "Die-cut vinyl with white border",
    weight: "Up to 3 × 3 in",
    fit: "Die-cut shape",
    description: "The hornbill stamp, logo and festival plants, precision cut to shape.",
    designs: [
      { name: "Hornbill Stamp", code: "STAMP" },
      { name: "Hornbill in Bloom", code: "BLOOM" },
      { name: "Kisama Lily", code: "LILY" },
      { name: "Rhododendron Bloom", code: "RHODO" },
      { name: "Wild Orchid", code: "ORCHID" },
      { name: "Bamboo Grove", code: "BAMBOO" },
      { name: "Bamboo Shoots", code: "SHOOTS" },
    ],
    colours: [{ name: "Multi", hex: "#F05D29" }],
    sizes: ["Up to 3 in"],
    hasPackOption: true,
    packPrice: 270,
    packLabel: "Pack of 10 (Mixed Designs)",
  },
];

const STANDARD_DESIGNS: DesignOption[] = [
  { name: "Kisama Lily", code: "LILY" },
  { name: "Rhododendron Bloom", code: "RHODO" },
  { name: "Bamboo Grove", code: "BAMBOO" },
  { name: "Hornbill Stamp", code: "STAMP" },
  { name: "Hornbill in Bloom", code: "BLOOM" },
  { name: "Wild Orchid", code: "ORCHID" },
  { name: "Bamboo Shoots", code: "SHOOTS" },
];

const STANDARD_COLOURS: ColourOption[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Cream", hex: "#F5EFE0" },
  { name: "Off-white", hex: "#F3EDE2" },
  { name: "Natural", hex: "#E8DFC9" },
];

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

export default function AdminMerchManage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MerchItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingChart, setUploadingChart] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom inputs
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [customDesignName, setCustomDesignName] = useState("");
  const [customDesignCode, setCustomDesignCode] = useState("");
  const [customColourName, setCustomColourName] = useState("");
  const [customColourHex, setCustomColourHex] = useState("#F05D29");
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [customSizeChartUrl, setCustomSizeChartUrl] = useState("");
  const [previewChartModal, setPreviewChartModal] = useState<string | null>(null);

  // Variant combination modal / upload target
  const [variantUploadTarget, setVariantUploadTarget] = useState<{
    design: string;
    colour: string;
  } | null>(null);
  const [variantUrlInput, setVariantUrlInput] = useState("");
  const [uploadingVariant, setUploadingVariant] = useState(false);

  // Category Showcase State (At least 3 images for each category)
  const [categoryShowcases, setCategoryShowcases] = useState<CategoryShowcase[]>([
    { category: "T-Shirts", title: "T-Shirts Collection", description: "Classic & Oversized Festival Tees", images: [] },
    { category: "Winterwear", title: "Winterwear Collection", description: "Warm Fleeces, Pullover Hoodies & Sweatshirts", images: [] },
    { category: "Accessories", title: "Accessories Collection", description: "Official Tote Bags, Mugs, Badges & Stickers", images: [] },
    { category: "General", title: "Festival Merchandise", description: "Official TaFMA / Merchland Drops", images: [] },
  ]);
  const [activeCategoryTab, setActiveCategoryTab] = useState<"T-Shirts" | "Winterwear" | "Accessories" | "General">("T-Shirts");
  const [savingCategory, setSavingCategory] = useState(false);
  const [uploadingCategorySlot, setUploadingCategorySlot] = useState<number | null>(null);
  const [categoryUrlInputs, setCategoryUrlInputs] = useState<Record<number, string>>({});
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [form, setForm] = useState({
    name: "",
    productCode: "",
    category: "T-Shirts" as "T-Shirts" | "Winterwear" | "Accessories" | "General",
    description: "",
    fabric: "",
    weight: "",
    fit: "",
    price: "",
    hasPackOption: false,
    packPrice: "",
    packLabel: "Pack of 10",
    imageUrl: "",
    images: [] as string[],
    designs: [] as DesignOption[],
    colours: [] as ColourOption[],
    sizes: [] as string[],
    sizeChartUrl: "",
    variantImages: [] as VariantImage[],
    stock: "100",
    isActive: true,
  });

  const token = localStorage.getItem("adminToken");

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/merch?all=true`);
      if (!res.ok) throw new Error("Failed to fetch merchandise");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load merchandise items");
    }
  };

  const fetchCategoryShowcases = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/merch/categories/showcase`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setCategoryShowcases(data);
        }
      }
    } catch {
      console.error("Failed to fetch category showcases");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategoryShowcases();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ----------------------------------------
  // Apply a Catalog Preset
  // ----------------------------------------
  const applyPreset = (preset: typeof CATALOG_PRESETS[0]) => {
    setForm((prev) => ({
      ...prev,
      name: preset.name,
      productCode: preset.productCode,
      category: preset.category,
      price: String(preset.price),
      fabric: preset.fabric,
      weight: preset.weight,
      fit: preset.fit,
      description: preset.description,
      designs: [...preset.designs],
      colours: [...preset.colours],
      sizes: [...preset.sizes],
      hasPackOption: preset.hasPackOption,
      packPrice: preset.packPrice ? String(preset.packPrice) : "",
      packLabel: preset.packLabel,
    }));
    toast.success(`Loaded preset: ${preset.name}`);
  };

  // ----------------------------------------
  // General Product Images (NO LIMIT)
  // ----------------------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select only image files");
          continue;
        }
        if (file.size > 8 * 1024 * 1024) {
          toast.error("Each image must be less than 8MB");
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
        setForm((f) => {
          const nextImages = [...f.images, ...uploadedUrls];
          return {
            ...f,
            images: nextImages,
            imageUrl: f.imageUrl || nextImages[0] || "",
          };
        });
        toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch {
      toast.error("Failed to upload image(s). You can paste image URL below.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    setForm((f) => {
      const nextImages = [...f.images, trimmed];
      return {
        ...f,
        images: nextImages,
        imageUrl: f.imageUrl || nextImages[0] || "",
      };
    });
    setCustomImageUrl("");
    toast.success("Image URL added");
  };

  const removeImage = (idx: number) => {
    setForm((f) => {
      const next = [...f.images];
      next.splice(idx, 1);
      return { ...f, images: next, imageUrl: next[0] || "" };
    });
  };

  // ----------------------------------------
  // Combination-Specific Variant Images (Multi-Slot: At least 3 images)
  // ----------------------------------------
  const getVariantImage = (design: string, colour: string) => {
    return form.variantImages.find(
      (vi) => vi.design === design && vi.colour === colour
    );
  };

  const setVariantImagesList = (design: string, colour: string, imagesList: string[]) => {
    const valid = imagesList.map((s) => String(s || "").trim()).filter(Boolean);
    setForm((f) => {
      const existingIdx = f.variantImages.findIndex(
        (vi) => vi.design === design && vi.colour === colour
      );
      let updatedList = [...f.variantImages];
      if (valid.length > 0) {
        const primary = valid[0];
        if (existingIdx >= 0) {
          updatedList[existingIdx] = { design, colour, imageUrl: primary, images: valid };
        } else {
          updatedList.push({ design, colour, imageUrl: primary, images: valid });
        }
      } else {
        if (existingIdx >= 0) {
          updatedList.splice(existingIdx, 1);
        }
      }
      return { ...f, variantImages: updatedList };
    });
  };

  const setVariantImageRecord = (design: string, colour: string, imageUrl: string) => {
    setVariantImagesList(design, colour, imageUrl ? [imageUrl] : []);
  };

  const handleUploadForCombinationSlot = async (
    design: string,
    colour: string,
    slotIdx: number,
    file: File
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploadingVariant(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE_URL}/merch/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data?.url) {
        const current = getVariantImage(design, colour);
        let imgs = current?.images && current.images.length > 0 ? [...current.images] : (current?.imageUrl ? [current.imageUrl] : []);
        imgs[slotIdx] = data.url;
        setVariantImagesList(design, colour, imgs);
        toast.success(`Slot ${slotIdx + 1} image uploaded for ${design} · ${colour}`);
      }
    } catch {
      toast.error(`Failed to upload image`);
    } finally {
      setUploadingVariant(false);
    }
  };

  const handleAttachUrlForCombinationSlot = (
    design: string,
    colour: string,
    slotIdx: number,
    url: string
  ) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const current = getVariantImage(design, colour);
    let imgs = current?.images && current.images.length > 0 ? [...current.images] : (current?.imageUrl ? [current.imageUrl] : []);
    imgs[slotIdx] = trimmed;
    setVariantImagesList(design, colour, imgs);
    toast.success(`Slot ${slotIdx + 1} attached for ${design} · ${colour}`);
  };

  const handleRemoveCombinationImage = (
    design: string,
    colour: string,
    imgIdx: number
  ) => {
    const current = getVariantImage(design, colour);
    if (!current) return;
    let imgs = current.images && current.images.length > 0 ? [...current.images] : (current.imageUrl ? [current.imageUrl] : []);
    imgs.splice(imgIdx, 1);
    setVariantImagesList(design, colour, imgs);
    toast.success("Image removed from combination");
  };

  // ----------------------------------------
  // Category Showcase Photos (At least 3 images per category)
  // ----------------------------------------
  const handleSaveCategoryShowcase = async (cat: "T-Shirts" | "Winterwear" | "Accessories" | "General") => {
    const current = categoryShowcases.find((c) => c.category === cat);
    if (!current) return;
    try {
      setSavingCategory(true);
      const res = await fetch(`${API_BASE_URL}/merch/categories/showcase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(current),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(`Showcase images for ${cat} saved successfully!`);
    } catch {
      toast.error(`Failed to save showcase images for ${cat}`);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleUploadCategorySlot = async (
    categoryName: "T-Shirts" | "Winterwear" | "Accessories" | "General",
    slotIndex: number,
    file: File
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    try {
      setUploadingCategorySlot(slotIndex);
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE_URL}/merch/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data?.url) {
        setCategoryShowcases((prev) =>
          prev.map((c) => {
            if (c.category !== categoryName) return c;
            const nextImages = [...(c.images || [])];
            nextImages[slotIndex] = data.url;
            return { ...c, images: nextImages.filter(Boolean) };
          })
        );
        toast.success(`Image uploaded for ${categoryName} (Slot ${slotIndex + 1})`);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingCategorySlot(null);
    }
  };

  const handleAttachCategoryUrl = (
    categoryName: "T-Shirts" | "Winterwear" | "Accessories" | "General",
    slotIndex: number,
    url: string
  ) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setCategoryShowcases((prev) =>
      prev.map((c) => {
        if (c.category !== categoryName) return c;
        const nextImages = [...(c.images || [])];
        nextImages[slotIndex] = trimmed;
        return { ...c, images: nextImages.filter(Boolean) };
      })
    );
    setCategoryUrlInputs((prev) => ({ ...prev, [slotIndex]: "" }));
    toast.success(`Image attached to Slot ${slotIndex + 1}`);
  };

  const handleRemoveCategorySlot = (
    categoryName: "T-Shirts" | "Winterwear" | "Accessories" | "General",
    slotIndex: number
  ) => {
    setCategoryShowcases((prev) =>
      prev.map((c) => {
        if (c.category !== categoryName) return c;
        const nextImages = [...(c.images || [])];
        nextImages.splice(slotIndex, 1);
        return { ...c, images: nextImages };
      })
    );
    toast.success("Image removed from category");
  };

  // ----------------------------------------
  // Designs Handlers
  // ----------------------------------------
  const toggleStandardDesign = (design: DesignOption) => {
    setForm((f) => {
      const exists = f.designs.some((d) => d.name === design.name);
      return {
        ...f,
        designs: exists
          ? f.designs.filter((d) => d.name !== design.name)
          : [...f.designs, design],
      };
    });
  };

  const handleAddCustomDesign = () => {
    const name = customDesignName.trim();
    if (!name) return;
    const code = customDesignCode.trim().toUpperCase() || name.substring(0, 4).toUpperCase();
    if (form.designs.some((d) => d.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Design name already exists");
      return;
    }
    setForm((f) => ({ ...f, designs: [...f.designs, { name, code }] }));
    setCustomDesignName("");
    setCustomDesignCode("");
  };

  const removeDesign = (name: string) => {
    setForm((f) => ({ ...f, designs: f.designs.filter((d) => d.name !== name) }));
  };

  // ----------------------------------------
  // Colours Handlers
  // ----------------------------------------
  const toggleStandardColour = (col: ColourOption) => {
    setForm((f) => {
      const exists = f.colours.some((c) => c.name === col.name);
      return {
        ...f,
        colours: exists
          ? f.colours.filter((c) => c.name !== col.name)
          : [...f.colours, col],
      };
    });
  };

  const handleAddCustomColour = () => {
    const name = customColourName.trim();
    if (!name) return;
    if (form.colours.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Colour name already exists");
      return;
    }
    setForm((f) => ({
      ...f,
      colours: [...f.colours, { name, hex: customColourHex || "#1A1A1A" }],
    }));
    setCustomColourName("");
  };

  const removeColour = (name: string) => {
    setForm((f) => ({ ...f, colours: f.colours.filter((c) => c.name !== name) }));
  };

  // ----------------------------------------
  // Sizes Handlers
  // ----------------------------------------
  const toggleSize = (size: string) => {
    setForm((f) => {
      const exists = f.sizes.includes(size);
      return {
        ...f,
        sizes: exists ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
      };
    });
  };

  const handleSetApparelSizes = () => {
    setForm((f) => ({
      ...f,
      sizes: Array.from(new Set([...f.sizes, ...APPAREL_SIZES])),
    }));
    toast.success("Apparel sizes (S-XXL) added");
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    if (form.sizes.includes(trimmed)) {
      toast.error("Size already exists");
      return;
    }
    setForm((f) => ({ ...f, sizes: [...f.sizes, trimmed] }));
    setCustomSizeInput("");
  };

  // ----------------------------------------
  // Size Chart Handlers
  // ----------------------------------------
  const handleSizeChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Size chart must be less than 8MB");
      return;
    }

    try {
      setUploadingChart(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE_URL}/merch/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data?.url) {
        setForm((f) => ({ ...f, sizeChartUrl: data.url }));
        toast.success("Size chart uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload size chart image. You can enter a URL below.");
    } finally {
      setUploadingChart(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddSizeChartUrl = () => {
    const trimmed = customSizeChartUrl.trim();
    if (!trimmed) return;
    setForm((f) => ({ ...f, sizeChartUrl: trimmed }));
    setCustomSizeChartUrl("");
    toast.success("Size chart URL attached");
  };

  // ----------------------------------------
  // Submit (Create / Edit)
  // ----------------------------------------
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      toast.error("Name and price are required");
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const packPriceNum = form.hasPackOption ? parseFloat(form.packPrice) : 0;
    const stockNum = parseInt(form.stock, 10);

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        productCode: form.productCode.trim().toUpperCase(),
        category: form.category,
        description: form.description.trim(),
        fabric: form.fabric.trim(),
        weight: form.weight.trim(),
        fit: form.fit.trim(),
        price: priceNum,
        hasPackOption: form.hasPackOption,
        packPrice: isNaN(packPriceNum) ? 0 : packPriceNum,
        packLabel: form.packLabel.trim(),
        imageUrl: (form.imageUrl || form.images[0] || "").trim(),
        images: form.images,
        variantImages: form.variantImages,
        designs: form.designs,
        colours: form.colours,
        sizes: form.sizes,
        sizeChartUrl: form.sizeChartUrl.trim(),
        stock: isNaN(stockNum) ? 100 : stockNum,
        isActive: form.isActive,
      };

      if (editingId) {
        const res = await fetch(`${API_BASE_URL}/merch/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Merchandise item updated successfully");
      } else {
        const res = await fetch(`${API_BASE_URL}/merch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        toast.success("Merchandise item created successfully");
      }

      setForm({
        name: "",
        productCode: "",
        category: "T-Shirts",
        description: "",
        fabric: "",
        weight: "",
        fit: "",
        price: "",
        hasPackOption: false,
        packPrice: "",
        packLabel: "Pack of 10",
        imageUrl: "",
        images: [],
        designs: [],
        colours: [],
        sizes: [],
        sizeChartUrl: "",
        variantImages: [],
        stock: "100",
        isActive: true,
      });
      setEditingId(null);
      fetchItems();
    } catch {
      toast.error(editingId ? "Failed to update item" : "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const beginEdit = (item: MerchItem) => {
    const imgs =
      item.images && item.images.length
        ? item.images
        : item.imageUrl
        ? [item.imageUrl]
        : [];

    setForm({
      name: item.name,
      productCode: item.productCode || "",
      category: item.category || "T-Shirts",
      description: item.description || "",
      fabric: item.fabric || "",
      weight: item.weight || "",
      fit: item.fit || "",
      price: String(item.price ?? ""),
      hasPackOption: Boolean(item.hasPackOption),
      packPrice: item.packPrice ? String(item.packPrice) : "",
      packLabel: item.packLabel || "Pack of 10",
      imageUrl: imgs[0] || "",
      images: imgs,
      designs: Array.isArray(item.designs) ? item.designs : [],
      colours: Array.isArray(item.colours) ? item.colours : [],
      sizes: Array.isArray(item.sizes) ? item.sizes : [],
      sizeChartUrl: item.sizeChartUrl || "",
      variantImages: Array.isArray(item.variantImages) ? item.variantImages : [],
      stock: String(item.stock ?? 100),
      isActive: item.isActive,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      productCode: "",
      category: "T-Shirts",
      description: "",
      fabric: "",
      weight: "",
      fit: "",
      price: "",
      hasPackOption: false,
      packPrice: "",
      packLabel: "Pack of 10",
      imageUrl: "",
      images: [],
      designs: [],
      colours: [],
      sizes: [],
      sizeChartUrl: "",
      variantImages: [],
      stock: "100",
      isActive: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this merchandise item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/merch/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Item deleted");
      if (editingId === id) cancelEdit();
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
      if (editingId === item._id) {
        setForm((f) => ({ ...f, isActive: !item.isActive }));
      }
      toast.success(item.isActive ? "Item hidden from store" : "Item activated on store");
    } catch {
      toast.error("Failed to update item status");
    }
  };

  const filteredItems =
    filterCategory === "All"
      ? items
      : items.filter((i) => i.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-festival-orange/15 text-festival-orange border border-festival-orange/30">
                Official Merchland Catalog
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Manage Merchandise Catalog</h1>
            <p className="text-muted-foreground text-sm">
              Upload images for each design & colour combination, configure sizes, and manage store visibility.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <Button variant="default" onClick={() => window.open("/merch", "_blank")}>
              View Live Store ↗
            </Button>
          </div>
        </div>

        {/* Quick Catalog Templates / Presets Bar */}
        <div className="mb-6 p-4 rounded-2xl border bg-muted/30">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <Sparkles className="w-4 h-4 text-festival-orange" />
              1-Click Catalog Presets (Hornbill Collection)
            </h3>
            <span className="text-xs text-muted-foreground">Click any preset to auto-fill specs, designs & colours</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATALOG_PRESETS.map((p) => (
              <Button
                key={p.productCode}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-background/80 hover:bg-festival-orange/10 hover:border-festival-orange hover:text-festival-orange transition-all"
                onClick={() => applyPreset(p)}
              >
                + {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Showcase Gallery Section (At least 3 images for each category) */}
        <div className="mb-8 rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-festival-orange/15 text-festival-orange">
                  Storefront Lookbook & Banners
                </span>
                <span className="text-xs text-muted-foreground">At least 3 images per category</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-0.5">
                Category Showcase Gallery
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload or paste at least 3 highlight/banner photos for each category (T-Shirts, Winterwear, Accessories, General).
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className="self-start sm:self-auto text-xs"
            >
              {showCategoryManager ? "Hide Showcase Manager" : "Manage Category Showcase (3+ Images)"}
            </Button>
          </div>

          {showCategoryManager && (
            <div className="space-y-4 pt-1">
              {/* Category Select Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(["T-Shirts", "Winterwear", "Accessories", "General"] as const).map((cat) => {
                  const data = categoryShowcases.find((c) => c.category === cat);
                  const count = data?.images?.length || 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategoryTab(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeCategoryTab === cat
                          ? "bg-festival-orange text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        count >= 3 ? "bg-green-600 text-white" : "bg-black/20 text-foreground"
                      }`}>
                        {count}/3+
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Category 3+ Image Slots */}
              {(() => {
                const currentShowcase = categoryShowcases.find((c) => c.category === activeCategoryTab);
                const imgs = currentShowcase?.images || [];
                const slotsCount = Math.max(3, imgs.length + 1);
                const slotLabels = [
                  "Image 1: Hero Banner / Primary Look",
                  "Image 2: Lookbook / Model Editorial",
                  "Image 3: Collection Grid / Detail Shot",
                  "Image 4: Extra Showcase Angle",
                  "Image 5: Extra Showcase Angle",
                ];

                return (
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {activeCategoryTab} Showcase Images ({imgs.length} uploaded)
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Displayed at the top of the {activeCategoryTab} section in the Merch store.
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={savingCategory}
                        onClick={() => handleSaveCategoryShowcase(activeCategoryTab)}
                        className="bg-festival-orange hover:bg-festival-orange/90 text-white text-xs"
                      >
                        {savingCategory ? "Saving..." : `Save ${activeCategoryTab} Images`}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from({ length: slotsCount }).map((_, slotIdx) => {
                        const imgUrl = imgs[slotIdx] || "";
                        const label = slotLabels[slotIdx] || `Image ${slotIdx + 1}: Extra Angle`;

                        return (
                          <div
                            key={slotIdx}
                            className={`p-3 rounded-xl border flex flex-col justify-between gap-3 bg-background shadow-sm ${
                              imgUrl ? "border-festival-orange/40" : "border-dashed"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground">
                                {label}
                              </span>
                              {imgUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCategorySlot(activeCategoryTab, slotIdx)}
                                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-0.5"
                                  title="Remove image"
                                >
                                  <X className="w-3.5 h-3.5" /> Remove
                                </button>
                              )}
                            </div>

                            {/* Preview box */}
                            {imgUrl ? (
                              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-black/40">
                                <img
                                  src={imgUrl}
                                  alt={`${activeCategoryTab} slot ${slotIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full aspect-[16/9] rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground/60 text-xs p-2 text-center bg-muted/10">
                                <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                <span>No image in this slot</span>
                                <span className="text-[10px] text-muted-foreground mt-0.5">Upload file or paste link below</span>
                              </div>
                            )}

                            {/* Controls */}
                            <div className="space-y-2 pt-1">
                              <div>
                                <Label className="text-[11px] text-muted-foreground">Upload File</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingCategorySlot === slotIdx}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleUploadCategorySlot(activeCategoryTab, slotIdx, file);
                                    }
                                  }}
                                  className="mt-0.5 text-xs h-8"
                                />
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Input
                                  type="url"
                                  placeholder="Or paste image URL"
                                  value={categoryUrlInputs[slotIdx] || ""}
                                  onChange={(e) =>
                                    setCategoryUrlInputs((prev) => ({
                                      ...prev,
                                      [slotIdx]: e.target.value,
                                    }))
                                  }
                                  className="text-xs h-8 flex-1"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs px-2"
                                  onClick={() =>
                                    handleAttachCategoryUrl(
                                      activeCategoryTab,
                                      slotIdx,
                                      categoryUrlInputs[slotIdx] || ""
                                    )
                                  }
                                  disabled={!categoryUrlInputs[slotIdx]?.trim()}
                                >
                                  Attach
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingId ? <Edit className="h-5 w-5 text-festival-blue" /> : <PlusCircle className="h-5 w-5 text-festival-orange" />}
                  {editingId ? "Edit Catalog Item" : "Create Catalog Product"}
                </CardTitle>
                <CardDescription>
                  {editingId
                    ? "Modify product details, design codes, colours, or combination mockups."
                    : "Fill in the details or pick a 1-click preset from above."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-5">
                  {/* Category & Product Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="T-Shirts">01 · T-Shirts</option>
                        <option value="Winterwear">02 · Winterwear</option>
                        <option value="Accessories">03 · Accessories</option>
                        <option value="General">General Merchandise</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="productCode">Product Code / SKU Prefix *</Label>
                      <Input
                        id="productCode"
                        name="productCode"
                        value={form.productCode}
                        onChange={onChange}
                        placeholder="e.g. HBF-RNT, HBF-HD320"
                        className="mt-1 font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="e.g. Classic Round-Neck Tee"
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Base Price (₹) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={onChange}
                        placeholder="535"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Inventory Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={onChange}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Pack / Bundle Pricing (e.g. for badges & stickers) */}
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hasPackOption" className="font-semibold text-xs cursor-pointer flex items-center gap-1.5">
                          <PackageCheck className="w-3.5 h-3.5 text-festival-orange" />
                          Has Pack / Bundle Option? (e.g. Badges & Stickers Pack of 10)
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Allows buyers to choose between single units or discounted packs.
                        </p>
                      </div>
                      <Switch
                        id="hasPackOption"
                        checked={form.hasPackOption}
                        onCheckedChange={(v) =>
                          setForm((f) => ({ ...f, hasPackOption: v }))
                        }
                      />
                    </div>

                    {form.hasPackOption && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <Label htmlFor="packPrice" className="text-xs">Pack Price (₹)</Label>
                          <Input
                            id="packPrice"
                            name="packPrice"
                            type="number"
                            min="0"
                            value={form.packPrice}
                            onChange={onChange}
                            placeholder="470"
                            className="mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="packLabel" className="text-xs">Pack Label</Label>
                          <Input
                            id="packLabel"
                            name="packLabel"
                            value={form.packLabel}
                            onChange={onChange}
                            placeholder="Pack of 10"
                            className="mt-1 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fabric, Weight & Fit Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="fabric" className="text-xs">Fabric / Material</Label>
                      <Input
                        id="fabric"
                        name="fabric"
                        value={form.fabric}
                        onChange={onChange}
                        placeholder="100% cotton, bio-washed"
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-xs">GSM / Specs</Label>
                      <Input
                        id="weight"
                        name="weight"
                        value={form.weight}
                        onChange={onChange}
                        placeholder="180 GSM"
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fit" className="text-xs">Fit Type</Label>
                      <Input
                        id="fit"
                        name="fit"
                        value={form.fit}
                        onChange={onChange}
                        placeholder="Regular, round neck"
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      placeholder="Brief description, care instructions, print placement..."
                      rows={2}
                      className="mt-1 resize-none"
                    />
                  </div>

                  {/* ------------------------------------ */}
                  {/* DESIGNS SECTION */}
                  {/* ------------------------------------ */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-festival-orange" />
                        Print Designs Available ({form.designs.length})
                      </Label>
                      {form.designs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, designs: [] }))}
                          className="text-xs text-muted-foreground hover:text-red-500"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Click standard festival designs or enter custom artwork names:
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {STANDARD_DESIGNS.map((d) => {
                        const isSelected = form.designs.some((cur) => cur.name === d.name);
                        return (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() => toggleStandardDesign(d)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                              isSelected
                                ? "bg-festival-orange text-white border-festival-orange"
                                : "bg-background/80 text-foreground border-border hover:border-festival-orange/50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {d.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        type="text"
                        placeholder="Design Name (e.g. Festival Hornbill)"
                        value={customDesignName}
                        onChange={(e) => setCustomDesignName(e.target.value)}
                        className="text-xs flex-1"
                      />
                      <Input
                        type="text"
                        placeholder="Code (e.g. FEST)"
                        value={customDesignCode}
                        onChange={(e) => setCustomDesignCode(e.target.value)}
                        className="text-xs w-24 font-mono uppercase"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCustomDesign}
                        disabled={!customDesignName.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>

                    {form.designs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                        {form.designs.map((d) => (
                          <span
                            key={d.name}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-festival-orange/15 border border-festival-orange/30 text-festival-orange text-xs font-semibold"
                          >
                            {d.name} {d.code && <span className="text-[10px] opacity-75 font-mono">({d.code})</span>}
                            <button
                              type="button"
                              onClick={() => removeDesign(d.name)}
                              className="hover:text-red-400 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------ */}
                  {/* COLOURS SECTION */}
                  {/* ------------------------------------ */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-400" />
                        Available Colours ({form.colours.length})
                      </Label>
                      {form.colours.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, colours: [] }))}
                          className="text-xs text-muted-foreground hover:text-red-500"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {STANDARD_COLOURS.map((col) => {
                        const isSelected = form.colours.some((c) => c.name === col.name);
                        return (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => toggleStandardColour(col)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-background/80 text-foreground border-border hover:border-purple-400"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: col.hex }}
                            />
                            {col.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={customColourHex}
                        onChange={(e) => setCustomColourHex(e.target.value)}
                        className="w-9 h-9 rounded-md border p-0.5 cursor-pointer bg-background"
                        title="Pick color"
                      />
                      <Input
                        type="text"
                        placeholder="Colour name (e.g. Forest Green)"
                        value={customColourName}
                        onChange={(e) => setCustomColourName(e.target.value)}
                        className="text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCustomColour}
                        disabled={!customColourName.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>

                    {form.colours.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                        {form.colours.map((col) => (
                          <span
                            key={col.name}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border text-xs font-semibold"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: col.hex }}
                            />
                            {col.name}
                            <button
                              type="button"
                              onClick={() => removeColour(col.name)}
                              className="hover:text-red-400 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------ */}
                  {/* DESIGN & COLOUR COMBINATION IMAGES */}
                  {/* (Matches the catalog matrix!) */}
                  {/* ------------------------------------ */}
                  {form.designs.length > 0 && form.colours.length > 0 && (
                    <div className="p-4 rounded-xl border border-festival-orange/40 bg-festival-orange/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                            <Grid className="w-4 h-4 text-festival-orange" />
                            Design & Colour Mockup Images
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Upload specific photos for each combination. When a user clicks a design & colour, this exact photo will appear!
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {form.designs.map((d) => (
                          <div key={d.name} className="border rounded-lg p-2.5 bg-background/70 space-y-2">
                            <div className="text-xs font-bold text-festival-orange flex items-center justify-between">
                              <span>Design: {d.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">Code: {d.code || d.name}</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {form.colours.map((c) => {
                                const variant = getVariantImage(d.name, c.name);
                                const vImgs = variant?.images && variant.images.length > 0
                                  ? variant.images
                                  : (variant?.imageUrl ? [variant.imageUrl] : []);

                                return (
                                  <div
                                    key={`${d.name}-${c.name}`}
                                    className="border rounded-lg p-2 flex flex-col items-center justify-between gap-1.5 bg-muted/20 hover:border-festival-orange/50 transition-all text-center"
                                  >
                                    <div className="flex items-center gap-1 text-[11px] font-medium truncate w-full justify-center">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full border flex-shrink-0"
                                        style={{ backgroundColor: c.hex }}
                                      />
                                      <span className="truncate">{c.name}</span>
                                    </div>

                                    {/* Thumbnail Preview */}
                                    {vImgs.length > 0 ? (
                                      <div className="relative w-16 h-16 rounded-md overflow-hidden border group bg-black/40">
                                        <img
                                          src={vImgs[0]}
                                          alt={`${d.name} ${c.name}`}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white font-bold py-0.5">
                                          {vImgs.length} photo{vImgs.length > 1 ? "s" : ""}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setVariantImagesList(d.name, c.name, [])}
                                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                                          title="Remove all photos"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="w-16 h-16 rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground/60 text-[10px] p-1">
                                        <ImageIcon className="w-4 h-4 mb-0.5" />
                                        <span>No image</span>
                                      </div>
                                    )}

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-[10px] h-6 px-1"
                                      onClick={() => {
                                        setVariantUploadTarget({ design: d.name, colour: c.name });
                                        setVariantUrlInput(vImgs[0] || "");
                                      }}
                                    >
                                      {vImgs.length > 0 ? `Manage (${vImgs.length})` : "+ 3 Images"}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------ */}
                  {/* GENERAL PRODUCT IMAGES (NO LIMIT) */}
                  {/* ------------------------------------ */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-semibold flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4 text-festival-orange" />
                          General Gallery Images ({form.images.length})
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Upload as many product photos as you like. All images are displayed to customers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="flex-1 text-xs"
                      />
                      {uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddImageUrl}
                        disabled={!customImageUrl.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add URL
                      </Button>
                    </div>

                    {form.images.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {form.images.map((url, idx) => (
                          <div key={idx} className="relative group border rounded-lg overflow-hidden w-20 h-20 bg-muted">
                            <img
                              src={url}
                              alt={`Product ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 text-[10px] font-semibold text-center bg-black/75 text-white py-0.5">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------ */}
                  {/* SIZES SECTION */}
                  {/* ------------------------------------ */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-festival-blue" />
                        Available Sizes ({form.sizes.length})
                      </Label>
                      <button
                        type="button"
                        onClick={handleSetApparelSizes}
                        className="text-xs text-festival-orange hover:underline font-medium"
                      >
                        + Apparel (S-XXL)
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {STANDARD_SIZES.map((size) => {
                        const isSelected = form.sizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                              isSelected
                                ? "bg-festival-blue text-white border-festival-blue"
                                : "bg-background/80 text-foreground border-border hover:border-festival-blue/50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        type="text"
                        placeholder="Add custom size (e.g. 3XL, 58mm, 16x14in)"
                        value={customSizeInput}
                        onChange={(e) => setCustomSizeInput(e.target.value)}
                        className="text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCustomSize}
                        disabled={!customSizeInput.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Size
                      </Button>
                    </div>

                    {form.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                        {form.sizes.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-festival-blue/15 border border-festival-blue/30 text-festival-blue text-xs font-semibold"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSize(s)}
                              className="hover:text-red-400 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------ */}
                  {/* SIZE CHART SECTION */}
                  {/* ------------------------------------ */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-green-500" />
                        Size Chart Measurement Table (Optional)
                      </Label>
                      {form.sizeChartUrl && (
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, sizeChartUrl: "" }))}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove Chart
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleSizeChartUpload}
                        disabled={uploadingChart}
                        className="flex-1 text-xs"
                      />
                      {uploadingChart && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="Or paste Size Chart URL (https://...)"
                        value={customSizeChartUrl}
                        onChange={(e) => setCustomSizeChartUrl(e.target.value)}
                        className="text-xs flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddSizeChartUrl}
                        disabled={!customSizeChartUrl.trim()}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Attach
                      </Button>
                    </div>

                    {form.sizeChartUrl && (
                      <div className="relative border rounded-lg p-2 bg-background flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={form.sizeChartUrl}
                            alt="Size Chart"
                            className="w-14 h-14 object-cover rounded border bg-muted cursor-pointer"
                            onClick={() => setPreviewChartModal(form.sizeChartUrl)}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-green-500" /> Size Chart Attached
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                              {form.sizeChartUrl}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => setPreviewChartModal(form.sizeChartUrl)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-red-500 hover:text-red-600"
                            onClick={() => setForm((f) => ({ ...f, sizeChartUrl: "" }))}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Switch */}
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive" className="cursor-pointer font-medium">
                        Live on Store
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        When enabled, visitors will see this product on the public merch page.
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={form.isActive}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, isActive: v }))
                      }
                    />
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={loading || uploading || uploadingChart}
                      className="flex-1 bg-festival-orange hover:bg-festival-orange/90 text-white font-semibold py-2.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingId ? "Updating Catalog..." : "Publishing..."}
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          {editingId ? "Save Catalog Changes" : "Publish to Store"}
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={loading || uploading || uploadingChart}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Catalog Listing Column */}
          <div className="lg:col-span-6">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle>Catalog Products ({items.length})</CardTitle>
                    <CardDescription>
                      Click any item to edit designs, colours, mockups, or sizing.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {["All", "T-Shirts", "Winterwear", "Accessories"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                          filterCategory === cat
                            ? "bg-festival-orange text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16 border border-dashed rounded-xl">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="font-semibold text-muted-foreground">No merchandise products found in this category.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pick a preset from the top bar to quickly add one!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[850px] overflow-y-auto pr-1">
                    {filteredItems.map((item) => {
                      const displayImg =
                        (item.images && item.images.length > 0 ? item.images[0] : item.imageUrl) ||
                        (item.variantImages && item.variantImages.length > 0 ? item.variantImages[0].imageUrl : "") ||
                        "";
                      const isSelected = editingId === item._id;

                      return (
                        <div
                          key={item._id}
                          className={`flex items-start gap-3.5 border rounded-xl p-3.5 transition-all cursor-pointer hover:border-festival-orange/50 hover:bg-accent/30 ${
                            isSelected ? "ring-2 ring-festival-orange border-festival-orange bg-accent/20" : ""
                          }`}
                          onClick={() => beginEdit(item)}
                        >
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border bg-background"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground border">
                              No image
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                {item.productCode && (
                                  <span className="text-[10px] font-mono font-bold text-festival-orange uppercase tracking-wider block">
                                    {item.productCode}
                                  </span>
                                )}
                                <h4 className="font-semibold text-base truncate">{item.name}</h4>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {item.isActive ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                                    Live
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                    Hidden
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-festival-orange">
                                ₹{item.price.toFixed(2)}
                              </span>
                              {item.hasPackOption && item.packPrice && (
                                <span className="text-xs text-muted-foreground">
                                  / {item.packLabel || "Pack"}: ₹{item.packPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {item.category}
                              </span>
                            </div>

                            {/* Combinations count badge */}
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                              {item.variantImages && item.variantImages.length > 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-festival-orange/15 text-festival-orange border border-festival-orange/30 font-medium">
                                  {item.variantImages.length} combination mockups
                                </span>
                              )}

                              {item.images && item.images.length > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {item.images.length} general photos
                                </span>
                              )}

                              {item.designs && item.designs.length > 0 && (
                                <span className="text-muted-foreground text-[11px]">
                                  {item.designs.length} designs
                                </span>
                              )}

                              {item.colours && item.colours.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {item.colours.map((c, i) => (
                                    <span
                                      key={i}
                                      className="w-2.5 h-2.5 rounded-full border border-black/30 inline-block"
                                      style={{ backgroundColor: c.hex }}
                                      title={c.name}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                toggleActive(item);
                              }}
                            >
                              {item.isActive ? "Hide" : "Show"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                handleDelete(item._id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal: Upload Image for (Design + Colour) Combination (At least 3 images) */}
      {variantUploadTarget && (() => {
        const targetVariant = getVariantImage(variantUploadTarget.design, variantUploadTarget.colour);
        const targetImgs = targetVariant?.images && targetVariant.images.length > 0
          ? targetVariant.images
          : (targetVariant?.imageUrl ? [targetVariant.imageUrl] : []);
        const slotsCount = Math.max(3, targetImgs.length + 1);
        const slotLabels = [
          "Slot 1: Front Mockup / Primary View",
          "Slot 2: Back Print / Model View",
          "Slot 3: Detail / Angle Shot",
          "Slot 4: Extra Photo",
          "Slot 5: Extra Photo",
        ];

        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setVariantUploadTarget(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-background rounded-2xl overflow-hidden p-6 border shadow-2xl space-y-4 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-festival-orange/15 text-festival-orange border border-festival-orange/30">
                      Multi-Angle Mockups
                    </span>
                    <span className="text-xs text-muted-foreground">At least 3 images</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mt-0.5">
                    {variantUploadTarget.design} · {variantUploadTarget.colour}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Upload up to 3+ photos for this specific combination. All will be displayed in the carousel & thumbnail bar when customer clicks this design and colour.
                  </p>
                </div>
                <button
                  onClick={() => setVariantUploadTarget(null)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3+ Slots Grid */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {Array.from({ length: slotsCount }).map((_, slotIdx) => {
                  const imgUrl = targetImgs[slotIdx] || "";
                  const label = slotLabels[slotIdx] || `Slot ${slotIdx + 1}: Extra Angle`;

                  return (
                    <div
                      key={slotIdx}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-4 bg-muted/20 ${
                        imgUrl ? "border-festival-orange/40" : "border-dashed"
                      }`}
                    >
                      {/* Thumbnail or placeholder */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden border bg-black/40 flex-shrink-0 flex items-center justify-center">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={`${variantUploadTarget.design} ${variantUploadTarget.colour} slot ${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground/60 text-[10px]">
                            <ImageIcon className="w-5 h-5 mb-0.5 opacity-50" />
                            <span>Empty</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {label}
                          </span>
                          {imgUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveCombinationImage(
                                  variantUploadTarget.design,
                                  variantUploadTarget.colour,
                                  slotIdx
                                )
                              }
                              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                            >
                              <X className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              disabled={uploadingVariant}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadForCombinationSlot(
                                    variantUploadTarget.design,
                                    variantUploadTarget.colour,
                                    slotIdx,
                                    file
                                  );
                                }
                              }}
                              className="text-xs h-8"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Input
                              type="url"
                              placeholder="Or paste image URL"
                              id={`var-url-${slotIdx}`}
                              defaultValue={imgUrl}
                              className="text-xs h-8 flex-1"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs px-2.5"
                              onClick={() => {
                                const el = document.getElementById(`var-url-${slotIdx}`) as HTMLInputElement;
                                if (el && el.value.trim()) {
                                  handleAttachUrlForCombinationSlot(
                                    variantUploadTarget.design,
                                    variantUploadTarget.colour,
                                    slotIdx,
                                    el.value.trim()
                                  );
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {targetImgs.length} / 3+ images uploaded for this combination
                </span>
                <Button
                  type="button"
                  onClick={() => setVariantUploadTarget(null)}
                  className="bg-festival-orange hover:bg-festival-orange/90 text-white text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Size Chart Image Preview Modal in Admin */}
      {previewChartModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewChartModal(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-background rounded-2xl overflow-hidden p-4 border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Ruler className="w-5 h-5 text-festival-blue" /> Size Chart Preview
              </h3>
              <button
                onClick={() => setPreviewChartModal(null)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] flex items-center justify-center">
              <img
                src={previewChartModal}
                alt="Size Chart"
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
