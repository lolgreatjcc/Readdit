var sequelize = require('./sequelize/databaseModel.js');
const { Op } = require("sequelize");
const { Media, Post, Subreaddit } = sequelize.models;

var media = {
    createMedia: function (media_url, content_type, fk_post_id, callback) {
        Media.create({
            media_url: media_url,
            fk_content_type: content_type,
            fk_post_id: fk_post_id
        }).then(function (result) {
            console.log(result)
            return callback(null, result);
        }).catch(function (err) {
            console.log(err)
            return callback(err, null);
        })
    },

    getMedia: function (fk_post_id, callback) {
        // find multiple entries
        Media.findAll({
            where: {

                [Op.and]: [
                    { fk_post_id: fk_post_id }
                ]
            }
        })
            .then(function (result) {
                return callback(null, result);
            })
    },

    getAllMediaBySubreaddit: function (subreaddit_id, callback) {

        Post.findAll({
            attributes: ['post_id'],
            include: [
            {
                model: Subreaddit,
                attributes: ['subreaddit_id'],
                where: { subreaddit_id: subreaddit_id }
            },
            {
                model: Media
            }
        ]
        }).then(function (result) {
            callback(null, result)
        }).catch(function (err) {
            console.log(err)
            callback(err, null)
        })
    },
}

module.exports = media;