require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const pgtools = require('pgtools');

const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    logging: false,
    native: false,
});

const createDatabase = async () => {
    try {
        await pgtools.createdb({
            user: DB_USER,
            password: DB_PASSWORD,
            host: DB_HOST,
            port: DB_PORT,
        }, DB_NAME);
        console.log(`Database ${DB_NAME} created successfully.`);
    } catch (err) {
        if (err.name === 'duplicate_database') {
            console.log(`Database ${DB_NAME} already exists.`);
        } else {
            console.error('Error creating database:', err);
            process.exit(1);
        }
    }
};

const initializeDatabase = async () => {
    await createDatabase();
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
};

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, './models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, './models', file)));
    });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos 
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const {
    User,
    Record,
    Application,
    Module
} = sequelize.models;

User.hasMany(Record, {
    foreignKey: 'userId',
    // onDelete: 'CASCADE',
    hooks: true,
})
Record.belongsTo(User, { foreignKey: 'userId' })
Record.hasOne(Application, {
    foreignKey: 'recordId',
    as: 'application',
    // onDelete: 'CASCADE',
    hooks: true,
});
Application.belongsTo(Record, { foreignKey: 'recordId', as: 'record' });
User.hasMany(Application, {
    foreignKey: 'userId',
    // onDelete: 'CASCADE',
    hooks: true,
});
Application.belongsTo(User, { foreignKey: 'userId' });

Module.hasMany(Record, { foreignKey: 'moduleId' });
Record.belongsTo(Module, { foreignKey: 'moduleId' });
module.exports = {
    ...sequelize.models,
    conn: sequelize,
    initializeDatabase
};
