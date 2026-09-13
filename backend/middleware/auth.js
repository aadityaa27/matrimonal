import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bandhan_super_secret_jwt_key_qa_demo_2026';

/**
 * Authentication middleware verifying JWT Bearer token
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden', message: 'Invalid or expired authentication token' });
    }
    req.user = decoded;
    next();
  });
}

/**
 * Optional authentication middleware - attaches user if token is present
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded;
    } else {
      req.user = null;
    }
    next();
  });
}

/**
 * Role-based authorization middleware (requires admin role)
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden', message: 'Administrator privileges required' });
  }
  next();
}
