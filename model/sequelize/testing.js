const sequelize = require('./databaseModel');

async function test() {
    console.log(sequelize.models.user)
    const User_Type = sequelize.models.user_type;
    User_Type.findAll({raw: true, attributes: ['user_type']}).then(function(result) {
        console.log(result)
    })
}

test();