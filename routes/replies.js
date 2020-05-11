const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;



router.post('/', async (req, res) => {
    // const users = await userData.getAllUsers();
    if (req.session.user) {
    //   return res.render('posts/new');
    let replyData = req.body;
    let errors = [];
  
    if (!replyData.text) {
      errors.push('No reply provided');
    }
  
    }
    else{
      res.render('users/login',{title: 'Login'});
    }
  });

  module.exports = router;