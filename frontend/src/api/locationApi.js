// src/api/locationApi.js
import client from "./axiosClient.js";

/* ==========================================================
   📌 GET LOCATIONS (Public)
   Supports filters: year, tag, search, pagination
========================================================== */
export const getLocations = async (params = {}) => {
  const res = await client.get("/locations", { params });
  return res.data;
};

/* ==========================================================
   📌 GET LOCATION BY ID
========================================================== */
export const getLocation = async (id) => {
  if (!id) throw new Error("Location ID is required");

  const res = await client.get(`/locations/${encodeURIComponent(id)}`);
  return res.data;
};

/* ==========================================================
   📌 SEARCH LOCATIONS (search bar)
========================================================== */
export const searchLocations = async (query) => {
  const q = query || "";
  const res = await client.get("/locations/search", { params: { q } });
  return res.data;
};

/* ==========================================================
   📌 NEARBY LOCATIONS — Map-based search
   lat/lng required from user's location
========================================================== */
export const getNearby = async ({ lat, lng, radius = 2000 }) => {
  if (!lat || !lng) throw new Error("Latitude and longitude required");

  const res = await client.get("/locations/nearby", {
    params: { lat, lng, radius },
  });

  return res.data;
};

/* ==========================================================
   📤 EXPORT
========================================================== */
export default {
  getLocations,
  getLocation,
  searchLocations,
  getNearby,
};
