import { executeQuery } from '../db/connection.js';
import { calculateAge } from './profileController.js';

export async function getAdminStats(req, res) {
  try {
    const totalUsersRows = await executeQuery("SELECT COUNT(*) AS count FROM users WHERE role = 'user'");
    const maleUsersRows = await executeQuery("SELECT COUNT(*) AS count FROM profiles WHERE LOWER(gender) = 'male'");
    const femaleUsersRows = await executeQuery("SELECT COUNT(*) AS count FROM profiles WHERE LOWER(gender) = 'female'");

    // BUG-008: Seeded defect - calculates pending interests using `status != 'accepted'`
    // instead of `status = 'pending'`, causing rejected interests to be falsely included as pending!
    const pendingInterestsRows = await executeQuery("SELECT COUNT(*) AS count FROM interests WHERE status != 'accepted'");

    const totalMessagesRows = await executeQuery('SELECT COUNT(*) AS count FROM messages');

    return res.json({
      totalUsers: totalUsersRows[0]?.count || 0,
      maleUsers: maleUsersRows[0]?.count || 0,
      femaleUsers: femaleUsersRows[0]?.count || 0,
      pendingInterests: pendingInterestsRows[0]?.count || 0,
      totalMessages: totalMessagesRows[0]?.count || 0,
    });
  } catch (err) {
    console.error('getAdminStats error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getAdminUsers(req, res) {
  try {
    const users = await executeQuery(
      `SELECT u.id, u.email, u.role, u.created_at,
              p.full_name, p.gender, p.city, p.occupation, p.photo_url, p.date_of_birth
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       ORDER BY u.created_at DESC`
    );

    const formatted = users.map((u) => ({
      ...u,
      age: u.date_of_birth ? calculateAge(u.date_of_birth) : null,
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const currentAdminId = req.user.id;

    if (Number(id) === Number(currentAdminId)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Admin cannot delete their own active account' });
    }

    // Delete cascading
    await executeQuery('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [id, id]);
    await executeQuery('DELETE FROM interests WHERE sender_id = ? OR receiver_id = ?', [id, id]);
    await executeQuery('DELETE FROM profiles WHERE user_id = ?', [id]);
    const result = await executeQuery('DELETE FROM users WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: `User ${id} and associated profiles deleted successfully.`,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
