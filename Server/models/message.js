const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const messages= sequelize.define("messages",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    message:{
        type:DataTypes.TEXT,
        allowNull:false,
    }
});

module.exports=messages;