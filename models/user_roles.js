const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user_roles',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'person_id',
        },
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'user_roles',
      schema: 'dbo',
      timestamps: false,
      indexes: [
        {
          name: 'PK_user_roles',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
