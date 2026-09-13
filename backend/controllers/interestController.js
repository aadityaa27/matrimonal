import { executeQuery } from '../db/connection.js';
import { calculateAge } from './profileController.js';

export async function sendInterest(req, res) {
  try {
    const senderId = req.user.id;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ error: 'Validation Error', message: 'receiver_id is required' });
    }

    if (Number(senderId) === Number(receiver_id)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Cannot send interest to yourself' });
    }

    // BUG-004: Intentionally omitted duplicate pending check / unique constraint check!
    // Rapid clicks or multiple calls will insert duplicate interest records.
    const result = await executeQuery(
      'INSERT INTO interests (sender_id, receiver_id, status) VALUES (?, ?, ?)',
      [senderId, receiver_id, 'pending']
    );

    return res.status(201).json({
      success: true,
      message: 'Interest sent successfully!',
      interest: {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: Number(receiver_id),
        status: 'pending',
      },
    });
  } catch (err) {
    console.error('sendInterest error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getSentInterests(req, res) {
  try {
    const userId = req.user.id;
    const rows = await executeQuery(
      `SELECT i.id, i.sender_id, i.receiver_id, i.status, i.created_at,
              p.full_name, p.gender, p.date_of_birth, p.city, p.occupation, p.photo_url, p.education
       FROM interests i
       JOIN profiles p ON p.user_id = i.receiver_id
       WHERE i.sender_id = ?
       ORDER BY i.created_at DESC`,
      [userId]
    );

    const formatted = rows.map((r) => ({
      ...r,
      age: calculateAge(r.date_of_birth),
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getReceivedInterests(req, res) {
  try {
    const userId = req.user.id;
    const rows = await executeQuery(
      `SELECT i.id, i.sender_id, i.receiver_id, i.status, i.created_at,
              p.full_name, p.gender, p.date_of_birth, p.city, p.occupation, p.photo_url, p.education
       FROM interests i
       JOIN profiles p ON p.user_id = i.sender_id
       WHERE i.receiver_id = ?
       ORDER BY i.created_at DESC`,
      [userId]
    );

    const formatted = rows.map((r) => ({
      ...r,
      age: calculateAge(r.date_of_birth),
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function updateInterestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Status must be accepted, rejected, or pending' });
    }

    const interests = await executeQuery('SELECT * FROM interests WHERE id = ?', [id]);
    if (interests.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Interest request not found' });
    }

    const interest = interests[0];
    // Check authorization: must be receiver or admin
    if (interest.receiver_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden', message: 'Not authorized to update this interest' });
    }

    // BUG-005: Seeded defect - allows accepting an already rejected interest without checking prior state!
    await executeQuery('UPDATE interests SET status = ? WHERE id = ?', [status, id]);

    return res.json({
      success: true,
      message: `Interest marked as ${status}`,
      interest: { ...interest, status },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
