const { pool } = require('../config/dbConfig');

class School {
  constructor(school) {
    this.name = school.name;
    this.address = school.address;
    this.latitude = school.latitude;
    this.longitude = school.longitude;
  }

  static async create(newSchool) {
    try {
      const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
      const [result] = await pool.execute(query, [
        newSchool.name,
        newSchool.address,
        newSchool.latitude,
        newSchool.longitude
      ]);
      return { id: result.insertId, ...newSchool };
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM schools');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = School;