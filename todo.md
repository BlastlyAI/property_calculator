# HomeSnap — TODO

## Completed (Ported from Blastly project)

- [x] Standalone React project set up at /home/ubuntu/homesnap
- [x] All 14 screens ported from Blastly project
- [x] All 3 shared components ported (AriaWidget, CalculatorShell, Logo)
- [x] wouter → react-router-dom migration complete
- [x] All /homesnap/* route prefixes removed (now root-relative)
- [x] BrowserRouter configured in App.tsx
- [x] Dev server running on port 3001 with allowedHosts: true
- [x] index.html updated with HomeSnap branding

## Consumer Calculator Flow (Design Screens)

- [x] Homepage (/) — marketing page with hero, how it works, services, B2B CTA
- [x] CalcScreen1 (/calculator/1) — address + service type selection
- [x] CalcScreen2 (/calculator/2) — property auto-population preview
- [x] CalcScreen3 (/calculator/3) — property details confirmation
- [x] CalcScreen4 (/calculator/4) — instant quote estimate
- [x] CalcScreen5 (/calculator/5) — booking form
- [x] CalcConfirm (/calculator/confirm) — booking confirmation
- [x] EmbedDemo (/embed-demo) — embed widget demo

## Business Onboarding Flow (Design Screens)

- [x] BusinessSignup (/business/signup) — sign up form with service type + GMB
- [x] BusinessPreview (/business/preview) — GMB auto-population animation
- [x] BusinessSuccess (/business/success) — calculator live with URL + embed code + QR
- [x] BusinessUpsell (/business/upsell) — Blastly upsell with website style selector
- [x] BusinessDashboard (/business/dashboard) — leads table, stats, calculator settings
- [x] BusinessDemoCalculator (/business/demo-calculator) — branded calculator demo

## Pending (Backend Wiring — for Rishi)

- [ ] Connect real property lookup API (currently mocked)
- [ ] Real Stripe payment for $149/month business subscription
- [ ] Lead capture to database (currently design-only)
- [ ] Real embed script generation
- [ ] Auth for business dashboard
- [ ] Domain: point homesnap.house to deployed project
