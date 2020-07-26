const express = require('express');
const router = express.Router();
const { UserController } = require('./../controllers/UserController');
const userController = new UserController();

router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.delete('/:id', userController.deleteById);
router.delete('/', userController.deleteAll);
router.put('/:id', userController.updateById);
router.get('/:id/:objectType/likestates', userController.getUserLikeStateByObjectType)
router.get('/:startTime/:endTime/count', userController.getActiveUsersBetweenDate);

module.exports = router;
