const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create({ name, email, password, phone, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at
    `;
    const values = [name, email, hashedPassword, phone, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, { name, phone }) {
    const query = `
      UPDATE users
      SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, email, phone, role, updated_at
    `;
    const values = [name, phone, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;
