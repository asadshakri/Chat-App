const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const groups= sequelize.define("groups",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    uuid:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    }
});

module.exports=groups;