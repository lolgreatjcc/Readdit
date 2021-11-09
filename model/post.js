var sequelize = require('./sequelize/databaseModel.js');
const { Post, Subreaddit, User } = sequelize.models;
const {Op} = require("sequelize");

var post = {
    createPost: function (title, content, fk_subreaddit_id, fk_user_id,callback) {
        Post.create({
            title: title,
            content: content,
            fk_subreaddit_id: fk_subreaddit_id,
            fk_user_id: fk_user_id
        }).then(function (result) {
            console.log(result)
            return callback(null,result);
        }).catch(function (err) {
            console.log(err)
            return callback(err,null);
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