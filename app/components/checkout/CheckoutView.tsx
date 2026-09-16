"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";
import { TAX_RATE } from "@/app/data/cart";
import { deliveryMethods, paymentMethods } from "@/app/data/checkout";
import {
  fetchAddresses,
  fetchCart,
} from "@/app/lib/shop-service";
import type { AddressRow, ShopCartLine } from "@/app/types/shop";
import { createOrder, validateCouponCode } from "@/app/actions/orders";
import { ProductThumb } from "@/app/components/account/ui";
import {
  ArrowRightIcon,
  BanknoteIcon,
  CheckIcon,
  CreditCardIcon,
  HomeIcon,
  LockIcon,
  MapPinIcon,
  TagIcon,
  TruckIcon,
  UserIcon,
} from "./icons";

const money = (value: number) => `$${value.toFixed(2)}`;

const inputClasses =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors sm:py-3";

type CheckoutLine = {
  productId: string;
  variantId: string;
  size: string | null;
  quantity: number;
  name: string;
  colorName: string;
  colorValue: string;
  accent: string;
  price: number;
  compareAt: number | null;
};

function toCheckoutLine(line: ShopCartLine): CheckoutLine {
  return {
    productId: line.productId,
    variantId: line.variantId,
    size: line.size,
    quantity: line.quantity,
    name: line.name,
    colorName: line.colorName,
    colorValue: line.colorValue,
    accent: line.colorValue,
    price: line.price,
    compareAt: line.compareAt,
  };
}

