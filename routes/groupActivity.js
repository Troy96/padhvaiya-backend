const router = require('express').Router();
const {GroupActivityController} = require('../controllers/GroupActivityController');

const groupActivityController = new GroupActivityController();

router.get('/', groupActivityController.getAll);
router.get('/:id', groupActivityController.getById);
router.delete('/', groupActivityController.deleteAll);
router.delete('/:id', groupActivityController.deleteById);

router.get('/users/:userId', groupActivityController.getActivitiesByUser);
router.get('/groups/:groupId', groupActivityController.getActivitiesByGroup);

module.exports = router;
