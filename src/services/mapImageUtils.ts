export function buildSatelliteCandidates(lat: number, lng: number, zoomLevel = 3): string[] {
  const clampedZoom = Math.max(1, Math.min(6, zoomLevel));
  const zoomScale = 1 / clampedZoom;
  const tight = buildArcGisExport(lat, lng, 0.0012 * zoomScale, 0.0009 * zoomScale);
  const wide = buildArcGisExport(lat, lng, 0.0025 * zoomScale, 0.0018 * zoomScale);
  const tile = buildArcGisTile(lat, lng, 18);
  return [tight, wide, tile];
}

function buildArcGisExport(lat: number, lng: number, deltaLon: number, deltaLat: number): string {
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

function buildArcGisTile(lat: number, lng: number, zoom: number): string {
  const tileX = Math.floor(((lng + 180) / 360) * 2 ** zoom);
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * 2 ** zoom);
  return `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
}

