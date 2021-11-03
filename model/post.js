var sequelize = require('./sequelize/databaseModel.js');
const { Post } = sequelize.models;

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
    }
}

module.exports = post