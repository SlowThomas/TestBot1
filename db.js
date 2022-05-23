// essentially importing the sequelize package
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

// tellings sequelize where our database is located
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

// DATATYPES
// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types

const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    lastName: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    favColor: DataTypes.STRING,
    favDay: DataTypes.STRING,
    userEmail: DataTypes.STRING
});

const Timer = sequelize.define('Timer', {
    // Model attributes are defined here
    reminder: DataTypes.STRING,
    time: DataTypes.DATE,
    channelID: DataTypes.STRING,
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    }
});


module.exports = { sequelize, User, Timer };