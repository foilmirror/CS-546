const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const PostData = data.posts;
const bcrypt = require('bcrypt');
const xss = require('xss');
const saltRounds = 10;

router.get('/new', async (req, res) => {
	res.render('users/register', {});
});

router.get("/login", (req, res) => {
  if (req.session.user) {
      return res.redirect('/users/' + xss(req.session.user._id));
  }
  else{
      res.render('users/login',{title: 'Login'});
  }

});

router.get("/logout", async (req, res) => {
  if(req.session.user){
  //Get rid of all cookies
  req.session.destroy();
  res.render('users/login',{title: 'Login'});
  }
  else{
       res.redirect('/');
  }
});

router.get('/:id', async (req, res) => {
  try {
    let c_user = await userData.getUserById(req.params.id);
    let diff = false;
    let f = false;
    let you = false;
    let amigos = [];
    let posta = [];
    if(c_user.posts){
      for(let q = 0; q < c_user.posts.length; q++){
        let re = await PostData.getPostById(c_user.posts[q].id);
        posta.push(re);
      }
      posta = posta;
    }
    
    if(c_user.friends){
      for(let j = 0 ; j < c_user.friends.length; j++){
        let fr = await userData.getUserById(c_user.friends[j].id);  
        amigos.push(fr);
      }
  
      amigos = amigos;
  
    }
    if(req.session.user){
      if(xss(req.session.user._id) != c_user._id){
          diff = true;
      }

      else{
          you = true;
      }
      if(c_user.friends){
      for(let x = 0 ; x < c_user.friends.length; x++){
        if(xss(req.session.user._id) == c_user.friends[x].id){
          f = true;
          diff = false;
          break;
        }

      }
    }
  }
    res.render('users/user', {user: c_user, nyou: diff, amigos: amigos, posts: posta, i: req.session.user, friend: f, you:you});
  } catch (e) {
    res.status(404).json({error: 'User not found'});
  }
});

router.get('/', async (req, res) => {
  try {
    let userList = await userData.getAllUsers();
    res.render('users/view', { users: userList });
  } catch (e) {
    res.sendStatus(500);
  }
});


router.post("/login", async (req, res) => {
  const data = req.body;
  if(!data || !data.userName || !data.password){
      res.status(400);
      return;
  }
  
  data.userName = xss(data.userName.toLowerCase());
  try{
      let success = false;
      const users  = await userData.getAllUsers();
      let user = users.find(u => u.userName.toLowerCase() == xss(data.userName));
      if(user){
          success = await bcrypt.compare(xss(data.password), user.Password);
  
          if(success=== true){
              //Worked~
              req.session.user = user;
              req.session.AuthCookie = req.sessionID;
              return res.redirect('/users/');
          }
          else{
              res.status(401).render('users/login', {title: 'Login', error: true, etext: "Invalid Password" });
              
          }
      }
      else{
          res.status(401).render('users/login', {title: 'Login', error: true, etext: "Invalid username" });
         
      }
  }
  catch{
      res.status(404).json({ error: true });
  }

}

);

