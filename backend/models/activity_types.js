import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class activity_types extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        isWork: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
      },
    );
  }
}
