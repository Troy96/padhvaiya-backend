const router = require('express').Router();
const { NotificationController } = require('../controllers/NotificationController');

const notif = new NotificationController;

router.get('/:userId', notif.getAll);

module.exports = router;