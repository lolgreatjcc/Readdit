var sequelize = require('./sequelize/databaseModel.js');

const { Post, Subreaddit, User, Saved } = sequelize.models;
const { Op } = require("sequelize");

var post = {
    createPost: function (title, content, fk_subreaddit_id, fk_user_id, callback) {
        Post.create({
            title: title,
            content: content,
            fk_subreaddit_id: fk_subreaddit_id,
            fk_user_id: fk_user_id
        }).then(function (result) {
            console.log(result)
            return callback(null, result);
        }).catch(function (err) {
            console.log(err)
            return callback(err, null);
        })
    },
    getPostsInSubreaddit: function (subreaddit_name, callback) {
        Post.findAll({
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Subreaddit,
                    where: { subreaddit_name: subreaddit_name },
                    attributes: ['subreaddit_name']
                }
            ],
        }).then(function (result) {
            console.log(result)

            callback(result, null)
        }).catch(function (err) {
            console.log(err)
            callback(null, err)
        })
    },
    getOnePostInSubreaddit: function (subreaddit_name, post_id, callback) {
        Post.findOne({
            where: { post_id: post_id },
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Subreaddit,
                    where: { subreaddit_name: subreaddit_name },
                    attributes: ['subreaddit_name']
                }
            ],
        }).then(function (result) {
            console.log(result)
            callback(result, null)
        }).catch(function (err) {
            console.log(err)
            callback(null, err)
        })
    },
    getPost: function (post_id, callback) {
        Post.findOne({
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
            where: { post_id: post_id },

            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Subreaddit,
                    attributes: ['subreaddit_name']
                }
            ],

        }).then(function (result) {
            console.log(result)
            callback(result, null)
        }).catch(function (err) {
            console.log(err)
            callback(null, err)
        })
    },
    searchPost: function (title, callback) {
        Post.findAll({
            where: { title: { [Op.like]: "%" + title + "%" } },
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at', "fk_subreaddit_id", "fk_user_id"],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Subreaddit,
                    attributes: ['subreaddit_name']
                }
            ],
        }).then(function (result) {
            console.log(result);
            callback(null, result);
        }).catch(function (err) {
            console.log(err);
            callback(err, null);
        })
    },
    savePost: function (post_id, user_id, callback) {
        Saved.create({
            fk_post_id: post_id,
            fk_user_id: user_id
        }).then(function (result) {
            return callback(result, null);
        }).catch(function (err) {
            return callback(null, err);
        })
    },
    getSavedPosts: function (user_id, callback) {
        Saved.findAll({
            where: { fk_user_id: user_id },
            attributes: ['fk_post_id'],
            include: [
                {
                    model: Post,
                    attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
                    include: [
                        {
                            model: User,
                            attributes: ['username']
                        },
                        {
                            model: Subreaddit,
                            attributes: ['subreaddit_name']
                        }
                    ],
                }
            ],
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        })
    },
    unsavePost: function (post_id, user_id, callback) {
        Saved.destroy({
            where: { fk_post_id: post_id, fk_user_id: user_id }
        }).then(function (result) {
            console.log("deletion success")
            return callback(result, null);
        }).catch(function (err) {
            console.log("error happened")
            return callback(null, err);
        })
    },

    getOnePostInSubreaddit: function (subreaddit_name, post_id, callback) {
        Post.findOne({
            where : {post_id: post_id},
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
            include: [
                  {
                      model: User,
                      attributes: ['username']
                  }, 
                  {   
                      model: Subreaddit,
                    where: {subreaddit_name: subreaddit_name},
                    attributes: ['subreaddit_name']
                }
            ],
        }).then(function (result) {
            console.log(result)
          callback(result,null)
        }).catch(function (err) {
            console.log(err)
            callback(null,err)
        })
    },

    getPost: function (post_id, callback) {
        Post.findOne({
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at'],
            where: {post_id: post_id},

            include: [
                {
                    model: User,
                    attributes: ['username']
                }, 
                {   
                    model: Subreaddit,
                  attributes: ['subreaddit_name']
                }
            ],

        }).then(function (result) {
            console.log(result)
          callback(result,null)
        }).catch(function (err) {
            console.log(err)
            callback(null,err)
        })
    },
    searchPost: function (title, callback) {
        Post.findAll({
            where : {title: {[Op.like]: "%" + title + "%"}},
            attributes: ['post_id', 'title', 'content', 'pinned', 'created_at', "fk_subreaddit_id", "fk_user_id"],
            include: [
                {
                    model: User,
                    attributes: ['username']
                }, 
                {   
                    model: Subreaddit,
                    attributes: ['subreaddit_name']
                }
            ],
        }).then(function (result) {
            console.log(result);
            callback(null,result);
        }).catch(function (err) {
            console.log(err);
            callback(err,null);
        })
    },
}

module.exports = post;