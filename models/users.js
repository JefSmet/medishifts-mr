const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'persons',
          key: 'id',
        },
      },
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'dbo',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PK_users',
          unique: true,
          fields: [{ name: 'person_id' }],
        },
      ],
    }
  );
};
