const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/appointmentController');

router.post('/book', protect, authorize('patient'), ctrl.book);
router.get('/my', protect, authorize('patient'), ctrl.mine);
router.patch('/cancel/:id', protect, authorize('patient'), ctrl.cancel);

router.get('/doctor/schedule', protect, authorize('doctor'), ctrl.schedule);
router.patch('/status/:id', protect, authorize('doctor'), ctrl.updateStatus);

module.exports = router;
