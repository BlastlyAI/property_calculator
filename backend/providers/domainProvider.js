export const domainProvider = {
  id: "domain",
  async enrich(_geocode) {
    throw new Error("Domain provider is not configured yet.");
  },
};

