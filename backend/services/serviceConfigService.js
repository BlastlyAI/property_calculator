import fs from "fs/promises";
import path from "path";

const CONFIG_PATH = path.resolve(process.cwd(), "backend", "config", "serviceConfigs.json");

let cache = null;

export async function getServiceConfigs() {
  if (cache) return cache;
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  cache = JSON.parse(raw);
  return cache;
}

export async function getServiceConfigById(serviceId) {
  const all = await getServiceConfigs();
  return all.services.find((service) => service.id === serviceId) || null;
}

