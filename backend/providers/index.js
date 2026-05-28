import { mockProvider } from "./mockProvider.js";
import { domainProvider } from "./domainProvider.js";
import { corelogicProvider } from "./corelogicProvider.js";

const providers = {
  mock: mockProvider,
  domain: domainProvider,
  corelogic: corelogicProvider,
};

export function getPropertyProvider() {
  const providerKey = (process.env.PROPERTY_DATA_PROVIDER || "mock").toLowerCase();
  return providers[providerKey] || providers.mock;
}

