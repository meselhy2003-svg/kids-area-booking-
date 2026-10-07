# American Dream Ismailia — System Specifications
## Features, Scope & Acceptance Criteria Document
**Document Version:** 1.0.0  
**Project:** American Dream Family Entertainment Center & Kids Park  
**Target Platform:** Web (Dual Desktop & Mobile PWA-Ready Experience)  
**Language Support:** Bilingual (Arabic - Egyptian RTL / English LTR)  
**Status:** Approved for Implementation & Future Authentication Integration  

---

## 1. Executive Summary & System Overview

**American Dream Ismailia** is an interactive, multi-zone family entertainment complex and amusement park web platform. The platform serves families, school groups, party organizers, and dine-in/delivery customers, providing digital pass booking, trip quotations, restaurant orders, and dynamic media synchronization.

### 1.1 Technical Stack & Foundations
* **Frontend Framework:** React 18 (Functional Components, Hooks, Context API)
* **Build Tooling:** Vite 6 with code splitting and dynamic lazy loading (`Suspense`)
* **Styling & UI:** Custom modern glassmorphic & playful responsive CSS (separate desktop & mobile layouts)
* **Interactive Assets & FX:** GSAP, Canvas Confetti, HTML2Canvas, Lucide Icons
* **Data & API Layer:** RESTful API client with ngrok/Postman tunnel headers, local mock fallback, zero-latency caching
* **Current Auth Status:** Client-side mock layer with JWT tokens, session persistence, loyalty wallet, ready for seamless production backend migration.

---

## 2. Project Scope

```
+---------------------------------------------------------------------------------------+
|                                    PROJECT SCOPE                                      |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   CURRENT IN-SCOPE (Phase 1)                   FUTURE IN-SCOPE (Phase 2 - Auth & Ops) |
|   -------------------------                    -------------------------------------- |
|   * 4 Themed Park Zones Showcase               * Production Identity & Auth System    |
|   * Digital Passes & Cart Checkout             * Role-Based Access Control (RBAC)     |
|   * Proof-of-Payment Upload (InstaPay/VF)      * Gatekeeper / Cashier Pass Scanner    |
|   * School Trips Quotation & Export            * Live Gate Validation (QR Scanner)    |
|   * Restaurant Menu & Delivery Ordering        * Parent Order & Booking History       |
|   * Birthday Party Booking Packages            * Real SMS / WhatsApp OTP Verification |
|   * Admin Media Management Dashboard           * Electronic Payment Gateway (Automated)|
|   * Full Arabic (RTL) & English (LTR)          * Financial Analytics & Audit Logs     |
|                                                                                       |
|   OUT OF SCOPE (Excluded from Web Application)                                        |
|   --------------------------------------------                                        |
|   * Physical turnstile hardware firmware programming                                 |
|   * Direct POS receipt printer driver integrations                                    |
|   * Ride mechanical diagnostic telemetry                                              |
+---------------------------------------------------------------------------------------+
```

### 2.1 In-Scope (Phase 1 — Current Features)
1. **Multi-Zone Amusement Park Display:** 
   - Toddler Paradise & Soft Play (`kids-area`).
   - Fun Park with Carousels & Bumper Cars (`fun-park`).
   - Tactical & VR Arcade Arena (`challenge`).
   - Adventure High Ropes & Climbing Course (`adventure`).
2. **Digital Ticketing & Passes:**
   - Single & Multi-zone passes with age constraints and inclusions.
   - User wallet with unique pass serials (`PZ-XXXXXX`) and interactive QR codes.
3. **Cart & Multi-Method Checkout:**
   - Loyalty points redemption (e.g., 2,250 points balance).
   - Cash / Offline Electronic Transfer (InstaPay, Vodafone Cash) with proof-of-payment screenshot upload and transaction sender ID tracking.
4. **School & Group Trips Calculator:**
   - Group size configuration, automated complimentary supervisor ratio (1 per 15 students).
   - Shift selection (Morning / Evening), age brackets.
   - Printable official quote generation and instant PNG screenshot capture via HTML2Canvas.
   - One-click direct dispatch to park WhatsApp business line.
5. **Restaurant & Food Delivery System:**
   - Family dine-in table booking inquiry.
   - Kids menu browsing with dietary tags and high-resolution images.
   - Online delivery ordering module with address management, order notes, and summary breakdown.
