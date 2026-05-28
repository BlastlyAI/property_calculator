import fs from "fs/promises";
import path from "path";

const RULES_PATH = path.resolve(process.cwd(), "backend", "config", "propertyEstimatorRules.json");

let cachedRules = null;

async function getRules() {
  if (cachedRules) return cachedRules;
  const raw = await fs.readFile(RULES_PATH, "utf8");
  cachedRules = JSON.parse(raw);
  return cachedRules;
}

function seededValue(seed, min = 0, max = 1) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const normalized = x - Math.floor(x);
  return min + normalized * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function detectDensity(geocode) {
  const text = `${geocode.formattedAddress || ""} ${geocode.suburb || ""}`.toLowerCase();
  const highSignals = ["city", "cbd", "downtown", "central", "inner", "district"];
  const lowSignals = ["village", "estate", "rural", "farm", "acre", "outskirts"];
  if (highSignals.some((s) => text.includes(s))) return "high";
  if (lowSignals.some((s) => text.includes(s))) return "low";

  // Latitude-based rough metro heuristic: dense around common metro belts.
  const lat = Math.abs(geocode.lat || 0);
  if (lat > 20 && lat < 40) return "medium";
  return "low";
}

function detectLandmarkType(geocode) {
  const text = `${geocode.formattedAddress || ""}`.toLowerCase();
  const markers = [
    { type: "government", words: ["white house", "parliament", "secretariat", "embassy", "ministry", "court", "capitol"] },
    { type: "commercial", words: ["mall", "plaza", "tower", "office", "business park", "hotel", "airport", "hospital"] },
    { type: "landmark", words: ["museum", "stadium", "memorial", "monument", "university", "campus"] },
  ];
  for (const group of markers) {
    if (group.words.some((word) => text.includes(word))) return group.type;
  }
  return null;
}

function detectNonResidential(geocode) {
  const type = `${geocode.osmType || ""}`.toLowerCase();
  const cls = `${geocode.osmClass || ""}`.toLowerCase();
  const addrType = `${geocode.osmAddressType || ""}`.toLowerCase();
  const buildingTag = `${geocode.extratags?.building || ""}`.toLowerCase();
  const amenity = `${geocode.extratags?.amenity || ""}`.toLowerCase();
  const landmarkType = detectLandmarkType(geocode);
  const combined = `${type} ${cls} ${addrType} ${buildingTag} ${amenity}`;

  const nonResidentialSignals = [
    "commercial",
    "retail",
    "office",
    "hospital",
    "government",
    "industrial",
    "school",
    "college",
    "university",
    "hotel",
    "stadium",
    "museum",
    "airport",
    "station",
    "public",
    "civic",
  ];
  const isNonResidential = Boolean(landmarkType) || nonResidentialSignals.some((token) => combined.includes(token));
  return {
    isNonResidential,
    category: landmarkType || (isNonResidential ? "commercial" : "residential"),
  };
}

function isResidentialLikeLandmark(geocode, nonResidentialCategory) {
  const text = `${geocode.formattedAddress || ""}`.toLowerCase();
  const buildingTag = `${geocode.extratags?.building || ""}`.toLowerCase();
  const residentialSignals = ["white house", "residence", "palace", "villa", "house"];
  if (nonResidentialCategory === "government" && residentialSignals.some((token) => text.includes(token))) {
    return true;
  }
  return /(residential|house|apartments|detached|villa|bungalow)/.test(buildingTag);
}

function inferTypeFromOsm(geocode) {
  const type = `${geocode.osmType || ""}`.toLowerCase();
  const addressType = `${geocode.osmAddressType || ""}`.toLowerCase();
  const klass = `${geocode.osmClass || ""}`.toLowerCase();
  const buildingTag = `${geocode.extratags?.building || ""}`.toLowerCase();
  const merged = `${type} ${addressType} ${klass} ${buildingTag}`;
  if (/(apartment|apartments|flat|residential)/.test(merged)) return "unit";
  if (/(terrace|townhouse|row)/.test(merged)) return "townhouse";
  if (/(house|detached|semidetached|bungalow|villa)/.test(merged)) return "house";
  return null;
}

