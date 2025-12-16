const express = require('express');
const {
  createBooking,
  getBookingsByPassenger,
  getBookingsByRide,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookings');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// Create booking
router.post('/', createBooking);

// Get bookings by passenger
router.get('/passenger', getBookingsByPassenger);

// Get bookings by ride (for drivers)
router.get('/ride/:rideId', getBookingsByRide);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status (for drivers)
router.put('/:id/status', updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', cancelBooking);

module.exports = router;
