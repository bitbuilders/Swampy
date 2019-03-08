var express = require('express');

var router = express.Router();

router.get('/auth', (req, res, next) => {
    if (req.session.user && req.session.user.isAuthenticated) {
      next();
    }
    else {
      res.redirect('/');
    }
});

module.exports = router;