const mongoCollections = require('../config/mongoCollections');
const replies = mongoCollections.replies;
const uuid = require('uuid/v4');
const postData = require('./posts');


let exportedMethods = {

    async getReplybyId(id){
    const replyCollection = await replies();
    const reply = await replyCollection.findOne({_id: id});
    if (!reply) throw 'reply not found';
    return reply;
    },

    async addReply(postid,userid,text){
        const replyCollection = await replies();
        if (typeof text !== 'string') throw 'No text provided';
        let newReply = {
            id: uuid(),
            postid: postid,
            userid: userid,
            text: text
        }
        const newInsertInformation = await replyCollection.insertOne(newReply);
        const newId = newInsertInformation.insertedId;

    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    await postData.addReplyToPost(postid, newId);
    // return await this.getReplyById(newInsertInformation.insertedId);

    },

    async removeReply(replyid){
    const replyCollection = await replies();

    let reply = null;

    try {

      reply = await this.getReplyById(replyid);

    } catch (e) {

      console.log(e);

      return;

    }

    const deletionInfo = await replyCollection.removeOne({_id: replyid});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }

    await postData.removeReplyFromPost(reply.postid, replyid);
    return true;

    }
};





module.exports = exportedMethods;