function pickWeighted(weightMap, seed) {
  const roll = seededValue(seed, 0, 1);
  let cumulative = 0;
  for (const [key, weight] of Object.entries(weightMap)) {
    cumulative += weight;
    if (roll <= cumulative) return key;
  }
  return Object.keys(weightMap)[0];
}

function inferSizeBand(houseSizeSqm) {
  if (houseSizeSqm < 105) return "small";
  if (houseSizeSqm < 210) return "medium";
  return "large";
}

function estimateBedrooms(houseSizeSqm, propertyType) {
  const base = Math.max(1, Math.round(houseSizeSqm / 55));
  if (propertyType === "unit") return Math.min(4, base);
  if (propertyType === "townhouse") return Math.min(5, base + 1);
  return Math.min(6, base + 1);
}

function estimateLargeResidenceBedrooms(houseSizeSqm, levels) {
  const levelBonus = Math.max(0, levels - 1) * 2;
  return clamp(Math.round(houseSizeSqm / 65) + levelBonus, 6, 30);
}

function estimateBathrooms(bedrooms, houseSizeSqm) {
  const baseline = bedrooms <= 2 ? 1 : bedrooms <= 4 ? 2 : 3;
  return Math.max(1, Math.min(4, baseline + (houseSizeSqm > 260 ? 1 : 0)));
}

function estimateFootprint(geocode, density) {
  const seed = Math.abs((geocode.lat || 0) * 2000 + (geocode.lng || 0) * 1700);
  const importance = Number(geocode.osmImportance || 0);
  const levelsRaw = Number(geocode.extratags?.["building:levels"] || geocode.extratags?.levels || 0);
  const levels = Number.isFinite(levelsRaw) && levelsRaw > 0 ? levelsRaw : seededValue(seed + 21.1, 1, density === "high" ? 5 : 3);

  const baseFootprint =
    density === "high"
      ? seededValue(seed + 20.7, 70, 260)
      : density === "medium"
        ? seededValue(seed + 20.7, 120, 420)
        : seededValue(seed + 20.7, 180, 640);
  const footprintSqm = Math.round(baseFootprint * (1 + clamp(importance, 0, 0.6)));
  const grossBuiltAreaSqm = Math.round(footprintSqm * levels);
  return { footprintSqm, levels, grossBuiltAreaSqm };
}

function resolveConfidence({ isNonResidential, geocode, hasLevels }) {
  const hasPostcode = Boolean(geocode.postcode);
  const hasSuburb = Boolean(geocode.suburb);
  const hasOsmType = Boolean(geocode.osmType || geocode.osmAddressType);
  if (hasLevels && hasPostcode && hasSuburb && hasOsmType) return "high";
  if ((hasPostcode && hasSuburb) || (isNonResidential && hasOsmType)) return "medium";
  return "low";
}

