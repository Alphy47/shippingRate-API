const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController.jsx');

router.post('/updatePendingToApproved', updateController.updatePendingToApproved);
router.post('/updatePendingToDisapproved', updateController.updatePendingToDisapproved);
router.post('/updateTrackingNumber', updateController.updateTrackingNumber);

module.exports = router;
