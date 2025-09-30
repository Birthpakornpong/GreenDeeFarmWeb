// lib/sqlite.js - SQLite fallback database
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

let db = null;

// Initialize SQLite database
export async function initSQLite() {
  if (db) return db;
  
  try {
    db = await open({
      filename: './dev.db',
      driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ SQLite database initialized');
    return db;
  } catch (error) {
    console.error('❌ SQLite initialization failed:', error);
    throw error;
  }
}

// SQLite User operations
export const sqliteUserOperations = {
  async createUser(userData) {
    const db = await initSQLite();
    const { username, email, password, full_name, phone, address } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, full_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, phone, address]
    );
    
    return { id: result.lastID, username, email, full_name, phone, address };
  },

  async findByUsername(username) {
    const db = await initSQLite();
    return await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
  },

  async findByEmail(email) {
    const db = await initSQLite();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  async findById(id) {
    const db = await initSQLite();
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
  }
};

export default { initSQLite, sqliteUserOperations };