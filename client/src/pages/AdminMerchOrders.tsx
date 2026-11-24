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
    if (!orders.length) {
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

    const rows = orders.map((o) => [
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
    toast.success(`Exported ${orders.length} orders to CSV`);
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
              <CardTitle className="text-2xl font-bold">{stats?.totalOrders ?? orders.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> Paid Orders
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-green-600">
                {stats?.paidOrders ?? orders.filter((o) => o.status === "paid").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-amber-600">
                <Clock className="w-3.5 h-3.5" /> Pending Checkouts
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-amber-600">
                {stats?.pendingOrders ?? orders.filter((o) => o.status === "pending" || o.status === "created").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" /> Failed / Cancelled
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-red-600">
                {stats?.failedOrders ?? orders.filter((o) => o.status === "failed" || o.status === "cancelled").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm col-span-2 md:col-span-1 bg-gradient-to-br from-card to-festival-orange/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-festival-orange font-medium">Total Paid Revenue</CardDescription>
              <CardTitle className="text-2xl font-bold text-festival-orange">
                ₹{((stats?.totalRevenue ?? orders.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total || 0), 0)) || 0).toLocaleString("en-IN")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        {/* Main Orders Table */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Orders List</CardTitle>
                <CardDescription>
                  Showing {orders.length} order{orders.length === 1 ? "" : "s"}
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
            ) : orders.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-semibold text-foreground">No merchandise orders found</p>
                <p className="text-xs mt-1">
                  {statusFilter !== "all" || searchTerm
                    ? "Try clearing filters or search criteria."
                    : "When customers complete checkout on AHIBI, orders will appear here automatically."}
                </p>
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
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

                          <TableCell className="align-top py-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1 text-festival-orange" /> View
                            </Button>
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
    </div>
  );
}
