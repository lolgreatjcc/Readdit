var sequelize = require('./sequelize/databaseModel.js');
const { Post_Vote, Comment_Vote } = sequelize.models;

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