export async function estimatePropertyDetails(geocode) {
  const rules = await getRules();
  const density = detectDensity(geocode);
  const nonResidential = detectNonResidential(geocode);
  const seed = Math.abs((geocode.lat || 0) * 1000 + (geocode.lng || 0) * 1000);
  const densityRule = rules.density[density];
  const footprint = estimateFootprint(geocode, density);

  const propertyTypeFromAddress = (() => {
    const lower = (geocode.formattedAddress || "").toLowerCase();
    if (lower.includes("unit") || lower.includes("apt") || lower.includes("apartment")) return "unit";
    if (lower.includes("townhouse") || lower.includes("row house")) return "townhouse";
    return null;
  })();
  const propertyTypeFromOsm = inferTypeFromOsm(geocode);

  const propertyType =
    propertyTypeFromOsm ||
    propertyTypeFromAddress ||
    pickWeighted(rules.propertyTypeWeights[density], seed + 1.7);

  let houseSizeSqm = Math.round(
    clamp(
      seededValue(seed + 3.1, densityRule.houseSizeRange[0], densityRule.houseSizeRange[1]) +
        footprint.levels * seededValue(seed + 3.7, 4, 18),
      45,
      nonResidential.isNonResidential ? 1200 : 520,
    ),
  );
  const landMultiplier =
    propertyType === "unit"
      ? seededValue(seed + 4.2, 1.05, 1.4)
      : seededValue(seed + 4.2, densityRule.landMultiplierRange[0], densityRule.landMultiplierRange[1]);
  const landSizeSqm = Math.round(houseSizeSqm * landMultiplier);
  const sizeBand = inferSizeBand(houseSizeSqm);

  const levelsRaw = geocode.extratags?.["building:levels"] || geocode.extratags?.levels || null;
  const parsedLevels = Number(levelsRaw);
  const storeysChance = rules.storeysChance[propertyType] || 0.25;
  const storeys =
    Number.isFinite(parsedLevels) && parsedLevels > 1
      ? "double"
      : seededValue(seed + 7.3) <= storeysChance
        ? "double"
        : "single";
  const resolvedLevels =
    Number.isFinite(parsedLevels) && parsedLevels > 0
      ? parsedLevels
      : storeys === "double"
        ? 2
        : 1;
  const residentialLike = isResidentialLikeLandmark(geocode, nonResidential.category);
  const allowResidentialCounts = !nonResidential.isNonResidential || residentialLike;
  if (residentialLike && nonResidential.category === "government") {
    // Government residences are typically very large compounds.
    houseSizeSqm = Math.max(houseSizeSqm, Math.round(clamp(footprint.grossBuiltAreaSqm * 0.55, 650, 2600)));
  }

  const bedrooms = allowResidentialCounts
    ? houseSizeSqm > 420
      ? estimateLargeResidenceBedrooms(houseSizeSqm, resolvedLevels)
      : estimateBedrooms(houseSizeSqm, propertyType)
    : 0;
  const bathrooms = allowResidentialCounts ? estimateBathrooms(bedrooms, houseSizeSqm) : 0;

  const gardenRatio =
    propertyType === "unit"
      ? seededValue(seed + 8.8, 0.02, 0.12)
      : seededValue(seed + 8.8, densityRule.gardenRatioRange[0], densityRule.gardenRatioRange[1]);
  const gardenSizeSqm = Math.max(0, Math.round(landSizeSqm * gardenRatio));

  const windowEstimate = Math.max(
    nonResidential.isNonResidential ? 8 : 4,
    Math.round(
      (nonResidential.isNonResidential ? footprint.footprintSqm / 20 : bedrooms * densityRule.windowPerBedroom) +
        bathrooms * 1.25 +
        (storeys === "double" ? 4 : 1) +
        seededValue(seed + 9.1, -1.5, 2.2),
    ),
  );

  const carpetedRoomsEstimate =
    !allowResidentialCounts
      ? 0
      : propertyType === "unit"
      ? Math.max(1, Math.round(bedrooms * seededValue(seed + 10.2, 0.7, 1.1)))
      : Math.max(1, Math.round(bedrooms * seededValue(seed + 10.2, 0.8, 1.25)));

  const poolChance = nonResidential.isNonResidential || propertyType === "unit" ? 0 : densityRule.poolChance;
  const hasPool = seededValue(seed + 11.7) < poolChance;
  const poolSizeSqm = hasPool ? Math.round(seededValue(seed + 12.5, 14, 42)) : 0;
  const confidence = resolveConfidence({
    isNonResidential: nonResidential.isNonResidential,
    geocode,
    hasLevels: Number.isFinite(parsedLevels),
  });

  return {
    propertyType,
    occupancyCategory: residentialLike ? "government-residence" : nonResidential.category,
    isResidential: allowResidentialCounts,
    sizeBand,
    bedrooms,
    bathrooms,
    houseSizeSqm,
    landSizeSqm,
    storeys,
    gardenSizeSqm,
    windowEstimate,
    carpetedRoomsEstimate,
    hasPool,
    poolSizeSqm,
    estimationMeta: {
      confidenceScore: confidence,
      density,
      estimatedFrom: ["osm", "heuristics", "landmark-detection"],
      signalsUsed: ["geocoding", "suburb-density", "osm-building-tags", "heuristic-footprint", "config-rules"],
      footprintSqm: footprint.footprintSqm,
      builtAreaSqm: footprint.grossBuiltAreaSqm,
    },
  };
}

