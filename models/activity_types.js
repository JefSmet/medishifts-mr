const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'activity_types',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'activity_types',
      schema: 'dbo',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PK__activity__3213E83F6413EE87',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
