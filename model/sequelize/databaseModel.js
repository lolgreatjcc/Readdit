//ADES CA1 Play2Win
const { Sequelize, Model, DataTypes } = require('sequelize');

//local credentials, comment as neccessary

// const database = "readdit";
// const user = "root";
// const password = "password"
// const host = 'localhost'

// heroku credentials, comment as neccessary. ensure database has data

const database = "heroku_1c89f72eef4896a";
const user = "b7a6c1ee0950ab";
const password = "3ee893d6"
const host = 'us-cdbr-east-04.cleardb.com'



const sequelize = new Sequelize(database, user, password, {
    host: host,
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
        allowNull: false,

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

const Subreaddit = sequelize.define('Subreaddit', {
    subreaddit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    subreaddit_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    subreaddit_description: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fk_creator_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at : {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    fk_subreaddit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
    fk_flair_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pinned: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

const Media = sequelize.define('Media', {
    media_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    media_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fk_content_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

async function syncing() { 
    await User.sync();
    console.log("All Models synchronized successfully.");
}
syncing();
module.exports = sequelize;

