//ADES CA1 Play2Win
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('readdit', 'root', 'password', {
    host:'localhost',
    dialect: 'mysql',
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    },
    define: {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
    }
});


// Checks Connection to Database
(async () => {try {
    await sequelize.authenticate();
    console.log("Sequelize established connection with database successfully");
}catch (error) {
    console.error("Unable to connect to the database", error);
}})();

const User = sequelize.define('User', {
    user_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    username : {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    email : {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password : {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    profile_pic : {
        type: DataTypes.STRING,
        allowNull: true
    },
    two_fa : {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    fk_user_type_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at : {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

const User_Type = sequelize.define('User_Type', {
    user_type_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    user_type: {
        type: DataTypes.STRING(45),
        allowNull:false
    }
})

async function syncing() { 
    await User.sync();
    console.log("All Models synchronized successfully.");
}
syncing();

module.exports = sequelize;

