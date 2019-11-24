var express = require('express');
var router = express.Router();
const { CollegeController } = require('./../controllers/CollegeController');
const collegeController = new CollegeController();


router.post('/', collegeController.create);
router.get('/', collegeController.getAll);
router.get('/:id', collegeController.getById);
router.delete('/:id', collegeController.deleteById);
router.delete('/', collegeController.deleteAll);

module.exports = router;
