import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  MessageCircle,
  Share2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { key: "confirmed", label: "Confirmed", desc: "We have your order and are getting it ready." },
  { key: "processing", label: "Packing", desc: "Your items are being picked and packed." },
  { key: "shipped", label: "Shipped", desc: "Handed to the courier." },
  { key: "out_for_delivery", label: "Out for delivery", desc: "Arriving today." },
  { key: "delivered", label: "Delivered", desc: "Your order has arrived." },
];

/* Shared look: forest page, slightly lighter panels with a visible edge, one orange accent */
const panel = "rounded-lg border border-[#ebe6d9]/15 bg-[#1b2c23]/70";
const muted = "text-[#ebe6d9]/60";
const outlineBtn =
  "h-9 border-[#ebe6d9]/25 bg-transparent text-[#ebe6d9] hover:bg-white/10 hover:text-white";

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
  const resolvedOrderId = String(order?.orderId || order?._id || orderId || "");

  const shareViaWhatsApp = () => {
    if (!order) return;
    const url = window.location.href;
    const msg = `Hornbill Festival Merch Order Tracking\nOrder #${resolvedOrderId.slice(-6).toUpperCase()}\nStatus: ${(order.shippingStatus || "confirmed").replace(/_/g, " ").toUpperCase()}\n\nTrack package here: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#13201a] text-[#ebe6d9] pb-24 pt-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/merch" className={`inline-flex items-center gap-1.5 text-sm ${muted} hover:text-white`}>
            <ArrowLeft className="h-4 w-4" /> Merch
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTracking(true)}
            disabled={refreshing || loading}
            className={outlineBtn}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Checking" : "Refresh"}
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-6" aria-busy="true" aria-label="Loading your order">
            <div className="h-24 w-2/3 animate-pulse rounded-lg bg-[#1b2c23]" />
            <div className="h-64 animate-pulse rounded-lg bg-[#1b2c23]" />
            <div className="h-40 animate-pulse rounded-lg bg-[#1b2c23]" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className={`${panel} mx-auto max-w-lg p-6 sm:p-8`}>
            <AlertCircle className="mb-3 h-6 w-6 text-festival-orange" />
            <h2 className="font-righteous text-2xl">We couldn't find this order</h2>
            <p className={`mt-2 text-sm ${muted}`}>
              {error}. Check the link, or message us and we'll look into it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => fetchTracking()} className="h-10 bg-festival-orange text-white hover:bg-festival-orange/90">
                Try again
              </Button>
              <a
                href="https://wa.me/917003195644?text=Hi%2C%20I%20need%20help%20tracking%20my%20Hornbill%20Festival%20merchandise%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#ebe6d9]/25 px-4 text-sm font-medium hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </div>
          </div>
        )}

        {/* Order */}
        {!loading && !error && order && (
          <div className="space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={`text-sm ${muted}`}>Hornbill Festival merchandise</p>
                <h1 className="mt-1 font-righteous text-3xl sm:text-4xl">
                  Order #{resolvedOrderId.slice(-6).toUpperCase()}
                </h1>
                <p className={`mt-1 text-sm ${muted}`}>
                  Placed{" "}
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={outlineBtn}
                  onClick={() => copyToClipboard(window.location.href, "page-share-link")}
                >
                  {copiedId === "page-share-link" ? (
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                  ) : (
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {copiedId === "page-share-link" ? "Copied" : "Copy link"}
                </Button>
                <Button variant="outline" size="sm" className={outlineBtn} onClick={shareViaWhatsApp}>
                  <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-6">
                {/* Status + timeline */}
                <section className={`${panel} p-5 sm:p-6`}>
                  <p className={`text-sm ${muted}`}>Status</p>
                  <h2 className="mt-0.5 font-righteous text-2xl sm:text-3xl" role="status">
                    {STEPS[currentStepIndex].label}
                  </h2>

                  <ol className="mt-7 flex flex-col sm:flex-row">
                    {STEPS.map((step, idx) => {
                      const done = idx < currentStepIndex;
                      const current = idx === currentStepIndex;
                      const reached = idx <= currentStepIndex;
                      return (
                        <li
                          key={step.key}
                          aria-current={current ? "step" : undefined}
                          className="relative flex items-start gap-3 pb-6 last:pb-0 sm:flex-1 sm:flex-col sm:items-center sm:gap-2 sm:pb-0"
                        >
                          {idx < STEPS.length - 1 && (
                            <span
                              aria-hidden
                              className={`absolute left-[15px] top-8 h-full w-0.5 sm:left-1/2 sm:top-[15px] sm:h-0.5 sm:w-full ${done ? "bg-festival-orange" : "bg-[#ebe6d9]/15"
                                }`}
                            />
                          )}
                          <span
                            className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-xs font-semibold ${reached
                                ? "border-festival-orange bg-festival-orange text-white"
                                : "border-[#ebe6d9]/25 bg-[#1b2c23] text-[#ebe6d9]/50"
                              }`}
                          >
                            {done ? <Check className="h-4 w-4" /> : idx + 1}
                          </span>
                          <div className="pt-1 sm:px-1 sm:pt-0 sm:text-center">
                            <p
                              className={`text-sm ${current ? "font-semibold text-white" : reached ? "" : "text-[#ebe6d9]/50"
                                }`}
                            >
                              {step.label}
                            </p>
                            {current && <p className={`mt-0.5 text-xs ${muted}`}>{step.desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>

                {/* Shipment */}
                <section className={`${panel} p-5 sm:p-6`}>
                  <h2 className="font-semibold">Shipment</h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className={`text-xs ${muted}`}>Courier</dt>
                      <dd className="mt-1 text-sm font-medium">{order.courierName || "Not assigned yet"}</dd>
                    </div>
                    <div>
                      <dt className={`text-xs ${muted}`}>Tracking number</dt>
                      <dd className="mt-1 flex items-center gap-1 text-sm font-medium">
                        <span className="break-all font-mono">{order.awbNumber || "Not available yet"}</span>
                        {order.awbNumber && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(order.awbNumber!, "awb-copy")}
                            className="rounded p-1.5 text-[#ebe6d9]/70 hover:bg-white/10 hover:text-white"
                            aria-label="Copy tracking number"
                          >
                            {copiedId === "awb-copy" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        )}
                      </dd>
                    </div>
                  </dl>

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-festival-orange px-4 text-sm font-semibold text-white hover:bg-festival-orange/90 sm:w-auto"
                    >
                      Track on {order.courierName || "courier"} site <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {order.shippingRemarks && (
                    <div className="mt-5 border-l-2 border-festival-orange pl-4">
                      <p className={`text-xs ${muted}`}>Note from the team</p>
                      <p className="mt-1 break-words text-sm leading-relaxed">{order.shippingRemarks}</p>
                    </div>
                  )}
                </section>

                {/* Items */}
                <section className={`${panel} p-5 sm:p-6`}>
                  <h2 className="font-semibold">
                    Items <span className={`font-normal ${muted}`}>({order.items?.length || 0})</span>
                  </h2>

                  <ul className="mt-2 divide-y divide-[#ebe6d9]/10">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 py-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 shrink-0 rounded-md bg-black/30 object-cover"
                          />
                        ) : (
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-black/30">
                            <Package className="h-6 w-6 text-[#ebe6d9]/40" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          {item.variant && <p className={`mt-0.5 text-xs ${muted}`}>{item.variant}</p>}
                          <p className={`mt-1 text-xs ${muted}`}>
                            {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-2 space-y-2 border-t border-[#ebe6d9]/15 pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className={muted}>Subtotal</dt>
                      <dd>₹{(order.subtotal || 0).toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={muted}>GST</dt>
                      <dd>₹{(order.tax || 0).toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className={muted}>Shipping</dt>
                      <dd>{order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-[#ebe6d9]/15 pt-3">
                      <dt className="font-semibold">Total paid</dt>
                      <dd className="text-xl font-bold">₹{(order.total || 0).toFixed(2)}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <aside className="min-w-0 space-y-6">
                <section className={`${panel} p-5`}>
                  <h2 className="font-semibold">Delivering to</h2>
                  {order.shippingAddress ? (
                    <address className="mt-3 space-y-0.5 text-sm not-italic">
                      <p className="break-words font-medium">{order.shippingAddress.fullName}</p>
                      <p className={muted}>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p className={muted}>{order.shippingAddress.country}</p>
                    </address>
                  ) : (
                    <p className={`mt-3 text-sm ${muted}`}>No address on record.</p>
                  )}
                </section>

                <section className={`${panel} p-5`}>
                  <h2 className="font-semibold">Questions about this order?</h2>
                  <p className={`mt-1 text-sm ${muted}`}>The merch team replies on WhatsApp.</p>
                  <a
                    href={`https://wa.me/917003195644?text=Hi%2C%20I%20have%20an%20inquiry%20regarding%20my%20Hornbill%20Festival%20merchandise%20order%20%23${resolvedOrderId.slice(-6).toUpperCase()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#ebe6d9]/25 px-4 text-sm font-medium hover:bg-white/10"
                  >
                    <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                  </a>
                </section>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}