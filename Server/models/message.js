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
        allowNull:true,
    },
    roomName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: "text"
      },
    mediaType: {
        type: DataTypes.STRING
      }

});

module.exports=messages;