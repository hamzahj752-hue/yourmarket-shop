import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/app/lib/supabase/server";
import { orderStatusLabel } from "@/app/lib/status";

type Props = PageProps<"/order-success">;

export const metadata = {
  title: "Order Confirmed | YOURMARKET",
  description: "Your order has been placed successfully.",
};

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-accent" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="m16.5 9.4-9-5.19" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.27 6.96 8.73 5.04 8.73-5.04" /><path d="M12 22.08V12" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}

const money = (value: number) => `$${value.toFixed(2)}`;

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = typeof params.order === "string" ? params.order : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  if (!orderId) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center">
            <h1 className="text-2xl font-black text-foreground">Order not found</h1>
            <p className="mt-3 text-sm text-muted">
              We couldn&apos;t find the order you&apos;re looking for.
            </p>
            <Link
              href="/account"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
            >
              Back to My Account
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center">
            <h1 className="text-2xl font-black text-foreground">Order not found</h1>
            <p className="mt-3 text-sm text-muted">
              We couldn&apos;t find an order matching that reference.
            </p>
            <Link
              href="/account"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
            >
              Back to My Account
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { data: history } = await supabase
    .from("order_status_history")
    .select("status,created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  const shippingAddress = (order.shipping_address ?? {}) as Record<string, unknown>;
  const status = order.status as string;
  const total = Number(order.total ?? 0);
  const orderNumber = (order.order_number as string) ?? orderId;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex justify-center">
                <CheckCircleIcon />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent">Order Confirmed</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Thank you for your order</h1>
              <p className="mt-4 text-base leading-relaxed text-muted">
                We have received your order and are getting it ready. You will
                receive a confirmation email shortly.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Order details">
          <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <PackageIcon />
                  </span>
                  <div>
                    <p className="text-xs text-muted">Order Number</p>
                    <p className="text-sm font-bold text-foreground">{orderNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CalendarIcon />
                  </span>
                  <div>
                    <p className="text-xs text-muted">Order Status</p>
                    <p className="text-sm font-bold text-foreground">
                      {orderStatusLabel(status)}
                      {history && history.length > 0 ? " · Updated " : ""}
                      {history && history.length > 0
                        ? formatDate(
                            (() => {
                              const last =
                                history[history.length - 1];
                              return typeof last.created_at === "string"
                                ? last.created_at
                                : undefined;
                            })(),
                          )
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <MapPinIcon />
                  </span>
                  <div>
                    <p className="text-xs text-muted">Shipping Address</p>
                    <p className="text-sm font-bold text-foreground">
                      {typeof shippingAddress.full_name === "string"
                        ? `${shippingAddress.full_name}, `
                        : ""}
                      {typeof shippingAddress.street === "string"
                        ? shippingAddress.street
                        : ""}
                      {typeof shippingAddress.city === "string"
                        ? `, ${shippingAddress.city}`
                        : ""}
                      {typeof shippingAddress.country === "string"
                        ? `, ${shippingAddress.country}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Order Total</span>
                  <span className="text-xl font-black text-accent">{money(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Tax included. Cash on Delivery.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/account/orders/${orderId}`} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent">
                View Order
              </Link>
              <Link href="/shop" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-accent-hover">
                Continue Shopping
              </Link>
            </div>

            <p className="mt-8 text-center text-xs text-muted">
              Your order has been created. Pay cash on delivery.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}