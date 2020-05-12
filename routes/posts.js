const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;
const repliesData = data.replies;

router.get('/new', async (req, res) => {
  // const users = await userData.getAllUsers();
  if (req.session.user) {
    return res.render('posts/new');
  }
  else{
    res.render('users/login',{title: 'Login'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await postData.getPostById(req.params.id);
    const poster = await userData.getUserById(post.userid);
    let replies = []
    if(post.replies){
      for(let j = 0 ; j < post.replies.length; j++){
        let fr = await repliesData.getReplybyId(post.replies[j].id);  
        replies.push(fr);
        replies[j].replier = await userData.getUserById(replies[j].userid);
      }
    }

    let authorCheck = false;
    if(req.session.user) {
      authorCheck = (post.userid == req.session.user._id);
    }

    res.render('posts/single', {post: post, poster: poster, replies: replies, authorCheck: authorCheck});
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/tag/:tag', async (req, res) => {
  try {
  const postList = await postData.getPostsByTag(req.params.tag);
  res.render('posts/index', {posts: postList});
  } catch (e) {
    res.status(500).json({error: e});
}
});

router.get('/', async (req, res) => {
  const postList = await postData.getAllPosts();
  res.render('posts/index', {posts: postList});
});

router.post('/', async (req, res) => {
  let blogPostData = req.body;
  let errors = [];

  if (!blogPostData.title) {
    errors.push('No title provided');
  }

  if (!blogPostData.body) {
    errors.push('No body provided');
  }
  /* else{
    console.log(typeof blogPostData.body)
  }*/

  // if (!blogPostData.posterId) {
  //   errors.push('No poster selected');
  // }

  if (errors.length > 0) {
    res.render('posts/new', {
      errors: errors,
      hasErrors: true,
      post: blogPostData
    });
    return;
  }

  try {
    const newPost = await postData.addPost(
      blogPostData.title,
      blogPostData.body,
      [blogPostData.tag] || [],
      req.session.user._id,
      [blogPostData.image] || []
    );

    res.redirect(`/posts/${newPost._id}`);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  let updatedData = req.body;
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({error: 'Post not found'});
    return;
  }
  try {
    const updatedPost = await postData.updatePost(req.params.id, updatedData);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/delete/:id', async (req, res) => {
  let post = {};
  try {
    post = await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({error: 'Post not found'});
    return;
  }

  try {
    if (req.session.user._id != post.userid) {
      throw "You shouldn't be here!";
    } //idk if this test is necessary or not but I'd rather be safe
    await postData.removePost(req.params.id);
    await userData.removePostFromUser(req.session.user._id, req.params.id)
    res.redirect(200, "/posts");
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;
