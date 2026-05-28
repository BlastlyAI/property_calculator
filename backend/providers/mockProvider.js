import { estimatePropertyDetails } from "../services/propertyEstimatorService.js";

export const mockProvider = {
  id: "mock",
  async enrich(geocode) {
    const estimated = await estimatePropertyDetails(geocode);

    return {
      ...estimated,
      providerMeta: { source: "mockProvider", confidence: "estimated" },
    };
  },
};

