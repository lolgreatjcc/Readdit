var sequelize = require('./sequelize/databaseModel.js');
const { Post_Vote, Comment_Vote, Post, Subreaddit } = sequelize.models;

var vote = {
    createPostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
        Post_Vote.create({
            vote_type: vote_type,
            fk_post_id: fk_post_id,
            fk_user_id: fk_user_id
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    // Retrieves all the votes for *all* posts.  
    getPostVotes: function (fk_post_id, callback) {
        Post_Vote.findAll({
            where: {
                fk_post_id: fk_post_id
            }
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    // Retrieves users votes for a specific post
    getUserPostVotes: function (fk_user_id,fk_post_id, callback) {
        Post_Vote.findAll({
            where: {
                fk_post_id: fk_post_id,
                fk_user_id: fk_user_id
            }
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    // Retrieves users votes for a specific subreaddit
    getUserSubreadditPostVotes: function (fk_user_id,fk_subreaddit_id, callback) {
        Post_Vote.findAll({
            where: {
                fk_user_id:fk_user_id
            },
            include: [{
                model: Post,
                include: [{
                    model: Subreaddit,
                    where: {
                        subreaddit_id: fk_subreaddit_id
                    }
                }]
            }]
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            console.log(err);
            callback(null, err);
        });
    },
    updatePostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
        Post_Vote.update({
            vote_type: vote_type
        }, {
            where: {
                fk_post_id: fk_post_id,
                fk_user_id: fk_user_id
            }
        }).then(function (result) {
            callback(result , null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    deletePostVote: function (fk_post_id, fk_user_id, callback) {
        Post_Vote.destroy({
            where: {
                fk_post_id: fk_post_id,
                fk_user_id: fk_user_id
            }
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    getUserVotes: function (fk_user_id, callback) {
        Post_Vote.findAll({
            where: {
                fk_user_id: fk_user_id
            }
        }).then(function (result) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });  
    },
    createCommentVote: function (vote_type, fk_comment_id, fk_user_id, callback) {
        Comment_Vote.create({
            vote_type: vote_type,
            fk_comment_id: fk_comment_id,
            fk_user_id: fk_user_id
        }).then(function (result,) {
            callback(result, null);
        }).catch(function (err) {
            callback(null, err);
        });
    },
    getCommentVotes: function (fk_comment_id, callback) {
        Comment_Vote.findAll({
            where: {
                fk_comment_id: fk_comment_id
            }
        }).then(function (result) {
            callback(result , null);
        }).catch(function (err) {
            callback(null, err);
        });
    },

    updateCommentVote: function (vote_type, fk_comment_id, fk_user_id, callback) {
        Comment_Vote.update({
            vote_type: vote_type
        }, {
            where: {
                fk_comment_id: fk_comment_id,
                fk_user_id: fk_user_id
            }
        }).then(function (result) {
            callback(result , null);
        }).catch(function (err) {
            callback(null, err);
        });
    }
}

module.exports = vote;