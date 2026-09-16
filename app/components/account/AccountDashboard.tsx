"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useShopCounts } from "@/app/context/shop-context";
import { fetchOrders, fetchProfile } from "@/app/lib/shop-service";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import WishlistSection from "./WishlistSection";
import AddressesSection from "./AddressesSection";
import NotificationsSection from "./NotificationsSection";
import CouponsSection from "./CouponsSection";
import HelpSection from "./HelpSection";
import PrivacySection from "./PrivacySection";
import LogoutSection from "./LogoutSection";
import {
  BellIcon,
  HeartIcon,
  LifeBuoyIcon,
  LogoutIcon,
  MapPinIcon,
  PackageIcon,
  PencilIcon,
  ShieldIcon,
  TicketIcon,
  UserIcon,
} from "./icons";
import { Avatar } from "./ui";

type SectionId =
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "notifications"
  | "coupons"
  | "help"
  | "privacy"
  | "logout";

const NAV_ITEMS: {
  id: SectionId;
  label: string;
  icon: typeof UserIcon;
}[] = [
  { id: "profile", label: "My Profile", icon: UserIcon },
  { id: "orders", label: "My Orders", icon: PackageIcon },
  { id: "wishlist", label: "Wishlist", icon: HeartIcon },
  { id: "addresses", label: "Saved Addresses", icon: MapPinIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "coupons", label: "Coupons", icon: TicketIcon },
  { id: "help", label: "Help Center", icon: LifeBuoyIcon },
  { id: "privacy", label: "Privacy", icon: ShieldIcon },
  { id: "logout", label: "Logout", icon: LogoutIcon },
];

export default function AccountDashboard() {
  const [section, setSection] = useState<SectionId>("profile");
  const { user, loading: authLoading } = useAuth();
  const { wishlistCount } = useShopCounts();
  const [profile, setProfile] = useState<{ full_name?: string | null }>({});
  const [orderCount, setOrderCount] = useState(0);

  const displayName = profile.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Shopper";
  const firstName = displayName.split(" ")[0];
  const email = user?.email ?? "";

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id).then((p) => setProfile(p ?? {}));
    fetchOrders(user.id).then((orders) => setOrderCount(orders.length));
  }, [user]);

  const badgeFor = (id: SectionId) => {
    switch (id) {
      case "orders":
        return orderCount;
      case "wishlist":
        return wishlistCount;
      default:
        return 0;
    }
  };

  const renderSection = () => {
    switch (section) {
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "addresses":
        return <AddressesSection />;
      case "notifications":
        return <NotificationsSection />;
      case "coupons":
        return <CouponsSection />;
      case "help":
        return <HelpSection />;
      case "privacy":
        return <PrivacySection />;
      case "logout":
        return <LogoutSection onCancel={() => setSection("profile")} />;
      default:
        return <ProfileSection />;
    }
  };

  const navItemClasses = (id: SectionId) =>
    `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      section === id
        ? "border border-accent/50 bg-accent/10 text-accent"
        : "border border-transparent text-muted hover:bg-surface hover:text-foreground"
    }`;

  const iconColor = (id: SectionId) =>
    section === id ? "text-accent" : "text-muted group-hover:text-accent";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Member Account
      </p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        Welcome back, {authLoading ? "…" : firstName}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Manage your profile, orders, saved items and preferences in one place.
      </p>

      <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <Avatar name={displayName} className="h-14 w-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted">{email}</p>
              <button
                type="button"
                onClick={() => setSection("profile")}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent transition-colors hover:text-accent-hover"
              >
                <PencilIcon className="h-3 w-3" />
                Edit Profile
              </button>
            </div>
          </div>

          <nav
            aria-label="Account navigation"
            className="mt-4 hidden flex-col gap-1 lg:flex"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge = badgeFor(item.id);
              const isLogout = item.id === "logout";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  aria-current={section === item.id ? "page" : undefined}
                  className={`${navItemClasses(item.id)} ${
                    isLogout ? "mt-2 border-t border-border !rounded-none !border-x-0 !border-b-0 pt-4" : ""
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${iconColor(item.id)}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge > 0 && (
                    <span
                      className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        section === item.id
                          ? "bg-accent text-black"
                          : "bg-border text-foreground group-hover:bg-accent group-hover:text-black"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="mt-6 min-w-0 lg:mt-0">
          <nav
            aria-label="Account sections"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge = badgeFor(item.id);
              const isLogout = item.id === "logout";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    document.getElementById("account-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  aria-current={section === item.id ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    section === item.id
                      ? "border-accent/60 bg-accent/10 text-accent"
                      : "border-border bg-card text-muted"
                  } ${isLogout ? "border-amber-400/40 text-amber-400" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {badge > 0 && (
                    <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-black">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div id="account-panel" className="mt-6 lg:mt-0">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}