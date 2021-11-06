var sequelize = require('./sequelize/databaseModel.js');
const { Post, Subreaddit, User } = sequelize.models;

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
    }
}

module.exports = post