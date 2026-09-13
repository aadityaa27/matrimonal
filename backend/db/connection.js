import mysql from 'mysql2/promise';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

let mysqlPool = null;
let sqliteDb = null;
let activeDriver = 'sqlite'; // 'mysql' or 'sqlite'

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'bandhan',
  password: process.env.DB_PASSWORD || 'bandhan123',
  database: process.env.DB_NAME || 'bandhan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

/**
 * Initialize Database Connection
 */
export async function initDatabase() {
  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    try {
      console.log(`[DB] Attempting MySQL connection to ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
      mysqlPool = mysql.createPool(DB_CONFIG);
      const [rows] = await mysqlPool.query('SELECT 1 + 1 AS result');
      console.log('[DB] Connected to MySQL 8 database successfully!');
      activeDriver = 'mysql';
      return;
    } catch (err) {
      console.warn('[DB] MySQL connection failed. Falling back to local embedded database:', err.message);
    }
  }

  // Fallback to SQLite (Node 22 native DatabaseSync) for local dev/preview
  console.log('[DB] Initializing local SQLite database...');
  const dbPath = path.join(process.cwd(), 'matrimonial.db');
  sqliteDb = new DatabaseSync(dbPath);
  activeDriver = 'sqlite';

  initSqliteSchemaAndSeed();
}

/**
 * Initialize SQLite schema and seed data matching MySQL schema
 */
function initSqliteSchemaAndSeed() {
  // Check if existing schema is legacy and needs migration
  try {
    const check = sqliteDb.prepare("SELECT user_id FROM profiles LIMIT 1").get();
  } catch (err) {
    console.log('[DB] Upgrading database schema to Bandhan Matrimonial tables...');
    sqliteDb.exec(`
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS interests;
      DROP TABLE IF EXISTS profiles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS cities;
      DROP TABLE IF EXISTS accounts;
      DROP TABLE IF EXISTS photos;
    `);
  }

  // Create tables
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL,
      state TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(city_name, state)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      gender TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      occupation TEXT,
      education TEXT,
      height TEXT,
      religion TEXT,
      annual_income TEXT,
      about TEXT,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Check if seed needed
  let userCount = 0;
  try {
    userCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM users').get().count;
  } catch (e) {
    userCount = 0;
  }
  if (userCount === 0) {
    seedSqliteData();
  }
}

/**
 * Seed SQLite database with standard Indian matrimonial demo dataset
 */
export function seedSqliteData() {
  sqliteDb.exec('DELETE FROM messages;');
  sqliteDb.exec('DELETE FROM interests;');
  sqliteDb.exec('DELETE FROM profiles;');
  sqliteDb.exec('DELETE FROM users;');
  sqliteDb.exec('DELETE FROM cities;');

  // Cities
  const cities = [
    ['Indore', 'Madhya Pradesh'],
    ['Bhopal', 'Madhya Pradesh'],
    ['Gwalior', 'Madhya Pradesh'],
    ['Delhi', 'Delhi NCR'],
    ['Noida', 'Uttar Pradesh'],
    ['Jaipur', 'Rajasthan'],
    ['Mumbai', 'Maharashtra'],
    ['Pune', 'Maharashtra'],
    ['Bengaluru', 'Karnataka'],
    ['Lucknow', 'Uttar Pradesh'],
  ];
  const cityStmt = sqliteDb.prepare('INSERT INTO cities (city_name, state) VALUES (?, ?)');
  for (const c of cities) {
    cityStmt.run(c[0], c[1]);
  }

  // Users
  const users = [
    [1, 'admin@bandhan.com', '$2b$10$wTte2xaF5Lzy0gpBKIRVBeui1.1DF14J/8AuyCej8/zVw3L4t5/ee', 'admin'],
    [2, 'demo@bandhan.com', '$2b$10$JAH2hFqCI/34H9zTDKcD..7FRl7VkOUDGk.WCDwZoPbFl.zGm0rsq', 'user'],
    [3, 'ananya.sharma@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [4, 'rohit.verma@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [5, 'priya.patel@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [6, 'aditya.jain@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [7, 'sneha.gupta@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [8, 'vikram.singh@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [9, 'pooja.mishra@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [10, 'kunal.sharma@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [11, 'divya.agarwal@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [12, 'arjun.mehta@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [13, 'kavita.joshi@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [14, 'siddharth.rao@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [15, 'ritika.saxena@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [16, 'manish.tiwari@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [17, 'tanvi.bhatia@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [18, 'gaurav.kapoor@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [19, 'megha.choudhary@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [20, 'harsh.deshmukh@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [21, 'neha.shukla@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
    [22, 'rahul.pandey@example.com', '$2b$10$YNNNEgRNldqv/pg1KDdsZOoyA9chD6DaeyIsitZn4NYqSdQPFHPw2', 'user'],
  ];
  const userStmt = sqliteDb.prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)');
  for (const u of users) {
    userStmt.run(u[0], u[1], u[2], u[3]);
  }

  // Profiles
  const profiles = [
    [1, 2, 'Rohan Sharma', 'male', '1996-05-14', 'Indore', 'Madhya Pradesh', 'Senior Software Engineer', 'B.Tech in Computer Science', '5 ft 10 in', 'Hindu', '₹18 - 22 Lakhs', 'Warm, family-oriented software professional working at an MNC in Indore. Enjoys badminton, reading, and exploring food spots.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'],
    [2, 3, 'Ananya Sharma', 'female', '1998-08-20', 'Indore', 'Madhya Pradesh', 'Product Designer', 'M.Des - IIT Bombay', '5 ft 4 in', 'Hindu', '₹15 - 18 Lakhs', 'Passionate about human-centered design, classical Kathak dance, and weekend trekking. Looking for someone grounded with mutual respect and aspirations.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'],
    [3, 4, 'Rohit Verma', 'male', '1994-03-12', 'Bhopal', 'Madhya Pradesh', 'Civil Engineer', 'B.Tech Civil', '5 ft 11 in', 'Hindu', '₹12 - 15 Lakhs', 'Government infrastructure consultant based in Bhopal. Simple lifestyle, avid cricketer, and values family bonding above all.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'],
    [4, 5, 'Priya Patel', 'female', '1997-11-05', 'Indore', 'Madhya Pradesh', 'Chartered Accountant', 'CA, B.Com', '5 ft 3 in', 'Hindu', '₹16 - 20 Lakhs', 'Senior auditor at a Big 4 firm. Passionate about financial markets, painting, and yoga. Seeking a progressive partner with strong ethics.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'],
    [5, 6, 'Aditya Jain', 'male', '1995-09-18', 'Gwalior', 'Madhya Pradesh', 'Data Scientist', 'M.Tech - BITS Pilani', '5 ft 9 in', 'Jain', '₹22 - 26 Lakhs', 'AI researcher working remotely for a European healthtech startup. Vegetarian, teetotaler, loves chess and acoustic guitar.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'],
    [6, 7, 'Sneha Gupta', 'female', '1996-01-25', 'Delhi', 'Delhi NCR', 'Doctor (Pediatrician)', 'MBBS, MD Pediatrics', '5 ft 5 in', 'Hindu', '₹20 - 25 Lakhs', 'Consultant pediatrician at a reputed private hospital in South Delhi. Dedicated to healthcare, fond of indie music and pet rescue.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'],
    [7, 8, 'Vikram Singh', 'male', '1993-07-10', 'Jaipur', 'Rajasthan', 'Architect', 'B.Arch - SPA Delhi', '6 ft 0 in', 'Hindu', '₹14 - 18 Lakhs', 'Sustainable heritage architect preserving historic Rajasthani havelis. Enjoys wildlife photography and cycling.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'],
    [8, 9, 'Pooja Mishra', 'female', '1999-04-16', 'Bhopal', 'Madhya Pradesh', 'Assistant Professor', 'Ph.D in English Literature', '5 ft 2 in', 'Hindu', '₹9 - 12 Lakhs', 'Academician teaching comparative literature. Passionate reader, nature enthusiast, and community volunteer.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'],
    [9, 10, 'Kunal Sharma', 'male', '1992-12-04', 'Noida', 'Uttar Pradesh', 'Product Manager', 'MBA - IIM Lucknow', '5 ft 10 in', 'Hindu', '₹28 - 32 Lakhs', 'Heading growth products at a fintech unicorn. Marathon runner, coffee connoisseur, and tech podcast creator.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'],
    [10, 11, 'Divya Agarwal', 'female', '1995-06-30', 'Jaipur', 'Rajasthan', 'Fashion Merchandiser', 'NIFT Delhi Graduate', '5 ft 6 in', 'Hindu', '₹12 - 15 Lakhs', 'Creative entrepreneur managing handcrafted sustainable apparel export. Enjoys travel, pottery, and culinary arts.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'],
    [11, 12, 'Arjun Mehta', 'male', '1994-02-14', 'Mumbai', 'Maharashtra', 'Investment Banker', 'MBA Finance, CFA', '5 ft 11 in', 'Hindu', '₹35 - 40 Lakhs', 'Private equity analyst based in Bandra, Mumbai. Weekend sailor, food enthusiast, and fitness conscious.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'],
    [12, 13, 'Kavita Joshi', 'female', '1997-10-12', 'Pune', 'Maharashtra', 'UX Researcher', 'M.Sc Cognitive Science', '5 ft 4 in', 'Hindu', '₹18 - 22 Lakhs', 'User research specialist at a global automotive firm. Loves Marathi theatre, trekking the Western Ghats, and baking sourdough.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'],
    [13, 14, 'Siddharth Rao', 'male', '1996-08-08', 'Bengaluru', 'Karnataka', 'DevOps Architect', 'B.Tech IT', '5 ft 8 in', 'Hindu', '₹24 - 28 Lakhs', 'Cloud infrastructure lead at a SaaS firm in Indiranagar. Enjoys board games, road trips, and retro gaming consoles.', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&auto=format&fit=crop&q=80'],
    [14, 15, 'Ritika Saxena', 'female', '1998-03-22', 'Lucknow', 'Uttar Pradesh', 'Digital Marketing Lead', 'MBA Marketing', '5 ft 5 in', 'Hindu', '₹14 - 17 Lakhs', 'Brand strategist for consumer wellness brands. Loves Awadhi cuisine, Urdu poetry, and contemporary interior styling.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80'],
    [15, 16, 'Manish Tiwari', 'male', '1993-11-28', 'Gwalior', 'Madhya Pradesh', 'Bank Officer', 'M.Com, JAIIB', '5 ft 9 in', 'Hindu', '₹10 - 13 Lakhs', 'Manager at a nationalized public sector bank. Honest, disciplined, passionate about badminton and classical Indian music.', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80'],
    [16, 17, 'Tanvi Bhatia', 'female', '1996-12-19', 'Delhi', 'Delhi NCR', 'Corporate Lawyer', 'LL.M - National Law School', '5 ft 6 in', 'Sikh', '₹22 - 27 Lakhs', 'Practicing commercial contracts lawyer in Central Delhi. Debater, animal advocate, loves heritage walks and indie cinema.', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80'],
    [17, 18, 'Gaurav Kapoor', 'male', '1995-04-03', 'Noida', 'Uttar Pradesh', 'Cybersecurity Consultant', 'B.Tech CS, CISSP', '5 ft 10 in', 'Hindu', '₹20 - 24 Lakhs', 'Ethical hacker and security auditor. Enjoys weekend long drives, formula 1 racing, and gourmet cooking experiments.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'],
    [18, 19, 'Megha Choudhary', 'female', '1997-07-15', 'Indore', 'Madhya Pradesh', 'HR Business Partner', 'MBA HR - NMIMS', '5 ft 3 in', 'Hindu', '₹13 - 16 Lakhs', 'Talent acquisition manager at an IT conglomerate. Cheerful, family-centric, enjoys dance workshops and weekend outings.', 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&auto=format&fit=crop&q=80'],
    [19, 20, 'Harsh Deshmukh', 'male', '1994-09-02', 'Pune', 'Maharashtra', 'Aerospace Engineer', 'M.Tech Aerospace', '6 ft 1 in', 'Hindu', '₹25 - 30 Lakhs', 'Structural engineer designing satellite propulsion units. Passionate stargazer, avid camper, and fitness enthusiast.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'],
    [20, 21, 'Neha Shukla', 'female', '1998-01-11', 'Lucknow', 'Uttar Pradesh', 'Clinical Psychologist', 'M.Phil Clinical Psychology', '5 ft 4 in', 'Hindu', '₹11 - 14 Lakhs', 'Counseling psychologist focusing on adolescent wellness. Empathetic listener, book collector, loves botanical gardens.', 'https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?w=400&auto=format&fit=crop&q=80'],
    [21, 22, 'Rahul Pandey', 'male', '1993-06-25', 'Bhopal', 'Madhya Pradesh', 'Entrepreneur', 'B.Com, Startup Founder', '5 ft 10 in', 'Hindu', '₹20 - 30 Lakhs', 'Founder of a regional agri-tech logistics venture. Visionary, ambitious, family-oriented and loves playing tennis.', 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&auto=format&fit=crop&q=80'],
  ];
  const profileStmt = sqliteDb.prepare(`
    INSERT INTO profiles (id, user_id, full_name, gender, date_of_birth, city, state, occupation, education, height, religion, annual_income, about, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of profiles) {
    profileStmt.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11], p[12], p[13]);
  }

  // Interests
  const interests = [
    [1, 2, 3, 'accepted'],
    [2, 2, 5, 'pending'],
    [3, 9, 2, 'pending'],
    [4, 7, 2, 'accepted'],
    [5, 11, 2, 'rejected'],
    [6, 4, 3, 'rejected'],
    [7, 12, 5, 'pending'],
  ];
  const interestStmt = sqliteDb.prepare('INSERT INTO interests (id, sender_id, receiver_id, status) VALUES (?, ?, ?, ?)');
  for (const i of interests) {
    interestStmt.run(i[0], i[1], i[2], i[3]);
  }

  // Messages
  const messages = [
    [2, 3, 'Namaste Ananya ji! Thank you for accepting my interest. Your profile is truly impressive.'],
    [3, 2, 'Namaste Rohan! Nice to connect with you. I noticed you work in software engineering in Indore.'],
    [2, 3, 'Yes! I have been working here for the last 4 years. How is your work in product design going?'],
    [3, 2, 'It is very exciting, especially working with creative teams! Would love to learn more about your family background.'],
    [7, 2, 'Hello Rohan, I accepted your interest. Happy to connect and discuss our values!'],
  ];
  const messageStmt = sqliteDb.prepare('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)');
  for (const m of messages) {
    messageStmt.run(m[0], m[1], m[2]);
  }

  console.log('[DB] Seed data initialized successfully with 22 users, 21 profiles, 7 interests, 5 messages.');
}

