const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'persons',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'persons',
      schema: 'dbo',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PK__persons__3213E83F06103CCC',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
