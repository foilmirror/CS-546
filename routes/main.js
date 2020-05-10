const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;

router.get('/', async (req, res) => {
    res.render('layouts/main');
  });

module.exports = router;