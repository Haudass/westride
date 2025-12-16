const pool = require('../config/database');

class Booking {
  // Create a new booking
  static async create({ passengerId, rideId, seatsBooked }) {
    const query = `
      INSERT INTO bookings (passenger_id, ride_id, seats_booked, status, payment_status)
      VALUES ($1, $2, $3, 'confirmed', 'pending')
      RETURNING id, passenger_id, ride_id, seats_booked, status, payment_status, created_at
    `;
    const values = [passengerId, rideId, seatsBooked];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find bookings by passenger
  static async findByPassenger(passengerId) {
    const query = `
      SELECT b.*, r.departure, r.destination, r.price, r.departure_time, u.name as driver_name
      FROM bookings b
      JOIN rides r ON b.ride_id = r.id
      JOIN users u ON r.driver_id = u.id
      WHERE b.passenger_id = $1
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query, [passengerId]);
    return result.rows;
  }

  // Find bookings by ride
  static async findByRide(rideId) {
    const query = `
      SELECT b.*, u.name as passenger_name, u.phone as passenger_phone
      FROM bookings b
      JOIN users u ON b.passenger_id = u.id
      WHERE b.ride_id = $1
      ORDER BY b.created_at ASC
    `;
    const result = await pool.query(query, [rideId]);
    return result.rows;
  }

  // Find booking by ID
  static async findById(id) {
    const query = `
      SELECT b.*, r.departure, r.destination, r.price, r.departure_time,
             u1.name as passenger_name, u2.name as driver_name
      FROM bookings b
      JOIN rides r ON b.ride_id = r.id
      JOIN users u1 ON b.passenger_id = u1.id
      JOIN users u2 ON r.driver_id = u2.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update booking status
  static async updateStatus(id, status) {
    const query = `
      UPDATE bookings
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus) {
    const query = `
      UPDATE bookings
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentStatus, id]);
    return result.rows[0];
  }

  // Cancel booking
  static async cancel(id) {
    const query = `
      UPDATE bookings
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Booking;