/**
 * Universal query runner supporting both MySQL and SQLite
 */
export async function executeQuery(sql, params = []) {
  if (!activeDriver) {
    await initDatabase();
  }

  if (activeDriver === 'mysql' && mysqlPool) {
    const [rows] = await mysqlPool.query(sql, params);
    return rows;
  }

  // SQLite execution
  // Note: DatabaseSync in Node 22:
  // For SELECT queries: stmt.all(...params)
  // For INSERT/UPDATE/DELETE queries: stmt.run(...params)
  const trimmed = sql.trim().toUpperCase();
  const stmt = sqliteDb.prepare(sql);

  if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
    return stmt.all(...params);
  } else {
    const result = stmt.run(...params);
    return {
      insertId: Number(result.lastInsertRowid),
      affectedRows: result.changes,
    };
  }
}

/**
 * Reset database helper
 */
export async function resetDatabase() {
  if (activeDriver === 'mysql' && mysqlPool) {
    // MySQL reset
    return { success: true, message: 'MySQL reset requires reloading schema/seed' };
  }
  seedSqliteData();
  return { success: true, message: 'Database reset to seed fixtures successfully' };
}

/**
 * Get active database info
 */
export function getDbInfo() {
  return {
    driver: activeDriver,
    status: 'connected',
    host: activeDriver === 'mysql' ? DB_CONFIG.host : 'local_sqlite',
    database: activeDriver === 'mysql' ? DB_CONFIG.database : 'matrimonial.db',
  };
}
