const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'activities',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'persons',
          key: 'id',
        },
      },
      activity_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'activity_types',
          key: 'id',
        },
      },
      begin_DT: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_DT: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'activities',
      schema: 'dbo',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PK__activiti__3213E83FF17D505B',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
