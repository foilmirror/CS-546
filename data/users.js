const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid/v4');



let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'No users in system!';
    return userList;
  },

  // This is a fun new syntax that was brought forth in ES6, where we can define

  // methods on an object with this shorthand!

  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    if (!user) throw 'User not found';
    return user;
  },

  async addUser(userName,Email,profilePhoto,Gender,City,State,Age,Password) {
    const userCollection = await users();

    let newUser = {
      userName: userName,
      Email: Email,
      profilePhoto: profilePhoto,
      Gender: Gender,
      City: City,
      State: State,
      Age: Age,
      Password: Password,
      _id: uuid()

    };



    const newInsertInformation = await userCollection.insertOne(newUser);

    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    return await this.getUserById(newInsertInformation.insertedId);

  },

  async removeUser(id) {

    const userCollection = await users();

    const deletionInfo = await userCollection.removeOne({_id: id});

    if (deletionInfo.deletedCount === 0) {

      throw `Could not delete user with id of ${id}`;

    }

    return true;

  },

  async updateUser(id, updatedUser) {

    const user = await this.getUserById(id);

    



    let userUpdateInfo = {

        userName: updatedUser.userName,
        Email: updatedUser.Email,
        profilePhoto: updatedUser.profilePhoto,
        Gender: updatedUser.Gender,
        City: updatedUser.City,
        State: updatedUser.State,
        Age: updatedUser.Age,
        Password: updatedUser.Password

    };



    const userCollection = await users();

    const updateInfo = await userCollection.updateOne({_id: id}, {$set: userUpdateInfo});

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';



    return await this.getUserById(id);

  },

  async addPostToUser(userId, postId) {

    let currentUser = await this.getUserById(userId);

    console.log(currentUser);



    const userCollection = await users();

    const updateInfo = await userCollection.updateOne(

      {_id: userId},

      {$addToSet: {posts: {id: postId}}}

    );



    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';



    return await this.getUserById(userId);

  },

  async removePostFromUser(userId, postId) {

    let currentUser = await this.getUserById(userId);

    console.log(currentUser);



    const userCollection = await users();

    const updateInfo = await userCollection.updateOne({_id: userId}, {$pull: {posts: {id: postId}}});

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';



    return await this.getUserById(userId);

  },

  async addFriendtoUser(userId, friendID){
    let currentUser = await this.getUserById(userId);
    console.log(currentUser)
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(

      {_id: userId},
    
      {$addToSet: {friends: {id: friendID}}}

    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await this.getUserById(userId);

  },

  async removeFriend(userId, friendID){
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({_id: userId}, {$pull: {friends: {id: friendID}}});

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await this.getUserById(userId);
  }
  };





module.exports = exportedMethods;