6. **Events & Birthday Celebrations:**
   - Tiered packages: Silver Sparkle, Gold Super Star, Diamond VIP.
   - Mascot character add-ons, personalized decor, and custom celebration requests.
7. **Admin Media Management Dashboard:**
   - Secure upload form with live page (`kids-area`, `fun-park`, `challenge`, `adventure`, `events`, `home`) and section routing (`hero`, `explore`, `vibes`, `general`).
   - Live media library with image preview, instant URL copying, and server deletion.
   - Immediate cache invalidation and connection diagnostics with Apidog backend.
8. **Bilingual Localization & Adaptive UX:**
   - Seamless Arabic (Egyptian colloquial & modern standard) and English switching with persistent state and DOM `dir="rtl"` / `dir="ltr"` adjustment.
   - Independent responsive desktop shell and mobile bottom dock navigation.

### 2.2 In-Scope (Phase 2 — Future Authentication & Roles)
1. **Full Production Authentication Pipeline:**
   - User registration via Email/Phone + Password or OTP.
   - JWT Access Token (short-lived) + Refresh Token (HTTP-only cookie) architecture.
2. **Role-Based Access Control (RBAC):**
   - Distinct role privileges for Guest, Parent/Customer, Front-Desk Cashier, Media Admin, and Super Admin.
3. **Gatekeeper Validation Mode:**
   - Mobile camera QR code scanning for pass verification and anti-fraud check-in at park gates.
4. **Parent Profile & Booking History:**
   - Real-time ledger of past ticket orders, active wristbands, earned loyalty points, and table reservations.

### 2.3 Out of Scope
* Direct integration with physical gate turnstiles (relies on digital QR pass validation by park staff).
* In-house payment processing hardware (EFTPOS chip readers); manual and online gateway web redirects will be used instead.
* Low-level ride control telemetry and hardware PLC monitoring.

---

## 3. Detailed Features Breakdown

### Feature 1: Multi-Zone Park Presentation
* **Purpose:** Showcase the four core amusement zones with age-appropriate information, safety rules, multimedia galleries, and admission pricing.
* **Key Components:**
  * Dynamic hero banner with animated slogans and live capacity monitor.
  * Zone selector sub-nav with search filtering.
  * Attraction cards with age range, capacity limits, and instant booking modal triggers.
  * 360-degree interactive photo tour / lightbox gallery.

### Feature 2: Digital Passes & Pass Wallet
* **Purpose:** Allow visitors to purchase admission wristbands, store them digitally, and present them at the gate.
* **Key Components:**
  * Pass types: Super Explorer, All-Day Thrill, Tactical Arena, High Ropes Suspension.
  * Stored in digital wallet with status (`Active`, `Redeemed`, `Expired`), issue date, and unique code.
  * Interactive QR code generation for gate entry.

### Feature 3: Smart Cart & Multi-Payment Checkout
* **Purpose:** Provide frictionless checkout with flexible payment avenues popular in Egypt.
* **Key Components:**
  * Quantity adjustment steppers and subtotal calculation in both EGP and Loyalty Points.
  * Loyalty points checkout with real-time balance validation (warns if balance is insufficient).
  * Electronic cash transfer via InstaPay (IPA handle) and Vodafone Cash (wallet number).
  * Proof-of-payment modal allowing receipt image upload (drag-and-drop / file picker), sender phone number capture, and one-click account copying.
  * Gamified celebration (confetti) and auto-credit of loyalty points (10% back on cash spend).

### Feature 4: School & Group Trips Planner & Quotation Engine
* **Purpose:** Empower school administrators and tour operators to tailor, price, and export group trips in seconds.
* **Key Components:**
  * Dynamic formula engine: Students count $\times$ Tier package rate.
  * Automated complimentary teacher/supervisor ratio ($1\text{ supervisor per } 15\text{ students}$).
  * Morning (09:30 AM) vs Evening (03:30 PM) shift selector.
  * Official quote generator with serial reference (`AD-TRIP-XXXX`).
  * In-browser high-resolution PNG screenshot generation using HTML2Canvas.
  * WhatsApp direct transmission with pre-formatted bilingual itinerary text.

### Feature 5: Restaurant, Dine-In & Food Delivery
* **Purpose:** Complete food & beverage management for both park visitors and local Ismailia residents.
* **Key Components:**
  * Dine-in table reservation system with guest counter, date picker, and special requests.
  * Interactive food menu featuring kids meals, healthy snacks, smoothies, and desserts.
  * Online Delivery Page: Delivery address input, delivery fee calculation, estimated delivery time (35-45 mins), order confirmation.

