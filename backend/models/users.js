import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class users extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
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
        user_role_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'user_roles',
            key: 'id',
          },
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
      },
    );
  }
}
