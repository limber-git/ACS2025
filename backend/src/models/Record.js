const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('Record', {
        recordId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        timeTable: {
            type: DataTypes.STRING,
            allowNull: false
        },
        onDuty: {
            type: DataTypes.TIME,
            allowNull: false
        },
        offDuty: {
            type: DataTypes.TIME,
            allowNull: false
        },
        clockIn: {
            type: DataTypes.TIME,
            allowNull: true
        },
        clockOut: {
            type: DataTypes.TIME,
            allowNull: true
        },
        late: {
            type: DataTypes.TIME,
            allowNull: true
        },
        early: {
            type: DataTypes.TIME,
            allowNull: true
        },
        exception: {
            type: DataTypes.STRING,
            allowNull: true
        },
        workTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mustCIn:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        mustCOut:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    })
}