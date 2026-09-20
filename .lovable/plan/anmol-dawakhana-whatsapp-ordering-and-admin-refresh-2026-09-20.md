# Anmol Dawakhana WhatsApp Ordering and Admin Refresh

## Goal
Make WhatsApp the only customer ordering path, collect complete customer details before opening WhatsApp, simplify the admin experience, add secure product image uploads, and improve Urdu throughout the site.

## Customer ordering
- Replace every product-card and product-page purchase action with one primary **Order via WhatsApp / واٹس ایپ پر آرڈر کریں** button.
- Remove Add to Cart, Buy Now, cart links/counters, mobile cart navigation, and checkout navigation so customers see one clear ordering path.
- Open an accessible order popup containing:
  - Full name / پورا نام
  - Complete delivery address / مکمل پتہ
  - Phone number / فون نمبر
  - Quantity / تعداد
- Validate all fields before confirmation, including Pakistani mobile-number formatting and sensible length limits.
- On confirmation, open `https://wa.me/923072560758` in a new tab with `noopener,noreferrer` and a professionally formatted message containing customer details, product name, pack size, unit price, quantity, and total.
- Keep consultation WhatsApp links separate because they are contact actions, not product-order actions.

## Admin panel
- Redesign `/admin` into a clear two-tab workspace: **Products** and **Clinic Settings**.
- Improve product browsing with a clean list, clear Edit/Delete controls, empty/loading/error states, and a focused Add/Edit screen.
- Group product fields into understandable sections: basic details, pricing and pack, photo, descriptions, benefits/ingredients, and usage.
- Add image upload with preview, progress feedback, file-type validation, and a 5 MB limit; retain an optional image URL field as a fallback.
- Upload product photos through the protected admin session to a public product-images storage area; only the protected server action can write.
- Preserve secure server-side validation for product and settings updates and use confirmation before deletion.
- Simplify Clinic Settings to prominently manage address, phone/WhatsApp, email, map location, banner wording, and emergency announcements.

## Urdu and RTL refinement
- Replace English-heavy or awkward Urdu labels with short, natural Pakistani Urdu across navigation, ordering, product details, contact, cart references, and admin controls.
- Add all new popup and admin wording in English and Urdu without mixed-language labels where avoidable.
- Keep phone numbers and technical values left-to-right while maintaining correct right-to-left layout and Nastaliq typography for Urdu content.
- Update fallback sample-product Urdu descriptions where wording is unnatural; database-managed product text remains editable from admin.

## Technical details
- Create a reusable WhatsApp order dialog component used by product cards and product detail pages.
- Extend the WhatsApp message helper with validated customer details and calculated totals.
- Remove customer-facing cart/checkout entry points while leaving obsolete routes unavailable or redirecting safely to products.
- Add a protected image-upload server function and storage policy; generated public URLs remain readable by storefront visitors.
- Use existing design tokens and shared Button/Dialog controls, with keyboard focus, close behavior, responsive sizing, and no nested panels.
- Preserve each content page’s unique metadata and update descriptions that still mention checkout/cart ordering.

## Verification
- Test English and Urdu product ordering on desktop and mobile widths.
- Confirm invalid popup fields remain blocked and a valid submission opens the exact `wa.me/923072560758` URL with complete encoded details in a new tab.
- Confirm cart and checkout links are gone from customer navigation.
- Sign into `/admin`, upload and preview an image, add/edit/delete a test product, and update clinic settings.
- Check RTL alignment, text fit, browser console, runtime errors, and the final build signal.
