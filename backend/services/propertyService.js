import { getCachedProperty, setCachedProperty } from "./cacheService.js";
import { getStaticSatelliteMapUrl } from "./googleMapsService.js";
import { getPropertyProvider } from "../providers/index.js";
import { resolveAddressSelection } from "./addressService.js";

function getFallbackSatelliteTileUrl(lat, lng) {
  const deltaLon = 0.0012;
  const deltaLat = 0.0009;
  const minLon = lng - deltaLon;
  const maxLon = lng + deltaLon;
  const minLat = lat - deltaLat;
  const maxLat = lat + deltaLat;
  const params = new URLSearchParams({
    bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
    bboxSR: "4326",
    size: "1200,800",
    imageSR: "4326",
    format: "jpg",
    f: "image",
  });
  return `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?${params.toString()}`;
}

function getFallbackSatelliteCandidates(lat, lng) {
  const tight = getFallbackSatelliteTileUrl(lat, lng);
  const paramsWide = new URLSearchParams({
    bbox: `${lng - 0.0025},${lat - 0.0018},${lng + 0.0025},${lat + 0.0018}`,
    bboxSR: "4326",
    size: "1200,800",
    imageSR: "4326",
    format: "jpg",
    f: "image",
  });
  const wide = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?${paramsWide.toString()}`;
  const tileZoom = 18;
  const tileX = Math.floor(((lng + 180) / 360) * 2 ** tileZoom);
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * 2 ** tileZoom);
  const tile = `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${tileZoom}/${tileY}/${tileX}`;
  return [tight, wide, tile];
}

export async function getPropertyData(selectionId) {
  const cacheKey = `place:v9:${selectionId}`;
  const cached = await getCachedProperty(cacheKey);
  if (cached) return { ...cached, cacheHit: true };

  const geocode = await resolveAddressSelection(selectionId);
  const provider = getPropertyProvider();
  const estimated = await provider.enrich(geocode);
  const satelliteImageUrls =
    geocode.provider === "google"
      ? [getStaticSatelliteMapUrl({ lat: geocode.lat, lng: geocode.lng }), ...getFallbackSatelliteCandidates(geocode.lat, geocode.lng)]
      : getFallbackSatelliteCandidates(geocode.lat, geocode.lng);
  const satelliteImageUrl = satelliteImageUrls[0];

  const property = {
    placeId: geocode.placeId,
    formattedAddress: geocode.formattedAddress,
    lat: geocode.lat,
    lng: geocode.lng,
    suburb: geocode.suburb,
    state: geocode.state,
    postcode: geocode.postcode,
    satelliteImageUrl,
    satelliteImageUrls,
    provider: provider.id,
    ...estimated,
  };

  await setCachedProperty(cacheKey, property);
  return { ...property, cacheHit: false };
}