router.post('/', async (req, res) => {
  let userInfo = req.body;
  if (!userInfo) {
    res.status(400).json({error: 'You must provide data to create a user'});
    return;
  }

  if (!userInfo.userName) {
    res.status(400).json({error: 'You must provide a user name'});
    return;
  }
  userInfo.userName = xss(userInfo.userName.toLowerCase());
  const users  = await userData.getAllUsers();

  let e = users.find(u => u.userName.toLowerCase() == xss(userInfo.userName));

  if(e){
    res.render('users/register', {error: true, etext: "Username is already taken"});
    return;
  }

  if (!userInfo.Email) {
    res.status(400).json({error: 'You must provide a Email'});
    return;
  }

  userInfo.Email = xss(userInfo.Email.toLowerCase());
  let f = users.find(u => u.Email.toLowerCase() == userInfo.Email);

  if(f){
    res.render('users/register', {error: true, etext: "Email is already associated with an account"});
    return;
  }

  if (!userInfo.Gender) {
    res.status(400).json({error: 'You must provide a Gender'});
    return;
  }

  if (!userInfo.City) {
    res.status(400).json({error: 'You must provide a City'});
    return;
  }

  if (!userInfo.State) {
    res.status(400).json({error: 'You must provide a State'});
    return;
  }

  if (!userInfo.Age) {
    res.status(400).json({error: 'You must provide a Age'});
    return;
  }

  if (!userInfo.Password) {
    res.status(400).json({error: 'You must provide a Password'});
    return;
  }

  if (!userInfo.profilePhoto) {
    res.status(400).json({error: 'You must provide a profilePhoto'});
    return;
  }

  try {
    const h = await bcrypt.hash(xss(userInfo.Password),saltRounds);
    const newUser = await userData.addUser(xss(userInfo.userName),xss(userInfo.Email),xss(userInfo.profilePhoto),xss(userInfo.Gender),xss(userInfo.City),xss(userInfo.State),xss(userInfo.Age),xss(h));
    res.render('users/login', {});
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  
  let userInfo = req.body;
  let c_user = await userData.getUserById(xss(req.params.id));
    let diff = false;
    let f = false;
    let you = false;
    let amigos = [];
    let posta = [];
    if(c_user.posts){
      for(let q = 0; q < c_user.posts.length; q++){
        let re = await PostData.getPostById(c_user.posts[q].id);
        posta.push(re);
      }
      posta = posta;
    }
    
    if(c_user.friends){
      for(let j = 0 ; j < c_user.friends.length; j++){
        let fr = await userData.getUserById(c_user.friends[j].id);  
        amigos.push(fr);
      }
  
      amigos = amigos;
  
    }
    if(req.session.user){
      if(req.session.user._id != c_user._id){
          diff = true;
      }

      else{
          you = true;
      }
      if(c_user.friends){
      for(let x = 0 ; x < c_user.friends.length; x++){
        if(req.session.user._id == c_user.friends[x].id){
          f = true;
          diff = false;
          break;
        }

      }
    }
  }
  if (!userInfo) {
    res.status(400).json({error: 'You must provide data to create a user'});
    return;
  }

  if (!userInfo.userName) {
    res.status(400).json({error: 'You must provide a user name'});
    return;
  }
  userInfo.userName = xss(userInfo.userName.toLowerCase());
  const users  = await userData.getAllUsers();

  let e = users.find(u => u.userName.toLowerCase() == xss(userInfo.userName));
  
  if(e){
  if(e._id != req.params.id){
    res.render('users/user', {user: c_user, nyou: diff, amigos: amigos, posts: posta, i: req.session.user, friend: f, you:you, error:true, etext: "username taken"});
    return;
  }
}
  

  if (!userInfo.Email) {
    res.status(400).json({error: 'You must provide a Email'});
    return;
  }

  userInfo.Email = userInfo.Email.toLowerCase();
  let em = users.find(u => u.Email.toLowerCase() == xss(userInfo.Email));
  if(em){
  if(em._id != req.params.id){
    res.render('users/user', {user: c_user, nyou: diff, amigos: amigos, posts: posta, i: req.session.user, friend: f, you:you, error:true, etext: "email taken"});
    return;
  }
}

  if (!userInfo.Email) {
    res.status(400).json({error: 'You must provide a Email'});
    return;
  }


  if (!userInfo.Gender) {
    res.status(400).json({error: 'You must provide a gender'});
    return;
  }

  if (!userInfo.City) {
    res.status(400).json({error: 'You must provide a city'});
    return;
  }

  if (!userInfo.State) {
    res.status(400).json({error: 'You must provide a state'});
    return;
  }

  if (!userInfo.Age) {
    res.status(400).json({error: 'You must provide a age'});
    return;
  }

  if (!userInfo.Password) {
    res.status(400).json({error: 'You must provide a password'});
    return;
  }

  if (!userInfo.profilePhoto) {
    res.status(400).json({error: 'You must provide a profilePhoto'});
    return;
  }


  try {
    await userData.getUserById(req.params.id);
    //If the updated thing was supposed to be friends, it will be here (happens when a person adds someone as a friend)
    if(userInfo.friends && req.session.user){
      await userData.addFriendtoUser(xss(req.session.user._id),xss(req.params.id));
      await userData.updateUser(xss(req.session.user._id), xss(req.session.user));
      await userData.addFriendtoUser(xss(req.params.id),xss(userInfo.friends));
      await userData.updateUser(xss(req.params.id), xss(userInfo));
      res.redirect('/users/' + xss(req.params.id))
    }
    const updatedUser = await userData.updateUser(xss(req.params.id), xss(userInfo));
    res.redirect('/users/' + xss(req.params.id));
  } catch (e) {
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userData.getUserById(xss(req.params.id));
  } catch (e) {
    res.status(404).json({error: 'User not found'});
    return;
  }

  try {
    //This will handle deleting users from friend lists (when a button is pressed on the actual site)
    //This is because removing friends is a user to user thing so idk where else this would go lol
    if(req.body.userID){
      await userData.removeFriend(xss(req.params.id),xss(req.session.user._id));
      await userData.removeFriend(xss(req.session.user._id),xss(req.params.id));
      res.redirect('/users/' + xss(req.params.id));
  
    }
    //A normal delete request will have no body
    else{
    await userData.removeUser(xss(req.params.id));
    res.redirect('/users/');

    }
  } catch (e) {
    res.sendStatus(500);
  }
});





module.exports = router;
