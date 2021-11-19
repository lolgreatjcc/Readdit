//ADES CA1 Play2Win
const { Sequelize, Model, DataTypes, BOOLEAN } = require('sequelize');

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

Post.belongsTo(Subreaddit, {
    foreignKey: 'fk_subreaddit_id'
});

Post.belongsTo(User, {
    foreignKey: 'fk_user_id'
})

Subreaddit.hasMany(Post, {
    foreignKey: 'fk_subreaddit_id'
});

const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    fk_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

Comment.belongsTo(User, {
    foreignKey: 'fk_user_id'
})

Comment.belongsTo(Post, {
    foreignKey: 'fk_post_id'
})

const Saved = sequelize.define('Saved', {
    saved_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

Saved.belongsTo(User, {
    foreignKey: 'fk_user_id'
})

Saved.belongsTo(Post, {
    foreignKey: 'fk_post_id'
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

Media.belongsTo(Post, {
    foreignKey: 'fk_post_id'
})

Post.hasMany(Media, {
    foreignKey: 'fk_post_id'
})

const Flair = sequelize.define('Flair', {
    flair_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    flair_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    flair_colour: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    fk_subreaddit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Post.belongsTo(Flair, {
    foreignKey: 'fk_flair_id'
})

const Moderator = sequelize.define('Moderator', {
    moderator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    fk_subreaddit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const Post_Vote = sequelize.define('Post_Vote', {
    post_vote_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    fk_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vote_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

Post.hasMany(Post_Vote, {
    foreignKey: 'fk_post_id'
})

Post_Vote.belongsTo(Post, {
    foreignKey: 'fk_post_id'
});

const Comment_Vote = sequelize.define('Comment_Vote', {
    comment_vote_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    fk_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vote_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

const Report = sequelize.define('Report', {
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
    },
    report_description: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },

    fk_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: true
    }
})

Report.belongsTo(User, {
    foreignKey: 'fk_user_id'
})

Report.belongsTo(Post, {
    foreignKey: 'fk_post_id'
})


async function syncing() { 
    await User.sync();
    console.log("All Models synchronized successfully.");
}
syncing();
module.exports = sequelize;

