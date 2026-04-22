const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/doctorController');

router.get('/', protect, ctrl.list);
router.get('/:id', protect, ctrl.getById);
router.post('/profile', protect, authorize('doctor'), ctrl.createProfile);

module.exports = router;
