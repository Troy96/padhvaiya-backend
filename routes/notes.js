const router = require('express').Router();
const { NotesController } = require('../controllers/NotesController');

const notesController = new NotesController();

router.post('/', notesController.create);
router.get('/', notesController.getAll);
router.get('/:id', notesController.getById);
router.delete('/', notesController.deleteAll);
router.delete('/:id', notesController.deleteById);


module.exports = router;