### Feature 6: Events & Birthday Celebrations Booking
* **Purpose:** Promote and book hassle-free children's birthday celebrations.
* **Key Components:**
  * Visual package comparison (Silver, Gold, Diamond VIP).
  * Inclusions display (party host, meals, backdrop decoration, mascot appearance, face painting).
  * Direct booking trigger modal with party date, child age, and estimated guest attendance.

### Feature 7: Admin Media Management & CMS Dashboard
* **Purpose:** Allow park managers to update website images and promotional banners without touching code.
* **Key Components:**
  * File dropzone supporting PNG, JPG, JPEG, WEBP up to 10MB.
  * Target page and target section selector.
  * Live media library with category filtering, image deletion, and direct URL copy.
  * Zero-latency cache invalidation and direct status monitoring of the backend API.

### Feature 8: Localization & Responsive Dual Shell
* **Purpose:** Ensure an optimal native-like experience on both smartphones and desktop displays in Arabic and English.
* **Key Components:**
  * Mobile shell: Native app header, bottom curved navigation bar, slide-out drawer menus.
  * Desktop shell: Full top navigation bar, sub-nav with zone search, comprehensive footer.
  * Instant language switch toggling document direction (`dir="rtl"` / `dir="ltr"`) and all system strings.

---

## 4. Future Authentication & Authorization System

### 4.1 System Architecture & Flow

```
                      +-----------------------------+
                      |       Client Frontend       |
                      |  (React 18 / AuthContext)   |
                      +--------------+--------------+
                                     |
               1. Register / Login   |   2. JWT Bearer (AccessToken)
               (Email/Phone + Pass)  |   3. RefreshToken (HTTP-only Cookie)
                                     v
                      +-----------------------------+
                      |       Auth API Server       |
                      |   /api/auth/login, register |
                      +--------------+--------------+
                                     |
                       Validate Credentials / Hash
                                     v
                      +-----------------------------+
                      |      User Database / DB     |
                      |      (PostgreSQL / Mongo)   |
                      +-----------------------------+
```

### 4.2 User Roles & Access Matrix (RBAC)

| Role | Target Persona | Accessible Capabilities | Restricted Areas |
| :--- | :--- | :--- | :--- |
| **Guest** | First-time visitor, casual browser | Browse park zones, view menu, test trip calculator, view public galleries | Cannot checkout with saved wallet, cannot view order history, cannot access admin |
| **Parent / Customer** | Registered family user | Buy tickets, save passes to wallet, earn & spend points, book birthday parties, order delivery, view order history | Cannot access media dashboard, cannot validate gate tickets |
| **Cashier / Receptionist** | Park entrance & counter staff | Scan & validate digital wristbands/QR codes, check in table reservations, view booking references, confirm offline payment proofs | Cannot edit website media, cannot modify system configurations |
| **Content Manager** | Marketing & media team | Upload hero banners, manage media library, update attraction photos, clear media cache | Cannot modify financial transactions or manage user roles |
| **Super Administrator** | Park General Manager & IT | Full access: manage user accounts, assign roles, view revenue reports, manage pricing, full media control | None (Full System Authority) |

### 4.3 Authentication Features & Roadmaps
1. **Multi-Identifier Login:**
   - Support login via Email (`user@domain.com`) or Egyptian Mobile Phone Number (`010xxxxxxxx`, `011xxxxxxxx`, `012xxxxxxxx`, `015xxxxxxxx`).
2. **Two-Factor / OTP Verification (Optional for VIP/High-Value Bookings):**
   - 4-to-6 digit OTP sent via SMS or WhatsApp for phone confirmation.
3. **Session Management & Token Refresh:**
   - **Access Token:** Stored in memory / React state (15-minute lifespan).
   - **Refresh Token:** Stored in secure `HTTP-only`, `SameSite=Strict` cookie (7-day lifespan).
   - Silent refresh interceptor configured in `apiClient.js` before access token expiry.
4. **Password Security:**
   - Backend hashing with **Argon2id** or **bcrypt** (minimum work factor 12).
   - Password strength validator (minimum 8 characters, combination of letters and numbers).
