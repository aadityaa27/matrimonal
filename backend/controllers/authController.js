import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bandhan_super_secret_jwt_key_qa_demo_2026';

export async function register(req, res) {
  try {
    const { name, email, password, gender, dob, city, phone } = req.body;

    // Validation checks
    if (!name || !email || !password || !gender || !dob || !city || !phone) {
      // BUG-010: Intentionally returns HTTP 200 instead of HTTP 400 Bad Request
      return res.status(200).json({
        success: false,
        error: 'Validation Error',
        message: 'All fields (Name, Email, Password, Gender, Date of Birth, City, Phone) are required.',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // BUG-010: Intentionally returns HTTP 200 instead of HTTP 400 Bad Request
      return res.status(200).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide a valid email address.',
      });
    }

    // Password length validation
    if (password.length < 6) {
      // BUG-010: Intentionally returns HTTP 200 instead of HTTP 400 Bad Request
      return res.status(200).json({
        success: false,
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check duplicate email
    const existingUsers = await executeQuery('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'This email address is already registered. Please login.',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const userResult = await executeQuery(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email.toLowerCase().trim(), passwordHash, 'user']
    );
    const userId = userResult.insertId;

    // Default avatar based on gender
    const defaultPhoto = gender === 'female'
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

    // Insert profile
    const profileResult = await executeQuery(
      `INSERT INTO profiles 
        (user_id, full_name, gender, date_of_birth, city, state, occupation, education, height, religion, annual_income, about, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name.trim(),
        gender.toLowerCase(),
        dob,
        city.trim(),
        'Madhya Pradesh',
        'Professional',
        'Graduate',
        '5 ft 7 in',
        'Hindu',
        '₹10 - 15 Lakhs',
        `Namaste! I am ${name.trim()} from ${city.trim()}. Looking for a life partner with mutual understanding and family values.`,
        defaultPhoto,
      ]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: 'user', name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const createdProfile = {
      id: profileResult.insertId,
      user_id: userId,
      full_name: name.trim(),
      gender: gender.toLowerCase(),
      date_of_birth: dob,
      city: city.trim(),
      state: 'Madhya Pradesh',
      occupation: 'Professional',
      education: 'Graduate',
      photo_url: defaultPhoto,
    };

    return res.status(201).json({
      success: true,
      message: 'Candidate registration successful!',
      token,
      user: { id: userId, email: email.toLowerCase().trim(), role: 'user' },
      profile: createdProfile,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
    }

    const users = await executeQuery('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    const user = users[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    // Fetch profile if candidate
    const profiles = await executeQuery('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
    const profile = profiles.length > 0 ? profiles[0] : null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: profile ? profile.full_name : 'Admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role },
      profile,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const users = await executeQuery('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    const profiles = await executeQuery('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
    const profile = profiles.length > 0 ? profiles[0] : null;

    return res.json({
      user: users[0],
      profile,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
