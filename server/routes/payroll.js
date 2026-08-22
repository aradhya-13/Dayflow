const express = require('express');
const router  = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const { generatePayslip, getMyPayslips, getAllPayslips, issuePayslip } = require('../controllers/payrollController');

router.post('/generate',    protect, requireAdmin, generatePayslip);
router.get('/me',           protect, getMyPayslips);
router.get('/',             protect, requireAdmin, getAllPayslips);
router.put('/:id/issue',    protect, requireAdmin, issuePayslip);

module.exports = router;
