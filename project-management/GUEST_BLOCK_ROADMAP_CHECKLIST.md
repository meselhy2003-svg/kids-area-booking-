# Guest Block Sprint Checklist & Backlog

**Goal:** Finalize 100% of the Guest Block (No Payment Gateways, WhatsApp Closure, Points).

- [x] **Restaurant Table Booking**
  - [x] Date, time slot, guest count, and area selectors
  - [x] Form submission with reference generation (`AD-TBL-XXXX`)
  - [x] Direct WhatsApp booking confirmation dispatch
- [x] **Food & Drink Delivery Ordering**
  - [x] Category browsing & item addition
  - [x] Delivery address, phone number, and notes collection
  - [x] Automatic 25 EGP delivery fee addition
  - [x] WhatsApp order dispatch with itemized summary
- [x] **Zero Gateways / Manual Transfer Proof**
  - [x] InstaPay IPA handle display & 1-click copy
  - [x] Vodafone Cash number display & 1-click copy
  - [x] Screenshot/receipt drag & drop upload
  - [x] Sender account/phone input
  - [x] `Pending Verification` status reference
- [x] **Points & Loyalty System**
  - [x] Points balance display (2,250 PTS badge)
  - [x] Redeem points for passes
  - [x] 10% loyalty cashback points on cash purchases
  - [x] 100 points welcome bonus on sign-up
- [ ] **WhatsApp Deal-Closing Unification (Remaining Work)**
  - [ ] Add "Send Order & Reference to WhatsApp" directly from the Cart payment proof confirmation screen
  - [ ] Add "Confirm Package on WhatsApp" to `MobileModals.jsx` upon booking completion
  - [ ] Optional: Add InstaPay/Vodafone Cash screenshot upload to food delivery before WhatsApp dispatch
