var sequelize = require('./sequelize/databaseModel.js');
const { Comment, User, Post, Subreaddit } = sequelize.models;

var comment = {
    createComment: function (user_id, comment, post_id, callback) {
        Comment.create({
            fk_user_id: user_id,
            comment: comment,
            fk_post_id: post_id
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            console.log(err);
            return callback( err, null);
        });
    },
    getCommentsOfPost: function (post_id, callback) {
        console.log(post_id)
        Comment.findAll({
            attributes: ['comment', 'fk_post_id', 'created_at'],
            where: {
                fk_post_id: post_id
            },
            include: [{
                model: User,
                attributes: ['username'],
            }]
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback( err, null);
        });
    },
    getCommentsByUser: function (user_id, callback) {
        Comment.findAll({
            attributes: ['comment', 'fk_post_id', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['user_id'],
                    where: { user_id: user_id }
                },
                {
                    model: Post,
                    attributes: ['title']
                },
            ],
        }).then(function (result) {
            callback(result, null)
        }).catch(function (err) {
            console.log(err)
            callback(null, err)
        })
    },
}

module.exports = comment;