import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class user_roles extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
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
      },
    );
  }
}
