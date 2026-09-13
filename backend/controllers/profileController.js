import { executeQuery } from '../db/connection.js';

// Helper to calculate age from DOB string YYYY-MM-DD
export function calculateAge(dobString) {
  if (!dobString) return 26;
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export async function getProfiles(req, res) {
  try {
    const { gender, minAge, maxAge, city, education, occupation } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    let sql = 'SELECT * FROM profiles WHERE 1=1';
    const params = [];

    // Filter by gender
    if (gender && gender !== 'all') {
      sql += ' AND LOWER(gender) = LOWER(?)';
      params.push(gender);
    }

    // Filter by city
    if (city && city !== 'all' && city !== '') {
      // BUG-001: Seeded defect - Searching by Indore inadvertently includes Bhopal engineers
      if (city.toLowerCase() === 'indore') {
        sql += " AND (LOWER(city) = 'indore' OR (LOWER(city) = 'bhopal' AND LOWER(occupation) LIKE '%engineer%'))";
      } else {
        sql += ' AND LOWER(city) = LOWER(?)';
        params.push(city);
      }
    }

    // Filter by education
    if (education && education.trim() !== '') {
      sql += ' AND LOWER(education) LIKE LOWER(?)';
      params.push(`%${education.trim()}%`);
    }

    // Filter by occupation
    if (occupation && occupation.trim() !== '') {
      sql += ' AND LOWER(occupation) LIKE LOWER(?)';
      params.push(`%${occupation.trim()}%`);
    }

    const profiles = await executeQuery(sql, params);

    // Filter by age in-memory to handle dynamic DOB accurately
    let filtered = profiles.map((p) => ({
      ...p,
      age: calculateAge(p.date_of_birth),
    }));

    if (minAge) {
      const min = parseInt(minAge, 10);
      filtered = filtered.filter((p) => p.age >= min);
    }

    if (maxAge) {
      const max = parseInt(maxAge, 10);
      // BUG-002: Seeded defect - Age filter includes one profile outside selected max age (off-by-one: max + 1)
      filtered = filtered.filter((p) => p.age <= max + 1);
    }

    // Attach interest status if user is logged in
    if (currentUserId) {
      const interests = await executeQuery(
        `SELECT receiver_id, status FROM interests WHERE sender_id = ?
         UNION
         SELECT sender_id AS receiver_id, status FROM interests WHERE receiver_id = ?`,
        [currentUserId, currentUserId]
      );
      const statusMap = new Map();
      for (const item of interests) {
        statusMap.set(item.receiver_id, item.status);
      }

      filtered = filtered.map((p) => ({
        ...p,
        interestStatus: statusMap.get(p.user_id) || 'none',
        isSelf: p.user_id === currentUserId,
      }));
    } else {
      filtered = filtered.map((p) => ({
        ...p,
        interestStatus: 'none',
        isSelf: false,
      }));
    }

    return res.json(filtered);
  } catch (err) {
    console.error('getProfiles error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getProfileById(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const profiles = await executeQuery('SELECT * FROM profiles WHERE id = ? OR user_id = ?', [id, id]);
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Profile not found' });
    }

    const profile = profiles[0];
    profile.age = calculateAge(profile.date_of_birth);
    profile.isSelf = currentUserId ? profile.user_id === currentUserId : false;

    // Fetch interest relationship
    if (currentUserId && !profile.isSelf) {
      const existingInterests = await executeQuery(
        `SELECT id, sender_id, receiver_id, status FROM interests 
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
        [currentUserId, profile.user_id, profile.user_id, currentUserId]
      );
      if (existingInterests.length > 0) {
        const rel = existingInterests[0];
        profile.interestStatus = rel.status;
        profile.interestDirection = rel.sender_id === currentUserId ? 'sent' : 'received';
        profile.interestId = rel.id;
      } else {
        profile.interestStatus = 'none';
      }
    } else {
      profile.interestStatus = 'none';
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // Check ownership or admin
    const profiles = await executeQuery('SELECT * FROM profiles WHERE id = ? OR user_id = ?', [id, id]);
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Profile not found' });
    }

    const profile = profiles[0];
    if (profile.user_id !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden', message: 'You can only update your own profile' });
    }

    const {
      full_name,
      gender,
      date_of_birth,
      city,
      state,
      occupation,
      education,
      height,
      religion,
      annual_income, // BUG-006: received but intentionally omitted from UPDATE query below
      about,
      photo_url,
    } = req.body;

    // BUG-006: Intentionally omitted `annual_income` in the UPDATE statement!
    // So annual_income is not updated in the database.
    await executeQuery(
      `UPDATE profiles SET
        full_name = COALESCE(?, full_name),
        gender = COALESCE(?, gender),
        date_of_birth = COALESCE(?, date_of_birth),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        occupation = COALESCE(?, occupation),
        education = COALESCE(?, education),
        height = COALESCE(?, height),
        religion = COALESCE(?, religion),
        about = COALESCE(?, about),
        photo_url = COALESCE(?, photo_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        full_name,
        gender,
        date_of_birth,
        city,
        state,
        occupation,
        education,
        height,
        religion,
        about,
        photo_url,
        profile.id,
      ]
    );

    // Fetch updated record from DB
    const updatedProfiles = await executeQuery('SELECT * FROM profiles WHERE id = ?', [profile.id]);
    const updated = updatedProfiles[0];
    updated.age = calculateAge(updated.date_of_birth);

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      profile: updated,
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}

export async function getCities(req, res) {
  try {
    const cities = await executeQuery('SELECT * FROM cities ORDER BY city_name ASC');
    return res.json(cities);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
