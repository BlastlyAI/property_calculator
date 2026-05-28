import { getAddressProvider } from "../providers/address/index.js";

export async function searchAddresses(input) {
  const provider = getAddressProvider();
  const predictions = await provider.search(input);
  return { provider: provider.id, predictions };
}

export async function resolveAddressSelection(selectionId) {
  const provider = getAddressProvider();
  const resolved = await provider.resolve(selectionId);
  return { provider: provider.id, ...resolved };
}

export async function resolveAddressText(input) {
  const provider = getAddressProvider();
  const predictions = await provider.search(input);
  if (!predictions.length) {
    throw new Error("No address match found for the entered text.");
  }
  const first = predictions[0];
  const queryHasNumber = /\d/.test(input);
  const resultHasNumber = /\d/.test(first.formattedAddress || first.description || "");
  const matchQuality = queryHasNumber && !resultHasNumber ? "near" : "exact";
  if (first.lat && first.lng && first.formattedAddress) {
    return {
      provider: first.provider || provider.id,
      placeId: first.placeId,
      formattedAddress: first.formattedAddress,
      lat: first.lat,
      lng: first.lng,
      suburb: first.suburb || null,
      state: first.state || null,
      postcode: first.postcode || null,
      matchQuality,
    };
  }
  const resolved = await provider.resolve(first.placeId);
  return { provider: provider.id, ...resolved, matchQuality };
}

