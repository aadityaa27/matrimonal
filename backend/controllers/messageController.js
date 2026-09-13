import { executeQuery } from '../db/connection.js';

export async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    // Find all users with whom the current user has exchanged messages OR has an interest
    const partners = await executeQuery(
      `SELECT DISTINCT partner_id FROM (
        SELECT receiver_id AS partner_id FROM messages WHERE sender_id = ?
        UNION
        SELECT sender_id AS partner_id FROM messages WHERE receiver_id = ?
        UNION
        SELECT receiver_id AS partner_id FROM interests WHERE sender_id = ? AND status IN ('accepted', 'pending')
        UNION
        SELECT sender_id AS partner_id FROM interests WHERE receiver_id = ? AND status IN ('accepted', 'pending')
      )`,
      [userId, userId, userId, userId]
    );

    const conversations = [];
    for (const p of partners) {
      if (p.partner_id === userId) continue;

      const profileRows = await executeQuery('SELECT * FROM profiles WHERE user_id = ?', [p.partner_id]);
      if (profileRows.length === 0) continue;
      const profile = profileRows[0];

      // Get last message if any
      const lastMsgRows = await executeQuery(
        `SELECT message, created_at, sender_id FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1`,
        [userId, p.partner_id, p.partner_id, userId]
      );

      // Check interest status
      const interestRows = await executeQuery(
        `SELECT status FROM interests 
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         ORDER BY id DESC LIMIT 1`,
        [userId, p.partner_id, p.partner_id, userId]
      );

      conversations.push({
        partnerId: p.partner_id,
        name: profile.full_name,
        photo_url: profile.photo_url,
        city: profile.city,
        occupation: profile.occupation,
        lastMessage: lastMsgRows.length > 0 ? lastMsgRows[0].message : null,
        lastMessageTime: lastMsgRows.length > 0 ? lastMsgRows[0].created_at : null,
        interestStatus: interestRows.length > 0 ? interestRows[0].status : 'none',
      });
    }

    return res.json(conversations);
  } catch (err) {
    console.error('getConversations error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getThread(req, res) {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    const messages = await executeQuery(
      `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at,
              p.full_name AS sender_name, p.photo_url AS sender_photo
       FROM messages m
       JOIN profiles p ON p.user_id = m.sender_id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [userId, partnerId, partnerId, userId]
    );

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ error: 'Validation Error', message: 'receiver_id is required' });
    }

    // BUG-007: Only checks message !== undefined rather than checking trimmed length!
    // Allows empty or whitespace-only messages
    if (message === undefined || message === null) {
      return res.status(400).json({ error: 'Validation Error', message: 'Message content is required' });
    }

    // BUG-009: Seeded defect - Authorization check permits messaging when interest is 'pending' OR 'accepted',
    // rather than strictly enforcing 'accepted' match status!
    const interests = await executeQuery(
      `SELECT status FROM interests 
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
      [senderId, receiver_id, receiver_id, senderId]
    );

    // If no interest exists at all, reject
    if (interests.length === 0) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Messaging requires expressing interest first.',
      });
    }

    // Notice: Due to BUG-009, even if interest status is 'pending', we do NOT throw 403 here!
    const result = await executeQuery(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiver_id, message]
    );

    const senderProfiles = await executeQuery('SELECT full_name, photo_url FROM profiles WHERE user_id = ?', [senderId]);
    const senderProfile = senderProfiles.length > 0 ? senderProfiles[0] : { full_name: 'You', photo_url: '' };

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: Number(receiver_id),
        message,
        sender_name: senderProfile.full_name,
        sender_photo: senderProfile.photo_url,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
