import { autocompleteAddress, geocodeByPlaceId } from "../../services/googleMapsService.js";

export const googleProvider = {
  id: "google",
  async search(input) {
    const predictions = await autocompleteAddress(input);
    return predictions.map((item) => ({
      ...item,
      provider: "google",
    }));
  },
  async resolve(selectionId) {
    const geocode = await geocodeByPlaceId(selectionId);
    return {
      ...geocode,
      provider: "google",
    };
  },
};

