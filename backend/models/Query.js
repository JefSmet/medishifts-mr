import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Query extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        person_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        activity_type_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        begin_DT: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        end_DT: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'Query',
        schema: 'dbo',
        timestamps: false,
      },
    );
  }
}
