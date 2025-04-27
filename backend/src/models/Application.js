const { DataTypes, UUIDV4 } = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

module.exports = (sequelize) => {
    sequelize.define('Application', {
        applicationId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: UUIDV4
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        reviewDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        regularDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        regularTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending'
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        by: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        suggestion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}