const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('home');
  res.sendFile(__dirname + '/index.html');
});

module.exports = router;
