    const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // Restricción UNIQUE
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        supervisors: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true
        },
        type:{
            type: DataTypes.STRING,
            allowNull:true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true //esta para cambiar a false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    })
}