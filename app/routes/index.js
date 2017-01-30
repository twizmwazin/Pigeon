let express = require('express');
let router = new express.Router();

router.get('/', function(req, res) {
  res.send('Hello from the router');
});

module.exports = router;
