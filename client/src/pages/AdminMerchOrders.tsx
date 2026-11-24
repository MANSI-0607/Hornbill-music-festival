import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Eye,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Calendar,
  Filter,
  Truck,
  Share2,
  Send,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export interface MerchOrderItem {
  itemId?: string;
  productId?: string;
  name: string;
  sku?: string;
  variant?: string;
  quantity: number;
  price: number;
  taxRate?: number;
  image?: string;
}

export interface MerchOrder {
  _id: string;
  sessionId?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: MerchOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "created" | "pending" | "paid" | "failed" | "cancelled" | "refunded";
  shippingStatus?: "confirmed" | "processing" | "packed" | "shipped" | "out_for_delivery" | "delivered";
  courierName?: string;
  awbNumber?: string;
  trackingUrl?: string;
  shippingRemarks?: string;
  shippedAt?: string;
  deliveredAt?: string;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  payment?: {
    status?: string;
    amount?: number;
    transactionId?: string;
    paymentLinkId?: string;
  };
}

export interface OrderStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  totalRevenue: number;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

const COURIER_OPTIONS = [
  { name: "Delhivery", urlTemplate: "https://www.delhivery.com/track/package/" },
  { name: "Blue Dart", urlTemplate: "https://www.bluedart.com/tracking?track=" },
  { name: "DTDC", urlTemplate: "https://www.dtdc.in/tracking.asp?strCnno=" },
  { name: "India Post", urlTemplate: "https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx" },
  { name: "Speed Post", urlTemplate: "https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx" },
  { name: "Trackon", urlTemplate: "http://trackon.in/Tracking/TrackShipment?awb=" },
  { name: "Shadowfax", urlTemplate: "https://tracker.shadowfax.in/#/track/" },
  { name: "Xpressbees", urlTemplate: "https://www.xpressbees.com/shipment/tracking?awb=" },
  { name: "Other / Hand Delivery", urlTemplate: "" },
];

