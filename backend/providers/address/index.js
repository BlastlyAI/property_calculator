import { googleProvider } from "./googleProvider.js";
import { nominatimProvider } from "./nominatimProvider.js";

const providers = {
  nominatim: nominatimProvider,
  google: googleProvider,
};

export function getAddressProvider() {
  const key = (process.env.ADDRESS_PROVIDER || "nominatim").toLowerCase();
  return providers[key] || providers.nominatim;
}

