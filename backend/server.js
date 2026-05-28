import "./bootstrap/env.js";
import express from "express";
import cors from "cors";
import { resolveAddressText, searchAddresses } from "./services/addressService.js";
import { getPropertyData } from "./services/propertyService.js";
import { buildQuote } from "./services/quoteEngine.js";
import { getServiceConfigs } from "./services/serviceConfigService.js";
import { fail, ok } from "./contracts/responseFactory.js";
import { createBooking } from "./services/bookingService.js";
import { getSupabaseAdminClient, getSupabaseConfigStatus, initSupabaseClient } from "./lib/supabaseClient.js";
import { getStripeConfigStatus } from "./services/stripeService.js";
import { confirmPaymentForBooking, getPaymentConfig, startPaymentForBooking } from "./services/paymentService.js";
import { paymentLog } from "./lib/paymentDebug.js";
import adminRouter, { publicLeadRouter } from "./routes/adminRoutes.js";
import { markLeadConverted } from "./services/leadService.js";

const app = express();
const port = Number(process.env.PORT || process.env.BACKEND_PORT || 3002);
const supabaseBootConfig = getSupabaseConfigStatus();

app.use(cors());
app.use(express.json());

function errorResponse(res, error) {
  const code = error.code || "INTERNAL_ERROR";
  const status =
    code === "VALIDATION_ERROR" || code === "PAYMENT_MISMATCH" || code === "PAYMENT_INCOMPLETE" ? 400 : 500;
  return res.status(status).json(fail(error.message || "Internal server error", code, error.details || null));
}

app.get("/api/places/autocomplete", async (req, res) => {
  try {
    const input = String(req.query.input || "").trim();
    if (input.length < 3) return res.json(ok({ predictions: [] }));
    const { provider, predictions } = await searchAddresses(input);
    return res.json(ok({ predictions }, { provider }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
});

app.get("/api/places/resolve-text", async (req, res) => {
  try {
    const input = String(req.query.input || "").trim();
    if (input.length < 3) return res.status(400).json(fail("input is required", "BAD_REQUEST"));
    const address = await resolveAddressText(input);
    return res.json(ok({ address }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
});

app.get("/api/property-data", async (req, res) => {
  try {
    const placeId = String(req.query.placeId || "").trim();
    if (!placeId) return res.status(400).json(fail("placeId is required", "BAD_REQUEST"));
    const property = await getPropertyData(placeId);
    const serviceId = String(req.query.service || "house");
    const quote = await buildQuote({ serviceId, property, answers: {} });
    return res.json(ok({ property, quote }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
});

app.post("/api/quote", async (req, res) => {
  try {
    const { serviceId = "house", property, answers = {} } = req.body || {};
    if (!property) return res.status(400).json(fail("property is required", "BAD_REQUEST"));
    const quote = await buildQuote({ serviceId, property, answers });
    return res.json(ok({ quote }));
  } catch (error) {
    return res.status(500).json(fail(error.message));
  }
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const config = getSupabaseConfigStatus();
    if (!config.isConfigured) {
      return res.status(500).json(
        fail("Supabase is not fully configured", "SUPABASE_CONFIG_MISSING", {
          required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
          current: config,
        }),
      );
    }

    const supabase = getSupabaseAdminClient();
    const tableChecks = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("quotes").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("properties").select("id", { count: "exact", head: true }),
    ]);

    const names = ["bookings", "quotes", "customers", "properties"];
    const tables = names.map((table, idx) => {
      const result = tableChecks[idx];
      return {
        table,
        available: !result.error,
        error: result.error?.message || null,
      };
    });

    const dbHealthy = tables.every((entry) => entry.available);
    return res.json(
      ok({
        connection: "connected",
        dbHealth: dbHealthy ? "healthy" : "degraded",
        tables,
      }),
    );
  } catch (error) {
    return errorResponse(res, error);
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await createBooking(payload);
    if (payload.sessionId) {
      await markLeadConverted({ sessionId: payload.sessionId, bookingId: result.booking.id }).catch(() => null);
    }
    return res.status(201).json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

app.use("/api/leads", publicLeadRouter);
app.use("/api/admin", adminRouter);

app.get("/api/payments/config", (_req, res) => {
  try {
    const stripeConfig = getStripeConfigStatus();
    if (!stripeConfig.isConfigured) {
      return res.status(500).json(
        fail("Stripe is not fully configured", "STRIPE_CONFIG_MISSING", {
          required: ["STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"],
          current: stripeConfig,
        }),
      );
    }
    return res.json(ok(getPaymentConfig()));
  } catch (error) {
    return errorResponse(res, error);
  }
});

app.post("/api/payments/create-intent", async (req, res) => {
  try {
    const { bookingId, customerEmail } = req.body || {};
    const session = await startPaymentForBooking({ bookingId, customerEmail });
    return res.json(ok(session));
  } catch (error) {
    return errorResponse(res, error);
  }
});

app.post("/api/payments/confirm", async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body || {};
    const result = await confirmPaymentForBooking({ bookingId, paymentIntentId });
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

app.get("/api/service-configs", async (_req, res) => {
  const configs = await getServiceConfigs();
  res.json(ok(configs));
});

app.listen(port, () => {
  console.log(`[Supabase] SUPABASE_URL detected: ${supabaseBootConfig.hasUrl}`);
  console.log(`[Supabase] SUPABASE_ANON_KEY detected: ${supabaseBootConfig.hasAnonKey}`);
  console.log(`[Supabase] SUPABASE_SERVICE_ROLE_KEY detected: ${supabaseBootConfig.hasServiceRoleKey}`);
  console.log(`[Supabase] client initialized: ${initSupabaseClient()}`);
  const stripeConfig = getStripeConfigStatus();
  console.log(`[Stripe] publishable key detected: ${stripeConfig.hasPublishableKey}`);
  console.log(`[Stripe] secret key detected: ${stripeConfig.hasSecretKey}`);
  console.log(`[Stripe] client ready: ${stripeConfig.isConfigured}`);
  paymentLog("debug logging enabled (set PAYMENT_DEBUG=false to disable)");
  console.log(`Backend listening on http://localhost:${port}`);
});

