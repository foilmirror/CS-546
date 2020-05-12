const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const users = require('./users');
const uuid = require('uuid/v4');



const exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },

  async getPostsByTag(tag) {
    if (!tag) throw 'No tag provided';
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
  },

  async getPostsbyUser(userId){
    if (!userId) throw 'No user Id provided';
    const postCollection = await posts();
    return await postCollection.find({posterId: userId}).toArray();
  },

  async getPostById(id) {
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: id});

    if (!post) throw 'Post not found';
    return post;
  },

  async addPost(title, body, tags, posterId, images) {
    if (typeof title !== 'string') throw 'No title provided';
    if (typeof body !== 'string') throw 'No body provided';

    if (!Array.isArray(tags)) {
      tags = [];
    }

    if(!Array.isArray(images)){
        images = [];
    }



    const postCollection = await posts();
    const userThatPosted = await users.getUserById(posterId);

    const newPost = {
    userid: posterId,
      title: title,
      body: body,
      tags: tags,
      replies: [],
      images: images,
      _id: uuid()

    };



    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

    await users.addPostToUser(posterId, newId);
    return await this.getPostById(newId);

  },

  async removePost(id) {

    const postCollection = await posts();

    let post = null;

    try {

      post = await this.getPostById(id);

    } catch (e) {

      console.log(e);

      return;

    }

    const deletionInfo = await postCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }

    await users.removePostFromUser(post.userid, id);
    return true;

  },

  async updatePost(id, updatedPost) {
    const postCollection = await posts();
    const updatedPostData = {};

    if (updatedPost.tags) {
      updatedPostData.tags = updatedPost.tags;
    }

    if (updatedPost.title) {
      updatedPostData.title = updatedPost.title;
    }

    if (updatedPost.body) {
      updatedPostData.body = updatedPost.body;
    }

    if(updatedPost.replies){
        updatedPostData.replies = updatedPost.replies;
    }

    if(updatedPost.images){
        updatedPostData.images = updatedPost.images;
    }


    await postCollection.updateOne({_id: id}, {$set: updatedPostData});
    return await this.getPostById(id);

  },

  async renameTag(oldTag, newTag) {
    if (oldTag === newTag) throw 'tags are the same';
    let findDocuments = {
      tags: oldTag
    };



    let firstUpdate = {
      $addToSet: {tags: newTag}
    };



    let secondUpdate = {
      $pull: {tags: oldTag}
    };



    const postCollection = await posts();

    await postCollection.updateMany(findDocuments, firstUpdate);
    await postCollection.updateMany(findDocuments, secondUpdate);

    return await this.getPostsByTag(newTag);

  },
  async addReplytoPost(postId,replyId){
    let currentPost = await this.getPostById(postId);

    const postCollection = await posts();

    const updateInfo = await postCollection.updateOne(

      {_id: postId},

      {$addToSet: {replies: {id: replyId}}}

    );



    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';



    return await this.getPostById(postId);
  },
  async removeReplyfromPost(postId,replyId){
    let currentPost = await this.getPostById(postId);

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne({_id: postId}, {$pull: {replies: {id: replyId}}});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getPostById(userId);

  }

};



module.exports = exportedMethods;