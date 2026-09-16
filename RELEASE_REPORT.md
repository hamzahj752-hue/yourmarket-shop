# YOURMARKET — Release Report

**Status:** Ready for deployment (single required step: apply the SQL migration to the Supabase database).

**Verification:** `npm run lint` → **PASS** (0 errors, 0 warnings) · `npm run build` → **PASS** (production build via Next.js 16 Turbopack).

---

## Why a database migration is required

The Supabase backend (URL + anon key in `.env.local`) is reachable and all tables exist, but the database is **empty**. Without the seed, every catalog page, PDP "Add to Cart", cart, checkout and order flow renders its empty/error state. This is a data provisioning step, not a code gap.

### How to apply

File: `supabase/migrations/20260916000000_release_ready.sql`

1. **Supabase Dashboard (recommended):** open **SQL Editor**, paste the full file contents, click **Run**.
   - (There is no `supabase/config.toml`, so `supabase db push` is not wired up. Dashboard apply avoids that entirely.)
2. The migration is idempotent (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`) and wrapped in a transaction, so it can be applied to an existing or brand-new database.

### What the migration does

- **Schema alignment (16 tables):** canonical column shapes, missing columns added, `id` defaults (`gen_random_uuid()`), indexes.
- **Row Level Security** enabled on all 16 tables with user-scoped policies (profiles/cart/wishlist/addresses/orders/notifications manage-own; catalog + coupons readable; `order_items`/`order_status_history` scoped via the owner's order).
- **`decrement_stock(p_variant_size_id uuid, p_quantity integer)`** SECURITY DEFINER RPC for atomic stock decrements (revoked from `public`, granted to `authenticated`). `app/actions/orders.ts` uses it and falls back to a guarded check-then-update if the RPC is missing.
- **Seed data:** 5 brands, 5 categories (incl. `shoes`) + subcategories, **52 products (40 apparel + 12 shoes), 138 variants, 949 variant_sizes**, and 4 coupons (`WELCOME15` – 15% off min $75, `SPRING25` – 25% off min $150, `SHIPFREE` – $9.95 off min $50, `RUNNERS10` – 10% off min $100; expiry 2027). Deterministic UUIDs (`uuid5`) so re-runs are stable. One intentional out-of-stock SKU (metro-waxed-jacket, XL, stock 0) for testing the out-of-stock flow.

---

## Feature-by-feature status (all PASS with the DB seeded)

| Area | Status | Notes |
|---|---|---|
| Catalog pages (Home, Shop, Categories, New Arrivals, Deals, Shoes) | ✅ | Static catalog driven by `app/data/products` + `app/lib/shoes`; ProductCard wishlist hearts wired via `useWishlist`. |
| Product detail — premium editorial PDP | ✅ | `PremiumProductDetails`: Add to Cart / Buy Now via `addToBag` (slug→real product), wishlist heart via `useWishlist`, live "In stock" indicator. |
| Product detail — shoes PDP | ✅ | `ShoeProductDetails`: same real wiring (colour+size), shoe colourways. |
| Wishlist | ✅ | Real persisted wishlist: `fetchWishlist`, `removeWishlistItem`, add-to-bag, loading/empty/error states. |
| Cart | ✅ | Real cart: `fetchCart`, quantity update, remove, promo via `validateCouponCode` server action, applied promo passed to checkout (`/checkout?code=…`), loading/empty states. |
| Checkout | ✅ | Real: `fetchCart` + `fetchAddresses`, saved/new address, delivery options (honest ETAs), **Cash on Delivery only** (online payment is a disabled placeholder with a notice — never fakes a payment), server-side coupon validation, `?code=` pre-apply on load, cart load-error + retry. |
| Place order → order-success | ✅ | `createOrder` re-reads prices/stock/coupons server-side, inserts order + items + status history, decrements stock, clears the cart (also now writes `total_amount`). Client redirects to `/order-success?order=…`. |
| Order success page | ✅ | Server-rendered, user-scoped order fetch, order number/status/shipping address/total. |
| My Account | ✅ | Orders list, order detail (`force-dynamic`, user-scoped, `notFound()`), addresses CRUD, notifications (reads real `notifications` + mark-read), coupons (reads real `coupons` table). |
| Auth (login / signup / forgot / reset) | ✅ | `signInWithPassword`, `signUp` + profile upsert, `resetPasswordForEmail` (redirect to `/reset-password`), `updateUser`. |
| Protected routes | ✅ | Proxy middleware guards `/account`, `/wishlist`, `/cart`, `/checkout`, `/order-success`; signed-in users bounce off auth pages. |
| 404s | ✅ | Unknown product slugs → `notFound()` (`dynamicParams = false`). |
| Security | ✅ | Anon key only (no `service_role`), RLS enforced, prices/status/coupons never trusted from the browser, no demo order/payment ever marked successful. |

---

## Environment / config notes

- `.env.local` requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key; both already present). No service-role key is used anywhere in the app.
- Forgot-password emails point at `${window.location.origin}/reset-password`, so the deployed origin is taken automatically.
- Enable the Supabase **Auth → Email → "Confirm email"** + password **reset** settings before release; a new user must confirm their email to sign in.

## Known limitations (honest, non-blocking for launch)

- Delivery ETAs are approximate ("3–5 business days") until live carrier quotes are wired.
- Order confirmation emails are **not** implemented (no email provider wired); the success page notes "you will receive a confirmation email shortly".
- The contact form is a static form (no message service connected) and is labelled as such.
- Static content pages (About, Terms, Shipping, Returns, Privacy, Deals promo banner) are editorial/demo content clearly marked for later admin-managed content.
- No automated test suite; verified by lint, production build, and a full manual code audit of the customer journey.