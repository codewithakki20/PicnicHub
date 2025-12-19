import express from 'express';
import {
  getLocations,
  getLocation,
  getNearbyLocations,
  searchLocations
} from '../controllers/locations.controller.js';

const router = express.Router();

router.get('/', getLocations);
router.get('/search', searchLocations);
router.get('/nearby', getNearbyLocations);
router.get('/:id', getLocation);

export default router;