5. **Seamless Migration Path from Current Architecture:**
   - The current system already implements `useAuth()` in `src/context/AuthContext.jsx` and `authService.js` supporting `login()`, `register()`, `logout()`, `updateProfile()`, and `addPassToWallet()`.
   - Migration requires **zero component refactoring**: simply replace the mock storage endpoints inside `src/api/authService.js` with live HTTP calls to `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/me`.

---

## 5. Formal Acceptance Criteria (Given - When - Then)

### 5.1 Attraction Zones & Navigation
* **AC-Z01: Responsive Layout Switching**
  * **Given** a user accesses the site from a viewport wider than 768px,
  * **When** the application renders,
  * **Then** the `DesktopAppShell` with `DesktopHeader`, `DesktopSubNav`, and `DesktopFooter` must be rendered.
  * **Given** a user accesses the site from a viewport $\le$ 768px,
  * **When** the application renders,
  * **Then** the `MobileAppShell` with `MobileHeader` and `MobileBottomNav` dock must be rendered without horizontal overflow.

* **AC-Z02: Bilingual Language Toggling**
  * **Given** the user is viewing the page in English,
  * **When** the user clicks the Arabic language button (`عربي`),
  * **Then** `document.documentElement.dir` must immediately change to `"rtl"`, `document.documentElement.lang` to `"ar"`, and all UI text, pricing tags, and navigation items must display in Arabic without reloading the browser.

---

### 5.2 Pass Booking & Cart System
* **AC-C01: Dynamic Cart Calculation**
  * **Given** a user has multiple pass items in the cart,
  * **When** the user increments or decrements pass quantities,
  * **Then** the Total EGP and Total Points must update immediately without latency.
  * **When** quantity reaches 0, the item must be cleanly removed from the cart.

* **AC-C02: Loyalty Points Checkout Validation**
  * **Given** a user chooses to pay using "Loyalty Points",
  * **When** the user's points balance is less than the required cart points,
  * **Then** the checkout button must be disabled, and an alert must clearly state the deficit and prompt for cash payment.
  * **When** the points balance is sufficient and user clicks checkout,
  * **Then** points must be deducted, passes added to wallet, and a success confirmation with confetti displayed.

* **AC-C03: Manual Payment Proof Upload (InstaPay / Vodafone Cash)**
  * **Given** a user selects payment via InstaPay or Vodafone Cash,
  * **When** the user clicks proceed,
  * **Then** the payment proof modal must display the exact transfer handle/number with an instant copy button.
  * **When** the user uploads a receipt screenshot (image file) and inputs their sender phone/account,
  * **Then** the system must accept the submission, generate an order reference, and credit the passes in `Pending Verification` status.

---

### 5.3 School Trips Quotation Engine
* **AC-T01: Auto-Calculation of Complimentary Supervisors**
  * **Given** a trip coordinator inputs a student count $N$,
  * **When** $N \ge 15$,
  * **Then** the system must calculate complimentary supervisors as $\lfloor N / 15 \rfloor$ automatically unless manual override is toggled.

* **AC-T02: Quotation Snapshot Export**
  * **Given** a completed trip estimate form,
  * **When** the user clicks "Download / Capture Official Quote",
  * **Then** `html2canvas` must render the printable quotation card to a high-resolution PNG image and prompt immediate browser download.

* **AC-T03: WhatsApp Itinerary Dispatch**
  * **Given** a generated trip quotation with reference number,
  * **When** the user clicks "Send via WhatsApp",
  * **Then** a new browser tab must open pointing to `https://wa.me/201004928828` with pre-encoded details (School name, student count, package name, shift, total cost, reference number).

---

### 5.4 Restaurant & Food Delivery System
* **AC-R01: Dine-In Table Reservation**
  * **Given** the restaurant overview page,
  * **When** a user submits the table reservation form with valid guest name, phone, date, and party size,
  * **Then** a confirmation message must appear confirming receipt of the reservation.

* **AC-R02: Online Food Delivery Order**
  * **Given** items added to the food cart,
  * **When** the user navigates to the delivery view and submits the delivery address and phone number,
  * **Then** an order confirmation must be generated detailing items, delivery fee, and expected delivery window (35-45 minutes).

---

### 5.5 Admin Media Management Dashboard
* **AC-D01: Media Image Upload to Backend**
  * **Given** an authorized user on the dashboard upload tab,
  * **When** an image file ($<10\text{MB}$) is dropped into the dropzone and a target page and section are selected,
  * **Then** the upload request (`POST /api/media`) must be dispatched with multipart form-data.
  * **When** the server returns `200 OK` or `201 Created`,
  * **Then** a success banner must appear with confetti, and the media library count must increment by 1.

