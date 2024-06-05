const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bescoQualificationCode',
    {
      ProfessionCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      Code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      DescriptionNL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      DescriptionFR: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      LastModifiedOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'QualificationCode',
      schema: 'dbo',
    }
  );
};
