const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { symptomCheck } = require('../controllers/aiController');

router.post('/symptom-check', protect, symptomCheck);

module.exports = router;
