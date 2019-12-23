const express = require('express');
const router = express.Router();
const { CommentController } = require('./../controllers/CommentController');
const commentController = new CommentController();


router.post('/', commentController.create);
router.get('/', commentController.getAll);
router.get('/:id', commentController.getById);
router.delete('/:id', commentController.deleteById);
router.delete('/', commentController.deleteAll);
router.get('/user/:id', commentController.getByUser);

module.exports = router;
