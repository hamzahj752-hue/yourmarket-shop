"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { supabaseClient } from "@/app/lib/supabase/client";
import { AlertIcon, BellIcon, CreditCardIcon, PercentIcon, TruckIcon } from "./icons";
import { Panel, SectionHeader } from "./ui";

type NotificationKind = "order" | "delivery" | "promotion" | "stock";

type ActivityRow = {
  id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string | null;
};

type Activity = {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  read: boolean;
  timestamp: string;
};

const kindMeta: Record<
  NotificationKind,
  { icon: typeof BellIcon; label: string; classes: string }
> = {
  order: {
    icon: CreditCardIcon,
    label: "Order",
    classes: "bg-accent/10 border-accent/40 text-accent",
  },
  delivery: {
    icon: TruckIcon,
    label: "Delivery",
    classes: "bg-cyan-400/10 border-cyan-400/40 text-cyan-400",
  },
  promotion: {
    icon: PercentIcon,
    label: "Promotion",
    classes: "bg-violet-400/10 border-violet-400/40 text-violet-400",
  },
  stock: {
    icon: AlertIcon,
    label: "Stock",
    classes: "bg-amber-400/10 border-amber-400/40 text-amber-400",
  },
};

const filters: ("All" | NotificationKind)[] = [
  "All",
  "order",
  "delivery",
  "promotion",
  "stock",
];

const KIND_KEYWORDS: Array<[NotificationKind, RegExp]> = [
  ["delivery", /delivery|shipped|out for|carrier|parcel/i],
  ["promotion", /promo|coupon|offer|sale|discount|drop|launch/i],
  ["stock", /stock|back in|restock|low on/i],
];

function inferKind(title: string, message: string): NotificationKind {
  const text = `${title} ${message}`;
  for (const [kind, pattern] of KIND_KEYWORDS) {
    if (pattern.test(text)) return kind;
  }
  return "order";
}

function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationsSection() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const load = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    const { data } = await supabaseClient
      .from("notifications")
      .select("id,title,message,is_read,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setNotifications(
      ((data as unknown as ActivityRow[]) ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        message: row.message ?? "",
        kind: inferKind(row.title, row.message ?? ""),
        read: Boolean(row.is_read),
        timestamp: formatTimestamp(row.created_at),
      })),
    );
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visible =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.kind === filter);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    supabaseClient
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId);
  }

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true })),
    );
    supabaseClient
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .is("is_read", false);
  }

  const filterLabel = (value: (typeof filters)[number]) =>
    value === "All" ? "All" : kindMeta[value].label;

  return (
    <section aria-labelledby="notifications-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeader
          eyebrow="Notifications"
          title="Your activity"
          description="Order updates, delivery alerts, promotions and product alerts."
        />
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              filter === value
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {filterLabel(value)}
            {value === "All" && unreadCount > 0 && (
              <span className="ml-1.5 text-accent">· {unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <Panel className="mt-4 overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-sm text-muted">Loading notifications…</p>
        ) : (
          <ul>
            {visible.map((notification, index) => {
              const meta = kindMeta[notification.kind];
              const Icon = meta.icon;
              return (
                <li
                  key={notification.id}
                  className={`flex gap-3 p-3 transition-colors hover:bg-surface/60 sm:px-6 ${
                    index > 0 ? "border-t border-border" : ""
                  } ${notification.read ? "" : "bg-accent/[0.03]"}`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${meta.classes}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm ${
                          notification.read
                            ? "font-semibold text-foreground"
                            : "font-bold text-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent"
                          aria-label="Unread"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          New
                        </span>
                      )}
                      <span className="text-[11px] uppercase tracking-wide text-muted">
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted/70">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      className="hidden shrink-0 self-center rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent sm:block"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!loading && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <BellIcon className="h-6 w-6 text-muted" />
            <p className="text-sm text-muted">No notifications here.</p>
          </div>
        )}
      </Panel>

      <p className="mt-4 text-xs text-muted">
        Notifications are read from your account.
      </p>
    </section>
  );
}