export default function CheckoutView() {
  const { user } = useAuth();
  const { refreshCounts } = useShopCounts();
  const router = useRouter();
  const [lines, setLines] = useState<CheckoutLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [addressMode, setAddressMode] = useState<"saved" | "new">("new");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    country: "United States",
  });
  const [deliveryId, setDeliveryId] = useState<string>("standard");
  const [paymentId, setPaymentId] = useState<string>("cod");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const autoAppliedRef = useRef(false);

  const load = useCallback(async () => {
    if (!user) {
      setLines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const [cart, addressList] = await Promise.all([
        fetchCart(user.id),
        fetchAddresses(user.id),
      ]);
      setLines(cart.map(toCheckoutLine));
      setAddresses(addressList);
      const preferred =
        addressList.find((address) => address.is_default) ?? addressList[0];
      if (preferred) {
        setAddressMode("saved");
        setSelectedAddressId(preferred.id);
      }
    } catch {
      setLoadError("We couldn't load your bag. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  useEffect(() => {
    if (loading || lines.length === 0 || applied || autoAppliedRef.current) {
      return;
    }
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    autoAppliedRef.current = true;
    const subtotalNow = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
    validateCouponCode(code, subtotalNow).then((result) => {
      if (result.ok) {
        setApplied({ code: result.code, discount: result.discount });
      } else {
        setCouponError(result.error);
      }
    });
  }, [loading, lines, applied]);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center">
        <p className="text-sm text-muted">
          Please log in to check out.
        </p>
      </div>
    );
  }

  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  const discount = applied?.discount ?? 0;
  const deliveryMethod =
    deliveryMethods.find((method) => method.id === deliveryId) ??
    deliveryMethods[0];
  const shipping =
    deliveryId === "standard" && subtotal - discount >= 75
      ? 0
      : deliveryMethod.price;
  const tax = (subtotal - discount + shipping) * TAX_RATE;
  const payable = subtotal - discount + shipping + tax;

  const applyCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = coupon.trim();
    if (!code) return;
    setCouponError(null);
    const result = await validateCouponCode(code, subtotal);
    if (!result.ok) {
      setCouponError(result.error);
      setApplied(null);
      return;
    }
    setApplied({ code: result.code, discount: result.discount });
    setCoupon("");
  };

  const canPlace = lines.length > 0 && paymentId !== "online";

  const placeOrder = async () => {
    if (!canPlace || placing) return;
    setPlaceError(null);

    if (addressMode === "new") {
      const missing =
        !newAddress.fullName.trim() ||
        !newAddress.phone.trim() ||
        !newAddress.street.trim() ||
        !newAddress.city.trim() ||
        !newAddress.country.trim();
      if (missing) {
        setPlaceError("Please complete your shipping address.");
        return;
      }
    } else if (!selectedAddressId) {
      setPlaceError("Please choose a shipping address.");
      return;
    }

    setPlacing(true);
    try {
      const result = await createOrder({
        items: lines.map((line) => ({
          productId: line.productId,
          variantId: line.variantId,
          size: line.size,
          quantity: line.quantity,
        })),
        address:
          addressMode === "saved"
            ? { addressId: selectedAddressId ?? undefined }
            : {
                label: "Shipping",
                full_name: newAddress.fullName,
                street: newAddress.street,
                city: newAddress.city,
                country: newAddress.country,
                phone: newAddress.phone,
              },
        deliveryId,
        paymentMethod: paymentId,
        couponCode: applied?.code,
      });
      if (!result.ok) {
        setPlaceError(result.error);
        return;
      }
      await refreshCounts();
      router.push(`/order-success?order=${result.orderId}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Secure Checkout
      </p>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-muted">
        {loading
          ? "Loading your bag…"
          : `${totalItems} item${totalItems === 1 ? "" : "s"} · Cash on Delivery.`}
      </p>

      {loadError ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted">
            <CreditCardIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Something went wrong
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {loadError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => load()}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
        </div>
      ) : !loading && lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-muted">
            <CreditCardIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Your bag is empty
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Add something to your bag before checking out.
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 gap-8 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-4">
            {/* Contact */}
            <Step index={1} title="Contact information" icon={<UserIcon className="h-4 w-4" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Email
                  </span>
                  <input
                    type="email"
                    className={inputClasses}
                    value={user.email ?? ""}
                    readOnly
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Phone
                  </span>
                  <input
                    type="tel"
                    className={inputClasses}
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </label>
              </div>
            </Step>

            {/* Shipping address */}
            <Step index={2} title="Shipping address" icon={<MapPinIcon className="h-4 w-4" />}>
              {loading ? (
                <p className="text-sm text-muted">Loading addresses…</p>
              ) : addressMode === "saved" && addresses.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        aria-pressed={selectedAddressId === address.id}
                        className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                          selectedAddressId === address.id
                            ? "border-accent/60 bg-accent/[0.06]"
                            : "border-border bg-surface hover:border-border"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-3">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                selectedAddressId === address.id
                                  ? "border-accent bg-accent"
                                  : "border-border"
                              }`}
                              aria-hidden="true"
                            >
                              {selectedAddressId === address.id && (
                                <span className="h-2 w-2 rounded-full bg-black" />
                              )}
                            </span>
                            <HomeIcon className="h-4 w-4 text-muted" />
                            <span>
                              <span className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground">
                                  {address.label}
                                </span>
                                {address.is_default && (
                                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
                                    Default
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted">
                                {address.street} · {address.city} · {address.country}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddressMode("new")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    + Add a new address
                  </button>
                </>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Full name
                    </span>
                    <input
                      type="text"
                      className={inputClasses}
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Alex Morgan"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Street address
                    </span>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Street, building, apartment"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress((prev) => ({ ...prev, street: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                      City / ZIP
                    </span>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Portland, OR 97205"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                      Country
                    </span>
                    <input
                      type="text"
                      className={inputClasses}
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress((prev) => ({ ...prev, country: e.target.value }))
                      }
                    />
                  </label>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddressMode("saved")}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent sm:col-span-2 sm:w-fit"
                    >
                      Use a saved address instead
                    </button>
                  )}
                </div>
              )}
            </Step>

            {/* Delivery method */}
            <Step index={3} title="Delivery method" icon={<TruckIcon className="h-4 w-4" />}>
              <div className="grid gap-3 sm:grid-cols-3">
                {deliveryMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setDeliveryId(method.id)}
                    aria-pressed={deliveryId === method.id}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      deliveryId === method.id
                        ? "border-accent/60 bg-accent/[0.06]"
                        : "border-border bg-surface hover:border-border"
                    }`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          deliveryId === method.id ? "border-accent bg-accent" : "border-border"
                        }`}
                        aria-hidden="true"
                      >
                        {deliveryId === method.id && <span className="h-2 w-2 rounded-full bg-black" />}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {deliveryId === "standard" &&
                        subtotal - discount >= 75
                          ? "Free"
                          : method.price === 0
                            ? "Free"
                            : money(method.price)}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm font-bold text-foreground">{method.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{method.description}</span>
                    <span className="mt-1 block text-xs text-accent">{method.eta}</span>
                  </button>
                ))}
              </div>
            </Step>

            {/* Payment method */}
            <Step index={4} title="Payment method" icon={<CreditCardIcon className="h-4 w-4" />}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => method.available && setPaymentId(method.id)}
                    aria-pressed={paymentId === method.id}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      paymentId === method.id
                        ? "border-accent/60 bg-accent/[0.06]"
                        : "border-border bg-surface"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            paymentId === method.id ? "border-accent bg-accent" : "border-border"
                          }`}
                          aria-hidden="true"
                        >
                          {paymentId === method.id && <span className="h-2 w-2 rounded-full bg-black" />}
                        </span>
                        {method.id === "cod" ? (
                          <BanknoteIcon className="h-5 w-5 text-accent" />
                        ) : (
                          <CreditCardIcon className="h-5 w-5 text-accent" />
                        )}
                        <span>
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{method.label}</span>
                            {!method.available && (
                              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                                Coming soon
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">{method.description}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Step>
          </div>

          {/* Order summary */}
          <aside className="mt-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
              <h2 className="text-base font-black uppercase tracking-widest text-foreground">
                Your order
              </h2>

              <ul className="mt-5 space-y-4">
                {lines.map((line) => (
                  <li key={`${line.variantId}-${line.size}`} className="flex gap-3">
                    <ProductThumb name={line.name} accent={line.accent} className="h-16 w-16" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{line.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {line.colorName}
                        {line.size ? ` · ${line.size}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">Qty {line.quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-foreground">
                      {money(line.price * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <form
                className="mt-6 border-t border-border pt-5"
                onSubmit={applyCoupon}
              >
                <label
                  htmlFor="checkout-coupon"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted"
                >
                  Coupon / discount
                </label>
                <div className="flex gap-2">
                  <input
                    id="checkout-coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError(null);
                    }}
                    placeholder="e.g. WELCOME15"
                    className="w-full min-w-0 rounded-full border border-border bg-surface px-4 py-2.5 text-sm uppercase text-foreground placeholder:normal-case placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-black"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="mt-2 text-xs text-rose-400">{couponError}</p>}
                {applied && !couponError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-accent">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {applied.code} applied
                  </p>
                )}
              </form>

              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold text-foreground">{money(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className={shipping === 0 ? "font-semibold text-accent" : "font-semibold text-foreground"}>
                    {shipping === 0 ? "Free" : money(shipping)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Estimated tax</dt>
                  <dd className="font-semibold text-foreground">{money(tax)}</dd>
                </div>
                {applied && discount > 0 && (
                  <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-3 py-2">
                    <dt className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                      <TagIcon className="h-3.5 w-3.5" />
                      {applied.code}
                    </dt>
                    <dd className="font-semibold text-accent">−{money(discount)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-border pt-4">
                  <dt className="text-sm font-bold uppercase tracking-widest text-foreground">
                    Total payable
                  </dt>
                  <dd className="text-2xl font-black tracking-tight text-accent">{money(payable)}</dd>
                </div>
              </dl>

              {placeError && (
                <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs leading-relaxed text-rose-400">
                  {placeError}
                </p>
              )}

              <button
                type="button"
                onClick={placeOrder}
                disabled={!canPlace || placing || loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent"
              >
                {placing
                  ? "Placing order…"
                  : paymentId === "online"
                    ? "Choose payment method"
                    : "Place Order"}
                {paymentId !== "online" && <ArrowRightIcon className="h-4 w-4" />}
              </button>
              {paymentId === "online" && (
                <p className="mt-3 text-xs leading-relaxed text-amber-400">
                  Online payments are a placeholder. Choose Cash on Delivery to
                  place your order.
                </p>
              )}

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
                <LockIcon className="h-3.5 w-3.5" />
                Cash on Delivery — no online payment is processed.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Step({
  index,
  title,
  icon,
  children,
}: {
  index: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-accent">
          {icon}
        </span>
        <h2 className="text-lg font-black tracking-tight text-foreground">
          <span className="mr-2 font-mono text-sm text-muted">{index.toString().padStart(2, "0")}</span>
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}