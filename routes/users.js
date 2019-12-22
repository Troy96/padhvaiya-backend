var express = require('express');
var router = express.Router();
const { UserController } = require('./../controllers/UserController');
const userController = new UserController();

router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.delete('/:id', userController.deleteById);
router.delete('/', userController.deleteAll);
router.put('/:id', userController.updateById);

module.exports = router;
