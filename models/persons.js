import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class persons extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
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
      },
    );
  }
}
