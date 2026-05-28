import { getServiceConfigById } from "./serviceConfigService.js";

function withRange(base, spread = 0.12) {
  const low = Math.max(50, Math.round(base * (1 - spread)));
  const high = Math.max(low + 5, Math.round(base * (1 + spread)));
  return { low, high };
}

function estimateForHouse(cfg, property, answers) {
  const sizeKey = answers?.size || property.sizeBand || "medium";
  let total = cfg.baseBySize[sizeKey] || cfg.baseBySize.medium;
  total += (property.bedrooms || 3) * cfg.perBedroom;
  total += (property.bathrooms || 2) * cfg.perBathroom;
  total *= cfg.conditionMultiplier[answers?.condition || "average"] || 1;
  total *= cfg.petsMultiplier[answers?.pets ? "yes" : "no"] || 1;
  for (const extra of answers?.extras || []) total += cfg.extras[extra] || 0;
  return withRange(total);
}

function estimateForCarpet(cfg, property, answers) {
  const rooms = answers?.rooms || property.carpetedRoomsEstimate || Math.max(1, property.bedrooms || 3);
  let total = cfg.base + rooms * cfg.perRoom;
  total *= cfg.stainMultiplier[answers?.stain || "light"] || 1;
  for (const extra of answers?.extras || []) total += cfg.extras[extra] || 0;
  return withRange(total);
}

function estimateForWindows(cfg, property, answers) {
  const windowCount = answers?.windowCount || property.windowEstimate || 14;
  let total = cfg.base + windowCount * cfg.perWindow;
  total *= cfg.scopeMultiplier[answers?.scope || "exterior"] || 1;
  total *= cfg.hardAccessMultiplier[answers?.hardAccess ? "yes" : "no"] || 1;
  for (const extra of answers?.extras || []) total += cfg.extras[extra] || 0;
  return withRange(total);
}

export async function buildQuote({ serviceId, property, answers }) {
  const service = await getServiceConfigById(serviceId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);
  const cfg = service.quoteRules;
  if (serviceId === "house") return estimateForHouse(cfg, property, answers);
  if (serviceId === "carpet") return estimateForCarpet(cfg, property, answers);
  if (serviceId === "windows") return estimateForWindows(cfg, property, answers);
  throw new Error(`Quote rules not implemented for service: ${serviceId}`);
}

