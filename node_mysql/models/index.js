const Sequelize = require('sequelize');
const Item = require('./item')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize =Sequelize;
db.sequelize = sequelize;

db.Item = Item
Item.init(sequelize)

module.exports = db;