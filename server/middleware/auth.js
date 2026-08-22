/**
 * auth middleware — teammates import this to protect their routes.
 *
 * Usage:
 *   const { protect, requireAdmin } = require('../middleware/auth');
 *   router.get('/my-route', protect, yourController);
 *   router.get('/admin-only', protect, requireAdmin, yourController);
 *
 * After protect runs, req.user = { id, role, employeeId }
 */

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach minimal user info — controllers can fetch full record if needed
    req.user = { id: decoded.id, role: decoded.role, employeeId: decoded.employeeId };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, requireAdmin };
