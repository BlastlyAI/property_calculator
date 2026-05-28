import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { resolveAddressText, searchAddresses } from "./services/addressService.js";
import { getPropertyData } from "./services/propertyService.js";
import { buildQuote } from "./services/quoteEngine.js";
import { getServiceConfigs } from "./services/serviceConfigService.js";
import { fail, ok } from "./contracts/responseFactory.js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const port = Number(process.env.BACKEND_PORT || 3002);

app.use(cors());
app.use(express.json());

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

app.get("/api/service-configs", async (_req, res) => {
  const configs = await getServiceConfigs();
  res.json(ok(configs));
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

