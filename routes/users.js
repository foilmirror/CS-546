const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/new', async (req, res) => {
	res.render('users/register', {});
});

router.get('/:id', async (req, res) => {
  try {
    let c_user = await userData.getUserById(req.params.id);
    res.render('users/user', {user: c_user});
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

router.post('/', async (req, res) => {
  let userInfo = req.body;
  console.log(userInfo)
  if (!userInfo) {
    res.status(400).json({error: 'You must provide data to create a user'});
    return;
  }

  if (!userInfo.userName) {
    res.status(400).json({error: 'You must provide a user name'});
    return;
  }

  if (!userInfo.Email) {
    res.status(400).json({error: 'You must provide a Email'});
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
    const newUser = await userData.addUser(userInfo.userName,userInfo.Email,userInfo.profilePhoto,userInfo.Gender,userInfo.City,userInfo.State,userInfo.Age,userInfo.Password);
    res.render('users/user', {user: newUser});
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  let userInfo = req.body;

  if (!userInfo) {
    res.status(400).json({error: 'You must provide data to create a user'});
    return;
  }

  if (!userInfo.userName) {
    res.status(400).json({error: 'You must provide a user name'});
    return;
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
  } catch (e) {
    res.status(404).json({error: 'User not found'});
    return;
  }
  try {
    //If the updated thing was supposed to be friends, it will be here (happens when a person adds someone as a friend)
    if(userInfo.friends){
      await userData.addFriendtoUser(req.params.id,userInfo.friends)
      const updatedUser = await userData.updateUser(req.params.id, userInfo);
      res.json(updatedUser);
    }
    const updatedUser = await userData.updateUser(req.params.id, userInfo);
    res.json(updatedUser);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userData.getUserById(req.params.id);
  } catch (e) {
    res.status(404).json({error: 'User not found'});
    return;
  }

  try {
    //This will handle deleting users from friend lists (when a button is pressed on the actual site)
    //This is because removing friends is a user to user thing so idk where else this would go lol
    if(req.body.userID){
      await userData.removeFriend(req.params.id,req.body.userID)
      res.sendStatus(200);
    }
    //A normal delete request will have no body
    else{
    await userData.removeUser(req.params.id);
    res.sendStatus(200);
    }
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
