import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class bescoQualificationCode extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
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
      },
    );
  }
}
