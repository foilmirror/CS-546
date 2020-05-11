const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;

router.get('/', async (req, res) => {
    res.render('search/index');
});

router.post('/', async (req, res) => {
    let SearchData = req.body;
    let errors = [];

    if (!SearchData.text) {
      errors.push('No text provided');
    }
    if (errors.length > 0) {
        res.render('search/index', {
          errors: errors,
          hasErrors: true,
          post: SearchData
        });
        return;
      }
    if(SearchData.searchby=="tag"){
        res.redirect('../posts/tag/'+ SearchData.text)
    }
    if(SearchData.searchby=="user"){
        let Searchuser = await userData.getUserByName(SearchData.text);
        res.redirect('../users/' + Searchuser._id)
    }

});
module.exports = router;