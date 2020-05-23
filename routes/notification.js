const router = require('express').Router();
const { NotificationController } = require('../controllers/NotificationController');

const notif = new NotificationController;

router.get('/', notif.getAll);

module.exports = router;