export default function AdminMerchOrders() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [orders, setOrders] = useState<MerchOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<MerchOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tracking Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState<MerchOrder | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    shippingStatus: "confirmed",
    courierName: "",
    awbNumber: "",
    trackingUrl: "",
    shippingRemarks: "",
  });
  const [savingTracking, setSavingTracking] = useState(false);

  // Default check to show orders made from 24 Nov 2026 onwards
  const [filterFromNov24, setFilterFromNov24] = useState<boolean>(true);

  const isFromNov24 = (createdAt?: string) => {
    if (!createdAt) return false;
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) return false;
    try {
      // Check in Indian Standard Time (Asia/Kolkata)
      const istStr = d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const istDate = new Date(istStr);
      const year = istDate.getFullYear();
      const month = istDate.getMonth(); // 10 is November (0-indexed)
      const day = istDate.getDate();
      if (year > 2026) return true;
      if (year === 2026) {
        if (month > 10) return true;
        if (month === 10 && day >= 24) return true;
      }
      return false;
    } catch {
      // Fallback: 2026-11-23 18:30 UTC is 2026-11-24 00:00 IST
      return d.getTime() >= new Date("2026-11-23T18:30:00Z").getTime();
    }
  };

  const displayedOrders = useMemo(() => {
    if (!filterFromNov24) return orders;
    return orders.filter((o) => isFromNov24(o.createdAt));
  }, [orders, filterFromNov24]);

  const dynamicStats = useMemo(() => {
    if (!filterFromNov24 && stats) return stats;
    const paid = displayedOrders.filter((o) => o.status === "paid");
    const pending = displayedOrders.filter((o) => o.status === "pending" || o.status === "created");
    const failed = displayedOrders.filter((o) => o.status === "failed" || o.status === "cancelled");
    const revenue = paid.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      totalOrders: displayedOrders.length,
      paidOrders: paid.length,
      pendingOrders: pending.length,
      failedOrders: failed.length,
      totalRevenue: revenue,
    };
  }, [displayedOrders, filterFromNov24, stats]);

  const fetchOrders = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const candidateUrls = [
        `${API_BASE_URL}/merch/orders?${params.toString()}`,
        `http://localhost:5000/api/hornbill-merch/orders?${params.toString()}`,
        `https://ahibi.in/api/hornbill-merch/orders?${params.toString()}`,
        `https://api.ahibi.in/api/hornbill-merch/orders?${params.toString()}`,
      ];

      let orderList: MerchOrder[] | null = null;
      let lastErrMsg = "Failed to load orders from AHIBI";

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const payload = await res.json();
            orderList = payload?.data?.orders || payload?.orders || [];
            break;
          }
        } catch {
          // try next candidate
        }
      }

      if (orderList !== null) {
        setOrders(orderList);
        if (isManualRefresh) toast.success("Orders refreshed from AHIBI");
      } else {
        throw new Error(lastErrMsg);
      }
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      setError(err?.message || "Failed to connect to AHIBI merch orders service");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const candidateUrls = [
        `${API_BASE_URL}/merch/orders/stats`,
        `http://localhost:5000/api/hornbill-merch/orders/stats`,
        `https://ahibi.in/api/hornbill-merch/orders/stats`,
        `https://api.ahibi.in/api/hornbill-merch/orders/stats`,
      ];

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const payload = await res.json();
            if (payload?.data) {
              setStats(payload.data);
              break;
            }
          }
        } catch {
          // try next candidate
        }
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    if (!displayedOrders.length) {
      toast.error("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Status",
      "Items Count",
      "Items Details",
      "Total Amount (INR)",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "PIN",
      "Country",
    ];

    const rows = displayedOrders.map((o) => [
      `"${o._id}"`,
      `"${new Date(o.createdAt).toLocaleString("en-IN")}"`,
      `"${(o.shippingAddress?.fullName || o.user?.name || "Guest").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.phone || o.user?.phone || "").replace(/"/g, '""')}"`,
      `"${(o.user?.email || "").replace(/"/g, '""')}"`,
      `"${o.status.toUpperCase()}"`,
      o.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0,
      `"${(o.items || [])
        .map((i) => `${i.name} [${i.variant || i.sku || "Std"}] x${i.quantity} (Rs.${i.price})`)
        .join("; ")
        .replace(/"/g, '""')}"`,
      o.total,
      `"${(o.shippingAddress?.addressLine1 || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.addressLine2 || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.city || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.state || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.postalCode || "").replace(/"/g, '""')}"`,
      `"${(o.shippingAddress?.country || "India").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hornbill-ahibi-merch-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${displayedOrders.length} orders to CSV`);
  };

  const getTrackingLink = (orderId: string) => `https://hornbillmusicfestival.com/track/${orderId}`;

  const openTrackingModal = (order: MerchOrder) => {
    setTrackingModalOrder(order);
    setTrackingForm({
      shippingStatus: order.shippingStatus || "confirmed",
      courierName: order.courierName || "",
      awbNumber: order.awbNumber || "",
      trackingUrl: order.trackingUrl || "",
      shippingRemarks: order.shippingRemarks || "",
    });
  };

  const handleCourierChange = (courierName: string) => {
    const selected = COURIER_OPTIONS.find((c) => c.name === courierName);
    let autoUrl = trackingForm.trackingUrl;
    if (selected && selected.urlTemplate && trackingForm.awbNumber) {
      autoUrl = selected.urlTemplate + trackingForm.awbNumber.trim();
    }
    setTrackingForm((prev) => ({
      ...prev,
      courierName,
      trackingUrl: autoUrl,
    }));
  };

  const handleAwbChange = (awb: string) => {
    const selected = COURIER_OPTIONS.find((c) => c.name === trackingForm.courierName);
    let autoUrl = trackingForm.trackingUrl;
    if (selected && selected.urlTemplate && awb.trim()) {
      autoUrl = selected.urlTemplate + awb.trim();
    }
    setTrackingForm((prev) => ({
      ...prev,
      awbNumber: awb,
      trackingUrl: autoUrl,
    }));
  };

  const handleSaveTracking = async () => {
    if (!trackingModalOrder) return;
    try {
      setSavingTracking(true);
      const res = await fetch(`${API_BASE_URL}/merch/orders/${trackingModalOrder._id}/tracking`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trackingForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update tracking");
      }
      toast.success("Shipping & tracking details updated!");
      const updatedOrderData = data.order || data.data;
      // Update in orders list
      setOrders((prev) =>
        prev.map((o) =>
          o._id === trackingModalOrder._id
            ? {
                ...o,
                ...trackingForm,
                shippingStatus: trackingForm.shippingStatus as any,
                shippedAt: updatedOrderData?.shippedAt || o.shippedAt,
                deliveredAt: updatedOrderData?.deliveredAt || o.deliveredAt,
              }
            : o
        )
      );
      if (selectedOrder && selectedOrder._id === trackingModalOrder._id) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                ...trackingForm,
                shippingStatus: trackingForm.shippingStatus as any,
                shippedAt: updatedOrderData?.shippedAt || prev.shippedAt,
                deliveredAt: updatedOrderData?.deliveredAt || prev.deliveredAt,
              }
            : null
        );
      }
      setTrackingModalOrder(null);
    } catch (err: any) {
      console.error("Save tracking error:", err);
      toast.error(err.message || "Could not save tracking details");
    } finally {
      setSavingTracking(false);
    }
  };

  const shareTrackingWhatsApp = (order: MerchOrder) => {
    const phone = order.shippingAddress?.phone || order.user?.phone || "";
    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const trackLink = getTrackingLink(order._id);
    const statusText = (order.shippingStatus || "confirmed").replace(/_/g, " ").toUpperCase();
    const courierInfo = order.awbNumber ? `\nCourier: ${order.courierName || "Courier"} (AWB: ${order.awbNumber})` : "";
    const msg = `Hi ${order.shippingAddress?.fullName || "there"}!\n\nHere is your Hornbill Music Festival Official Merch Order tracking link:\n${trackLink}\n\nStatus: ${statusText}${courierInfo}\n\nYou can view live packing and shipping updates anytime using this link!`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const shippingStatusBadge = (status?: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[11px] font-medium">
            <Check className="w-3 h-3 mr-1" /> Delivered
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge className="bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 text-[11px] font-medium">
            <Truck className="w-3 h-3 mr-1" /> Out for Delivery
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-500/15 text-blue-600 border border-blue-500/30 text-[11px] font-medium">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "packed":
        return (
          <Badge className="bg-purple-500/15 text-purple-600 border border-purple-500/30 text-[11px] font-medium">
            <Package className="w-3 h-3 mr-1" /> Packed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[11px] font-medium">
            <Clock className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "confirmed":
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] font-medium">
            Confirmed
          </Badge>
        );
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 hover:bg-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> PAID
          </Badge>
        );
      case "pending":
      case "created":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> PENDING
          </Badge>
        );
      case "failed":
      case "cancelled":
        return (
          <Badge className="bg-red-500/15 text-red-600 border border-red-500/30 hover:bg-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" /> FAILED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-festival-orange/15 text-festival-orange border border-festival-orange/30">
                AHIBI Checkout Integration
              </span>
              <span className="text-xs text-muted-foreground font-mono">Live Sync</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-1 flex items-center gap-2.5">
              <ShoppingBag className="w-8 h-8 text-festival-orange" />
              Merch Orders & Payments
            </h1>

          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => fetchOrders(true)} disabled={refreshing || loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportCSV} disabled={!orders.length}>
              <Download className="h-4 w-4 mr-2 text-festival-orange" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/merch")}>
              <Package className="h-4 w-4 mr-2" /> Catalog
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Orders</CardDescription>
              <CardTitle className="text-2xl font-bold">{dynamicStats.totalOrders}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Paid Orders
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-green-600">
                {dynamicStats.paidOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-amber-600">
                <Clock className="w-3.5 h-3.5" /> Pending Checkouts
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-amber-600">
                {dynamicStats.pendingOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" /> Failed / Cancelled
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-red-600">
                {dynamicStats.failedOrders}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm col-span-2 md:col-span-1 bg-gradient-to-br from-card to-festival-orange/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-festival-orange font-medium">Total Paid Revenue</CardDescription>
              <CardTitle className="text-2xl font-bold text-festival-orange">
                ₹{dynamicStats.totalRevenue.toLocaleString("en-IN")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { label: "All Orders", value: "all" },
                  { label: "Paid", value: "paid" },
                  { label: "Pending", value: "pending" },
                  { label: "Failed", value: "failed" },
                ].map((tab) => (
                  <Button
                    key={tab.value}
                    variant={statusFilter === tab.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(tab.value)}
                    className="text-xs h-8"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer, phone, email, or session..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-xs h-9"
                  />
                </div>
                <Button type="submit" size="sm" className="h-9 text-xs">
                  Search
                </Button>
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => {
                      setSearchTerm("");
                      setTimeout(() => fetchOrders(), 0);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </form>
            </div>

            {/* Date Filter Checkbox & Quick Info */}
            <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="nov24Filter"
                  checked={filterFromNov24}
                  onChange={(e) => setFilterFromNov24(e.target.checked)}
                  className="w-4 h-4 rounded text-festival-orange accent-festival-orange cursor-pointer"
                />
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-festival-orange" />
                  Show only orders made from 24 Nov 2026 onwards
                </span>
                <Badge
                  variant="outline"
                  className={
                    filterFromNov24
                      ? "text-[10px] py-0 px-1.5 text-festival-orange border-festival-orange/40 bg-festival-orange/10"
                      : "text-[10px] py-0 px-1.5 text-muted-foreground"
                  }
                >
                  {filterFromNov24 ? "Default Active" : "Showing All Dates"}
                </Badge>
              </label>

              <div className="text-muted-foreground">
                Showing <strong className="text-foreground">{displayedOrders.length}</strong> of{" "}
                <strong className="text-foreground">{orders.length}</strong> total orders
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Orders Table */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Orders List</CardTitle>
                <CardDescription>
                  Showing {displayedOrders.length} order{displayedOrders.length === 1 ? "" : "s"}
                  {filterFromNov24 && orders.length !== displayedOrders.length && (
                    <span className="text-muted-foreground ml-1">
                      (filtered from {orders.length} total across all dates)
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-festival-orange" />
                <p className="text-sm">Fetching merch orders from AHIBI backend...</p>
              </div>
            ) : error ? (
              <div className="py-12 flex flex-col items-center justify-center text-center p-6 border rounded-xl bg-destructive/5 border-destructive/20">
                <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                <p className="font-semibold text-foreground">Could not load orders</p>
                <p className="text-sm text-muted-foreground max-w-md mt-1">{error}</p>
                <Button variant="outline" size="sm" onClick={() => fetchOrders(true)} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : displayedOrders.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-semibold text-foreground">No merchandise orders found</p>
                <p className="text-xs mt-1 max-w-sm">
                  {orders.length > 0 && filterFromNov24
                    ? "No orders found from 24 Nov 2026 onwards. Uncheck the 24 Nov filter above to view earlier orders."
                    : statusFilter !== "all" || searchTerm
                    ? "Try clearing filters or search criteria."
                    : "When customers complete checkout on AHIBI, orders will appear here automatically."}
                </p>
                {orders.length > 0 && filterFromNov24 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterFromNov24(false)}
                    className="mt-3 text-xs"
                  >
                    View all {orders.length} orders across all dates
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID & Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Shipping / Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedOrders.map((order) => {
                      const customerName = order.shippingAddress?.fullName || order.user?.name || "Customer";
                      const customerPhone = order.shippingAddress?.phone || order.user?.phone || "";
                      const customerCity = order.shippingAddress?.city || "";
                      const totalQty = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

                      return (
                        <TableRow key={order._id} className="hover:bg-muted/30">
                          <TableCell className="align-top py-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-semibold text-foreground">
                                  #{order._id.slice(-6).toUpperCase()}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(order._id, order._id)}
                                  className="text-muted-foreground hover:text-foreground"
                                  title="Copy full ID"
                                >
                                  {copiedId === order._id ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3.5">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-sm leading-tight">{customerName}</p>
                              {customerPhone && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3 opacity-70" /> {customerPhone}
                                </p>
                              )}
                              {customerCity && (
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3 opacity-70" /> {customerCity}
                                  {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ""}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3.5">
                            <div className="space-y-1.5 max-w-xs">
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {totalQty} item{totalQty === 1 ? "" : "s"}
                              </span>
                              <div className="space-y-1 mt-1">
                                {order.items?.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt=""
                                        className="w-6 h-6 rounded object-cover border shrink-0 bg-background"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded bg-muted shrink-0" />
                                    )}
                                    <span className="truncate max-w-[180px] font-medium">{item.name}</span>
                                    <span className="text-muted-foreground text-[11px]">×{item.quantity}</span>
                                  </div>
                                ))}
                                {order.items && order.items.length > 2 && (
                                  <p className="text-[10px] text-muted-foreground">
                                    +{order.items.length - 2} more item(s)...
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3.5">
                            <p className="text-base font-bold text-foreground">
                              ₹{(order.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Subtotal: ₹{(order.subtotal || 0).toFixed(0)}
                            </p>
                          </TableCell>

                          <TableCell className="align-top py-3.5">{statusBadge(order.status)}</TableCell>

                          <TableCell className="align-top py-3.5">
                            <div className="space-y-1">
                              {shippingStatusBadge(order.shippingStatus)}
                              {order.awbNumber && (
                                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-festival-orange shrink-0" />
                                  <span className="truncate max-w-[130px]" title={`${order.courierName || 'Courier'}: ${order.awbNumber}`}>
                                    {order.courierName ? `${order.courierName}: ` : ''}{order.awbNumber}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <Button
                                variant="default"
                                size="sm"
                                className="text-xs h-8 bg-festival-orange hover:bg-festival-orange/90 text-white font-medium"
                                onClick={() => openTrackingModal(order)}
                                title="Manage shipping, AWB and remarks"
                              >
                                <Truck className="h-3.5 w-3.5 mr-1" /> Ship / Track
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1 text-festival-orange" /> View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  const link = getTrackingLink(order._id);
                                  copyToClipboard(link, `track-${order._id}`);
                                  toast.success("Customer tracking link copied!");
                                }}
                                title="Copy Customer Tracking Link"
                              >
                                {copiedId === `track-${order._id}` ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Share2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => shareTrackingWhatsApp(order)}
                                title="Send Tracking Link via WhatsApp"
                              >
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div>
              <DialogHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </DialogTitle>
                    {statusBadge(selectedOrder.status)}
                  </div>
                </div>
                <DialogDescription className="text-xs">
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  via AHIBI Checkout
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Customer & Shipping Details */}
                <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-festival-orange" />
                      Shipping Details
                    </h4>
                    {selectedOrder.shippingAddress && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          const a = selectedOrder.shippingAddress!;
                          const text = `${a.fullName}\n${a.phone}\n${a.addressLine1}${a.addressLine2 ? `\n${a.addressLine2}` : ""
                            }\n${a.city}, ${a.state} - ${a.postalCode}\n${a.country}`;
                          copyToClipboard(text, "shipping-copy");
                        }}
                      >
                        {copiedId === "shipping-copy" ? (
                          <Check className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        Copy Address
                      </Button>
                    )}
                  </div>

                  {selectedOrder.shippingAddress ? (
                    <div className="text-xs space-y-1 text-foreground/90">
                      <p className="font-bold text-sm text-foreground">
                        {selectedOrder.shippingAddress.fullName}
                      </p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" /> {selectedOrder.shippingAddress.phone}
                      </p>
                      {selectedOrder.user?.email && (
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {selectedOrder.user.email}
                        </p>
                      )}
                      <p className="pt-1">
                        {selectedOrder.shippingAddress.addressLine1}
                        {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                      </p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} —{" "}
                        <span className="font-semibold">{selectedOrder.shippingAddress.postalCode}</span>
                      </p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No shipping address recorded</p>
                  )}
                </div>

                {/* Items Ordered */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-festival-orange" />
                    Items Ordered ({selectedOrder.items?.length || 0})
                  </h4>

                  <div className="space-y-2.5">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 rounded-lg border bg-card hover:bg-muted/10 transition"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border shrink-0 bg-background"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-muted shrink-0 flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm truncate">{item.name}</h5>
                          {item.variant && (
                            <p className="text-xs text-festival-orange font-medium mt-0.5">
                              {item.variant}
                            </p>
                          )}
                          {item.sku && (
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                              SKU: {item.sku}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-sm">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Delivery Tracking Card */}
                <div className="rounded-xl border p-4 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-festival-orange" />
                      Delivery & Tracking
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          const link = getTrackingLink(selectedOrder._id);
                          copyToClipboard(link, "details-track-copy");
                          toast.success("Tracking link copied!");
                        }}
                      >
                        {copiedId === "details-track-copy" ? (
                          <Check className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <Share2 className="h-3 w-3 mr-1" />
                        )}
                        Copy Tracking Link
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs h-7 bg-festival-orange hover:bg-festival-orange/90 text-white"
                        onClick={() => openTrackingModal(selectedOrder)}
                      >
                        <Truck className="h-3 w-3 mr-1" /> Update Status / AWB
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Current Status:</span>
                      <div className="mt-1">{shippingStatusBadge(selectedOrder.shippingStatus)}</div>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">Courier & AWB:</span>
                      <p className="mt-1 font-mono font-medium">
                        {selectedOrder.awbNumber ? (
                          <>
                            {selectedOrder.courierName || "Courier"}:{" "}
                            <span className="text-foreground">{selectedOrder.awbNumber}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground italic">Not assigned yet</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.trackingUrl && (
                    <div className="text-xs pt-1">
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-festival-orange hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Track on {selectedOrder.courierName || "carrier"} website
                      </a>
                    </div>
                  )}

                  {selectedOrder.shippingRemarks && (
                    <div className="text-xs p-2.5 rounded-lg bg-background/60 border text-foreground/90">
                      <span className="text-muted-foreground font-semibold block text-[10px] uppercase">Remarks for Customer:</span>
                      <p className="mt-0.5">{selectedOrder.shippingRemarks}</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t text-xs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-festival-orange hover:text-festival-orange"
                      onClick={() => window.open(`/track/${selectedOrder._id}`, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Open Public Tracking Page
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-green-600 hover:text-green-700"
                      onClick={() => shareTrackingWhatsApp(selectedOrder)}
                    >
                      <Send className="h-3 w-3 mr-1" /> WhatsApp Customer
                    </Button>
                  </div>
                </div>

                {/* Payment & Financial Breakdown */}
                <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                  <h4 className="font-semibold text-sm">Payment Breakdown</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST / Tax</span>
                      <span>₹{(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {selectedOrder.shipping === 0 ? "Free / Pre-dispatch" : `₹${selectedOrder.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-sm">
                      <span>Total Amount</span>
                      <span className="text-festival-orange">
                        ₹{(selectedOrder.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.sessionId && (
                    <div className="pt-2 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/50">
                      <span>Linked Cart Session:</span>
                      <span className="font-mono">{selectedOrder.sessionId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking & Shipping Management Dialog */}
      <Dialog
        open={!!trackingModalOrder}
        onOpenChange={(open) => !open && setTrackingModalOrder(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {trackingModalOrder && (
            <div>
              <DialogHeader className="pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-festival-orange/10 text-festival-orange">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">
                      Manage Delivery & Tracking
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Order #{trackingModalOrder._id.slice(-8).toUpperCase()} •{" "}
                      {trackingModalOrder.shippingAddress?.fullName ||
                        trackingModalOrder.user?.name ||
                        "Customer"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Shareable Link Banner */}
                <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Public Customer Tracking Link
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-green-600 border-green-500/30 bg-green-500/10"
                    >
                      No Login Required
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={getTrackingLink(trackingModalOrder._id)}
                      className="font-mono text-xs bg-background h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs shrink-0"
                      onClick={() => {
                        const link = getTrackingLink(trackingModalOrder._id);
                        copyToClipboard(link, "modal-track-link");
                        toast.success("Tracking link copied to clipboard!");
                      }}
                    >
                      {copiedId === "modal-track-link" ? (
                        <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1" />
                      )}
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => shareTrackingWhatsApp(trackingModalOrder)}
                      title="Share link to customer via WhatsApp"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" /> WhatsApp
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Customers can open this link to track delivery status, courier AWB, and your notes in real-time.
                  </p>
                </div>

                {/* Form fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Delivery / Shipping Status
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:ring-2 focus:ring-festival-orange"
                      value={trackingForm.shippingStatus}
                      onChange={(e) =>
                        setTrackingForm((prev) => ({ ...prev, shippingStatus: e.target.value }))
                      }
                    >
                      <option value="confirmed">Confirmed (Order received, awaiting processing)</option>
                      <option value="processing">Processing (Preparing & verifying items)</option>
                      <option value="packed">Packed (Packed & ready for courier dispatch)</option>
                      <option value="shipped">Shipped (Handed over to courier partner)</option>
                      <option value="out_for_delivery">Out for Delivery (Reaching customer today)</option>
                      <option value="delivered">Delivered (Successfully delivered)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        Courier Partner
                      </label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs focus:ring-2 focus:ring-festival-orange"
                        value={trackingForm.courierName}
                        onChange={(e) => handleCourierChange(e.target.value)}
                      >
                        <option value="">Select Courier...</option>
                        {COURIER_OPTIONS.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        AWB / Tracking Number
                      </label>
                      <Input
                        placeholder="e.g. 143256789012"
                        value={trackingForm.awbNumber}
                        onChange={(e) => handleAwbChange(e.target.value)}
                        className="text-xs h-9 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Direct Carrier Tracking URL (Optional)
                    </label>
                    <Input
                      placeholder="https://www.delhivery.com/track/package/..."
                      value={trackingForm.trackingUrl}
                      onChange={(e) =>
                        setTrackingForm((prev) => ({ ...prev, trackingUrl: e.target.value }))
                      }
                      className="text-xs h-9"
                    />
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      Auto-filled when selecting a popular courier partner and entering an AWB.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Shipping Remarks / Updates for Customer
                    </label>
                    <Textarea
                      placeholder="e.g. Dispatched via Delhivery Surface. Expected delivery in 3-4 working days."
                      value={trackingForm.shippingRemarks}
                      onChange={(e) =>
                        setTrackingForm((prev) => ({ ...prev, shippingRemarks: e.target.value }))
                      }
                      rows={3}
                      className="text-xs resize-none"
                    />
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      This note will be visible to the customer on their live tracking link.
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setTrackingModalOrder(null)}
                    disabled={savingTracking}
                  >
                    Cancel
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="text-xs bg-festival-orange hover:bg-festival-orange/90 text-white flex items-center gap-1.5 font-medium"
                      onClick={handleSaveTracking}
                      disabled={savingTracking}
                    >
                      {savingTracking ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Save Tracking Updates
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