* **AC-D02: Media Deletion**
  * **Given** an item displayed in the live media library,
  * **When** the admin clicks "Delete" and confirms the modal dialog,
  * **Then** a `DELETE /api/media/:id` request must execute, and upon success, the item must be removed from the DOM and cache.

---

### 5.6 Future Authentication Acceptance Criteria
* **AC-A01: User Registration**
  * **Given** an unauthenticated visitor,
  * **When** submitting the registration form with full name, valid Egyptian phone or email, and a password ($\ge 8$ chars),
  * **Then** the system must create the user record, return an auth token, issue a welcome bonus (100 loyalty points), and set the user as active without page refresh.

* **AC-A02: Protected Route & Role Redirection**
  * **Given** a user logged in with role `Parent`,
  * **When** attempting to access `#dashboard` (Admin Media Management),
  * **Then** the system must restrict access, display an "Unauthorized Access (403)" message, and redirect them to their profile or home page.

* **AC-A03: Gatekeeper Digital Pass Verification**
  * **Given** a user logged in with role `Cashier` / `Receptionist`,
  * **When** scanning or entering pass code `PZ-XXXXXX`,
  * **Then** the system must query the pass database:
    * If valid & unused: Mark as `Redeemed`, log redemption timestamp, and display green validation banner.
    * If already used: Display red warning with time and cashier of previous redemption.
    * If expired or invalid: Display error banner.

* **AC-A04: Graceful Session Expiration & Refresh**
  * **Given** a user with an active session whose access token expires,
  * **When** the user performs an authenticated action,
  * **Then** `apiClient` must transparently use the refresh token to obtain a new access token without logging the user out or interrupting their cart checkout.

---

## 6. Non-Functional Requirements (NFRs)

1. **Performance & Page Speed:**
   - First Contentful Paint (FCP) under 1.5 seconds on 4G mobile connections.
   - All high-resolution attraction images must be lazy-loaded using `loading="lazy"` and WebP compression.
2. **Security & Data Protection:**
   - Sensitive user information (passwords, payment receipts) must be transmitted exclusively over TLS 1.3.
   - Anti-CSRF protections on all mutation endpoints (`POST`, `PUT`, `DELETE`).
   - Rate limiting on authentication routes (maximum 5 failed attempts per minute per IP).
3. **Usability & Accessibility:**
   - 100% adherence to bidirectional typography (Alexandria font for Arabic, Montserrat/Inter for English).
   - High color contrast compliant with WCAG 2.1 AA standards for outdoor smartphone viewing.
4. **Reliability & Offline Tolerance:**
   - Graceful degradation when the live backend is unreachable: the client must fallback to preloaded mock data and inform the user gently rather than crashing.

---

## 7. Delivery Roadmap & Milestones

```
+------------------------------------------------------------------------------------+
| MILESTONE 1: Core Showcase & Booking (COMPLETED)                                   |
| - 4 Play Zone Showcase, Attractions, Lazy Loading & Confetti FX                   |
| - Cart checkout, InstaPay/Vodafone Cash proof modal                                |
| - Group trips quote calculation & WhatsApp link                                    |
| - Restaurant table reservation & delivery flow                                     |
| - Bilingual Arabic & English with responsive Desktop/Mobile shells                 |
+------------------------------------------------------------------------------------+
                                         |
                                         v
+------------------------------------------------------------------------------------+
| MILESTONE 2: Live Media CMS Backend (COMPLETED)                                    |
| - Media upload & library sync with Apidog backend                                  |
| - Zero-latency cache invalidation                                                  |
+------------------------------------------------------------------------------------+
                                         |
                                         v
+------------------------------------------------------------------------------------+
| MILESTONE 3: Future Production Authentication & Gate Operations (NEXT)              |
| - Replace mock AuthContext with production JWT & Refresh Token API                 |
| - Role-Based Access Control (RBAC): Super Admin, Staff/Cashier, Parent, Guest      |
| - Cashier gate verification terminal (camera QR code scanning)                     |
| - Real-time customer profile, wallet synchronization & booking history             |
+------------------------------------------------------------------------------------+
```

---
*Document prepared for American Dream Ismailia System Architecture & Engineering Teams.*
