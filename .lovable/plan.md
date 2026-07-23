
## Goal

Replace the localStorage demo auth with a real backend (Lovable Cloud) and add proper customer + admin sign-up/login, plus persistent data for products, orders, wishlist, and addresses.

## What I'll build

### 1. Enable Lovable Cloud
Provision the managed backend (database + auth + storage) — no external accounts needed.

### 2. Authentication
- **Email + Password** sign-up and login for everyone (email confirmation OFF so testing is instant)
- Same `/login` and `/signup` pages, rewired to real auth
- New `/reset-password` page for forgot-password flow
- Session persisted via Supabase (auto refresh, survives reload)

### 3. Roles (customer vs admin) — done the secure way
- Separate `user_roles` table with an `app_role` enum (`admin`, `customer`)
- `has_role()` security-definer function to avoid RLS recursion
- **New users default to `customer`** via a signup trigger
- **Admins are promoted manually** — I'll document one SQL snippet you run once to make yourself admin (safest approach; no signup codes to leak)

### 4. Database tables (all with RLS)
- `profiles` — name, avatar, linked to `auth.users`
- `user_roles` — role assignments
- `products` — the 10 gadgets migrated from `src/data/products.ts`
- `addresses` — per-user shipping/billing
- `wishlist` — per-user saved products
- `orders` + `order_items` — checkout history

RLS rules: users read/write only their own rows; admins can manage products and view all orders; products readable by everyone.

### 5. Admin dashboard (`/admin`, admin-only)
- Product management: create / edit / delete / toggle stock
- Orders list: view all orders with status update (pending → shipped → delivered)
- Route-guarded by role check

### 6. Rewire existing pages
- `AuthContext` → uses Supabase session instead of localStorage
- `Products` / `ProductDetail` → fetch from DB
- `Cart` stays client-side; `Checkout` writes an `orders` row on submit
- `Profile` → shows real orders, addresses, wishlist from DB
- `Navigation` → shows "Admin" link when the user has admin role

## Technical notes

- Follows Lovable's user_roles pattern (roles never on profiles table)
- Every `public` table gets explicit `GRANT`s + RLS policies
- `onAuthStateChange` listener set up synchronously, `getUser()` for trusted checks
- Password reset uses `resetPasswordForEmail` + `/reset-password` page
- Products migrated once via seed insert; images kept as current URLs

## Out of scope (say the word to add)

- Google / social sign-in
- Real payments (checkout still simulated)
- Email confirmation flow
- Custom-branded auth emails
