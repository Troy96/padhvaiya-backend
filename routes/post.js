const express = require('express');
const router = express.Router();
const { PostController } = require('./../controllers/PostController');
const postController = new PostController();
const { authenticate } = require('./../middlewares/interceptor');


router.post('/', postController.create);
router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.delete('/:id', postController.deleteById);
router.delete('/', postController.deleteAll);
router.post('/:id/act', postController.actOnPost);
router.get('/user/:id', postController.getByUser);
router.get('/group/:id/photos', postController.photosByGroup);
router.get('/group/:id', postController.getByGroup);
router.post('/:id/share', postController.sharePost);

module.exports = router;
