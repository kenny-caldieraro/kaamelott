const { DataTypes, Model } = require('sequelize');

const sequelize = require('../sequelize');

class Quotes extends Model {}

Quotes.init(
  {
    content: DataTypes.TEXT,
    actor: DataTypes.TEXT,
    characts: DataTypes.TEXT,
    author: DataTypes.TEXT,
    season: DataTypes.TEXT,
    episode: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'quotes',
  },
);

module.exports = Quotes;
