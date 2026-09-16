"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { fetchOrders } from "@/app/lib/shop-service";
import type { OrderRow } from "@/app/types/shop";
import { orderStatusLabel, paymentStatusLabel } from "@/app/lib/status";
import { ArrowRightIcon, PackageIcon } from "./icons";
import {
  OrderStatusBadge,
  Panel,
  PaymentStatusBadge,
  ProductThumb,
  SectionHeader,
} from "./ui";

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders(user.id).then((rows) => {
      setOrders(rows);
      setLoading(false);
    });
  }, [user]);

  return (
    <section aria-labelledby="orders-heading">
      <SectionHeader
        eyebrow="My Orders"
        title="Order history"
        description="Review your recent purchases, track delivery and open order details."
      />

      <div className="mt-6 space-y-4">
        {loading ? (
          <Panel className="p-5 text-sm text-muted">Loading your orders…</Panel>
        ) : orders.length === 0 ? (
          <Panel className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <PackageIcon className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              You haven&apos;t placed any orders yet. When you do, they&apos;ll
              show up here with live tracking.
            </p>
            <Link
              href="/shop"
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
            >
              Start Shopping
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </Panel>
        ) : (
          orders.map((order) => (
            <Panel
              key={order.id}
              className="flex flex-col gap-3 p-3 transition-colors hover:border-border sm:p-5 lg:flex-row lg:items-center"
            >
              <div className="flex items-start gap-3">
                <div className="flex -space-x-3">
                  <ProductThumb
                    name={order.order_number}
                    accent="#a3e635"
                    className="h-14 w-14 ring-2 ring-card"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      #{order.order_number}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted">
                    {orderStatusLabel(order.status)} ·{" "}
                    {paymentStatusLabel(order.payment_status)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:ml-auto lg:justify-end">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.payment_status} />
              </div>

              <div className="flex items-center justify-between gap-4 lg:w-auto lg:flex-col lg:items-end lg:justify-center">
                <span className="text-lg font-black tracking-tight text-foreground">
                  ${Number(order.total).toFixed(2)}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  View Order
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Panel>
          ))
        )}
      </div>
    </section>
  );
}