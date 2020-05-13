const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const postData = data.posts;
const userData = data.users;
const replyData = data.replies;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const main = async () => {
	const db = await dbConnection();
    // await db.dropDatabase();
    const h = await bcrypt.hash("123",saltRounds);

    const firstUser = await userData.addUser("firstUser","Email1","dog","Male","City","NJ","22",h);
    const secondUser = await userData.addUser("secondUser","Email2","dog","Male","City","NJ","22",h);
    const addFriend = await userData.addFriendtoUser(firstUser._id, secondUser._id);
    const addFriend2 = await userData.addFriendtoUser(secondUser._id, firstUser._id);
    const firstPost = await postData.addPost("firstPost title", "firstPost body", ["tag"], firstUser._id, "dog");
    const secondPost = await postData.addPost("secondPost title", "secondPost body", ["tag"], secondUser._id, "dog");
    const firstReply = await replyData.addReply(firstPost._id,secondUser._id,"firstReply");
    
    console.log('Done seeding database');
    
	
	await db.serverConfig.close();
};

main().catch(console.log);
