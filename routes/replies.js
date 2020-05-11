const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;
const repliesData = data.replies;



router.post('/', async (req, res) => {
    // const users = await userData.getAllUsers();
    if (req.session.user) {
    //   return res.render('posts/new');
    let replyData = req.body;
    let errors = [];
  
    if (!replyData.text) {
      errors.push('No reply provided');
    }
  
    // console.log(replyData.id)

    if (errors.length > 0) {
      // try {
      const post = await postData.getPostById(replyData.id);
      res.render('posts/single', {
        errors: errors,
        hasErrors: true,
        post: post
      });
      // res.render('posts/single', {post: post});
    // } catch (e) {
    //   res.status(500).json({error: e});
    // }
      
      return;
    }
    

    // console.log(replyData.id)


    try {
      const newReply = await repliesData.addReply(
        replyData.id,
        req.session.user._id,
        replyData.text
      );
  
      res.redirect('../posts/'+ replyData.id);
    } catch (e) {
      console.log(e)
      res.status(500).json({error: e});
    }

    // addReply(postid,userid,text)



    }
    else{
      res.render('users/login',{title: 'Login'});
    }
  });

  module.exports = router;