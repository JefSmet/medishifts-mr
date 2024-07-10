import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class doctors extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        person_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'persons',
            key: 'id',
          },
        },
        riziv_PK: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        qualification_code: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        qualification_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'doctors',
        schema: 'dbo',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'PK__doctors__3213E83FD9F29DA7',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
