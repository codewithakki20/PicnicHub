// ========================================
// controllers/locations.controller.js
// ========================================
import Location from '../models/Location.js';

// GET all (filters: year, tag, search)
export const getLocations = async (req, res) => {
  try {
    const { year, tag, search } = req.query;
    const query = {};
    if (year) query.yearTags = { $in: [parseInt(year)] };
    if (tag) query.tags = { $in: [tag] };
    if (search) query.$text = { $search: search };

    const locations = await Location.find(query).sort({ createdAt: -1 }).lean();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single by id or slug
export const getLocation = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    const location = (await Location.findById(idOrSlug)) || (await Location.findOne({ slug: idOrSlug }));
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Nearby locations
// Nearby locations (Bounding Box approximation)
export const getNearbyLocations = async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng are required' });

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const rad = parseInt(radius); // meters

    // 1 deg lat ~= 111km
    // 1 deg lng ~= 111km * cos(lat)
    const rEarth = 6378137; // meters
    const latDelta = (rad / rEarth) * (180 / Math.PI);
    const lngDelta = (rad / (rEarth * Math.cos(Math.PI * centerLat / 180))) * (180 / Math.PI);

    const locations = await Location.find({
      "coords.lat": { $gte: centerLat - latDelta, $lte: centerLat + latDelta },
      "coords.lng": { $gte: centerLng - lngDelta, $lte: centerLng + lngDelta }
    }).lean();

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Text search
export const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = await Location.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).lean();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default { getLocations, getLocation, getNearbyLocations, searchLocations };
