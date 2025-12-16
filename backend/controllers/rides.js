const Ride = require('../models/ride');

// Get all available rides
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.findAll();
    res.json({ rides });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get rides by driver
const getRidesByDriver = async (req, res) => {
  try {
    const driverId = req.user.userId;
    const rides = await Ride.findByDriver(driverId);
    res.json({ rides });
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new ride (drivers only)
const createRide = async (req, res) => {
  try {
    const { departure, destination, price, availableSeats, departureTime } = req.body;
    const driverId = req.user.userId;

    // Validate input
    if (!departure || !destination || !price || !availableSeats || !departureTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (price <= 0 || availableSeats <= 0) {
      return res.status(400).json({ message: 'Price and seats must be positive' });
    }

    // Create ride
    const ride = await Ride.create({
      driverId,
      departure,
      destination,
      price: parseFloat(price),
      availableSeats: parseInt(availableSeats),
      departureTime
    });

    res.status(201).json({
      message: 'Ride created successfully',
      ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get ride by ID
const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json({ ride });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update ride (driver only)
const updateRide = async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = req.user.userId;
    const updates = req.body;

    // Check if ride exists and belongs to driver
    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver_id !== driverId) {
      return res.status(403).json({ message: 'Not authorized to update this ride' });
    }

    // Update ride
    const updatedRide = await Ride.update(id, updates);

    res.json({
      message: 'Ride updated successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Update ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete ride (driver only)
const deleteRide = async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = req.user.userId;

    // Check if ride exists and belongs to driver
    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver_id !== driverId) {
      return res.status(403).json({ message: 'Not authorized to delete this ride' });
    }

    // Delete ride
    await Ride.delete(id);

    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    console.error('Delete ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search rides
const searchRides = async (req, res) => {
  try {
    const { departure, destination, date } = req.query;

    if (!departure || !destination) {
      return res.status(400).json({ message: 'Departure and destination are required' });
    }

    const rides = await Ride.search(departure, destination, date);

    res.json({ rides });
  } catch (error) {
    console.error('Search rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllRides,
  getRidesByDriver,
  createRide,
  getRideById,
  updateRide,
  deleteRide,
  searchRides
};
