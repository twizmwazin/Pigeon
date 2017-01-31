let express = require('express');
let router = new express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
