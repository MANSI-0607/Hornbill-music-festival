import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  Phone,
  MessageCircle,
  Share2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface TrackingItem {
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
  sku?: string;
}

interface TrackingData {
  _id: string;
  orderId: string;
  status: string;
  shippingStatus: "confirmed" | "processing" | "packed" | "shipped" | "out_for_delivery" | "delivered";
  courierName?: string;
  awbNumber?: string;
  trackingUrl?: string;
  shippingRemarks?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: TrackingItem[];
  shippingAddress?: {
    fullName: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
}

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

const STEPS = [
  { key: "confirmed", label: "Order Confirmed", desc: "Order details verified & scheduled" },
  { key: "processing", label: "Processing & Packing", desc: "Items picked and packaged" },
  { key: "shipped", label: "Shipped", desc: "Handed over to delivery partner" },
  { key: "out_for_delivery", label: "Out for Delivery", desc: "Package out for delivery today" },
  { key: "delivered", label: "Delivered", desc: "Package safely delivered" },
];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTracking = async (isManualRefresh = false) => {
    if (!orderId) {
      setError("No Order ID provided in tracking link");
      setLoading(false);
      return;
    }

    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/merch/track/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      const trackingData = data.order || data.data;

      if (!res.ok || !data.success || !trackingData) {
        throw new Error(data.message || "Order not found or tracking is unavailable");
      }

      setOrder(trackingData);
      if (isManualRefresh) {
        toast.success("Tracking status updated!");
      }
    } catch (err: any) {
      console.error("Failed to load tracking:", err);
      setError(err.message || "Could not load tracking information");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [orderId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStepIndex = (status?: string) => {
    switch (status) {
      case "delivered":
        return 4;
      case "out_for_delivery":
        return 3;
      case "shipped":
        return 2;
      case "packed":
      case "processing":
        return 1;
      case "confirmed":
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(order?.shippingStatus);

  const shareViaWhatsApp = () => {
    if (!order) return;
    const url = window.location.href;
    const msg = `Hornbill Festival Merch Order Tracking\nOrder #${order._id.slice(-6).toUpperCase()}\nStatus: ${(order.shippingStatus || "confirmed").replace(/_/g, " ").toUpperCase()}\n\nTrack package here: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0d1512] text-[#ebe6d9] pb-24 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/merch"
            className="inline-flex items-center gap-1.5 text-xs text-[#ebe6d9]/70 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Official Merch
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchTracking(true)}
            disabled={refreshing || loading}
            className="text-xs text-[#ebe6d9]/80 hover:text-white hover:bg-white/10 h-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin text-festival-orange" : ""}`} />
            {refreshing ? "Checking..." : "Refresh Status"}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-festival-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#ebe6d9]/70">Retrieving official dispatch & tracking details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card className="bg-[#14231b] border-red-500/30 p-8 text-center my-8 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Tracking Not Found</h2>
            <p className="text-sm text-[#ebe6d9]/70 max-w-md mx-auto mb-6">
              {error}. Please check the tracking link or contact our merchandise team for assistance.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTracking()}
                className="text-xs border-white/20 text-white hover:bg-white/10"
              >
                Try Again
              </Button>
              <a
                href="https://wa.me/918794696995?text=Hi%2C%20I%20need%20help%20tracking%20my%20Hornbill%20Festival%20merchandise%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Support
              </a>
            </div>
          </Card>
        )}

        {/* Active Tracking Content */}
        {!loading && !error && order && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-2xl border border-white/10 bg-[#16271e] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-festival-orange/10 blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-festival-orange/20 text-festival-orange border border-festival-orange/30">
                      Official Hornbill Merch
                    </span>
                    <span className="text-xs text-[#ebe6d9]/60 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Verified Order
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-righteous">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h1>
                  <p className="text-xs text-[#ebe6d9]/70 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-white/15 bg-white/5 text-[#ebe6d9] hover:bg-white/10 hover:text-white h-9"
                    onClick={() => copyToClipboard(window.location.href, "page-share-link")}
                  >
                    {copiedId === "page-share-link" ? (
                      <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 h-9"
                    onClick={shareViaWhatsApp}
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                  </Button>
                </div>
              </div>

              {/* Delivery Stepper */}
              <div className="pt-8 pb-4">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 sm:left-8 sm:right-8 h-1 bg-white/10 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-festival-orange to-green-500 transition-all duration-700 rounded-full"
                      style={{
                        width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Stepper Dots */}
                  <div className="relative flex justify-between items-start">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[120px]">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                              isCompleted
                                ? "bg-festival-orange border-festival-orange text-white shadow-lg shadow-festival-orange/30"
                                : "bg-[#14231b] border-white/20 text-[#ebe6d9]/40"
                            } ${isCurrent ? "ring-4 ring-festival-orange/20 scale-110" : ""}`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs mt-2.5 font-medium leading-tight ${
                              isCurrent
                                ? "text-festival-orange font-bold"
                                : isCompleted
                                ? "text-white"
                                : "text-[#ebe6d9]/40"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="hidden sm:block text-[10px] text-[#ebe6d9]/50 mt-0.5 leading-snug">
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Courier / Shipping Details Card */}
            <div className="rounded-2xl border border-white/10 bg-[#16271e] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-festival-orange/15 text-festival-orange">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">Courier & Dispatch Details</h3>
                    <p className="text-xs text-[#ebe6d9]/60">Live fulfillment status from merchandise team</p>
                  </div>
                </div>

                <Badge
                  className={`text-xs font-semibold px-3 py-1 uppercase tracking-wider ${
                    order.shippingStatus === "delivered"
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : order.shippingStatus === "shipped" || order.shippingStatus === "out_for_delivery"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {order.shippingStatus.replace(/_/g, " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Courier Partner */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#ebe6d9]/60 block text-[11px] mb-1">Courier Partner</span>
                  <p className="text-sm font-semibold text-white">
                    {order.courierName || "To be assigned upon dispatch"}
                  </p>
                </div>

                {/* AWB Number */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[#ebe6d9]/60 block text-[11px] mb-1">AWB / Tracking Number</span>
                    <p className="text-sm font-mono font-bold text-white">
                      {order.awbNumber || "Generating upon handover..."}
                    </p>
                  </div>
                  {order.awbNumber && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-[#ebe6d9]/80 hover:text-white hover:bg-white/10"
                      onClick={() => copyToClipboard(order.awbNumber!, "awb-copy")}
                    >
                      {copiedId === "awb-copy" ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Direct Carrier Tracking Link */}
              {order.trackingUrl && (
                <div className="pt-1">
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 p-3 rounded-xl bg-festival-orange text-white text-xs font-semibold hover:bg-festival-orange/90 transition shadow-md"
                  >
                    <span>Track on {order.courierName || "Courier"} Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Merch Team Remarks */}
              {order.shippingRemarks && (
                <div className="p-4 rounded-xl bg-festival-orange/10 border border-festival-orange/20 text-xs space-y-1">
                  <span className="text-festival-orange font-bold uppercase tracking-wider text-[10px] block">
                    Update from Merchandise Team
                  </span>
                  <p className="text-white/90 leading-relaxed">{order.shippingRemarks}</p>
                </div>
              )}
            </div>

            {/* Two-Column Grid: Delivery Address & Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div className="rounded-2xl border border-white/10 bg-[#16271e] p-6 space-y-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                  <MapPin className="w-4 h-4 text-festival-orange" /> Delivery Address
                </h3>
                {order.shippingAddress ? (
                  <div className="text-xs text-[#ebe6d9]/80 space-y-1">
                    <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                      <span className="font-semibold text-white">{order.shippingAddress.postalCode}</span>
                    </p>
                    <p className="text-[#ebe6d9]/60">{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#ebe6d9]/50">Delivery address details not recorded</p>
                )}
              </div>

              {/* Customer Support & Assistance */}
              <div className="rounded-2xl border border-white/10 bg-[#16271e] p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-3">
                    <MessageCircle className="w-4 h-4 text-festival-orange" /> Need Assistance?
                  </h3>
                  <p className="text-xs text-[#ebe6d9]/70 mt-3 leading-relaxed">
                    Have questions about sizing, delivery updates, or festival pickup? Reach out to the TaFMA official merchandise desk directly.
                  </p>
                </div>

                <a
                  href={`https://wa.me/918794696995?text=Hi%2C%20I%20have%20an%20inquiry%20regarding%20my%20Hornbill%20Festival%20merchandise%20order%20%23${order._id.slice(-6).toUpperCase()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 text-xs font-semibold transition"
                >
                  <MessageCircle className="w-4 h-4" /> Message Support on WhatsApp
                </a>
              </div>
            </div>

            {/* Items in Order */}
            <div className="rounded-2xl border border-white/10 bg-[#16271e] p-6 space-y-4">
              <h3 className="font-semibold text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
                <ShoppingBag className="w-4 h-4 text-festival-orange" /> Items in this Order ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-white/5 space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 pt-3 first:pt-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 bg-[#1b2c23] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-[#ebe6d9]/40" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-white text-sm truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-festival-orange text-xs font-medium mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-[#ebe6d9]/60 text-xs mt-1">
                        Quantity: <span className="font-semibold text-white">{item.quantity}</span> × ₹{item.price}
                      </p>
                    </div>

                    <div className="text-right text-sm font-bold text-white">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#ebe6d9]/70">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#ebe6d9]/70">
                  <span>GST / Tax</span>
                  <span>₹{(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#ebe6d9]/70">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free / Included" : `₹${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-base font-extrabold text-white">
                  <span>Total Paid</span>
                  <span className="text-festival-orange">₹{(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
