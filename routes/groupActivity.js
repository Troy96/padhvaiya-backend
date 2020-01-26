const router = require('express').Router();
const {GroupActivityController} = require('../controllers/GroupActivityController');

const groupActivityController = new GroupActivityController();

router.post('/', groupActivityController.create);
router.get('/', groupActivityController.getAll);
router.get('/:id', groupActivityController.getById);
router.delete('/', groupActivityController.deleteAll);
router.delete('/:id', groupActivityController.deleteById);

module.exports = {
    router
};