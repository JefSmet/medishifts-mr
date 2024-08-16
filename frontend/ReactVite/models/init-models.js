import _sequelize from 'sequelize';
import _Query from './Query.js';
import _activities from './activities.js';
import _activity_types from './activity_types.js';
import _doctors from './doctors.js';
import _persons from './persons.js';
import _user_roles from './user_roles.js';
import _users from './users.js';
const DataTypes = _sequelize.DataTypes;

export default function initModels(sequelize) {
  const Query = _Query.init(sequelize, DataTypes);
  const activities = _activities.init(sequelize, DataTypes);
  const activity_types = _activity_types.init(sequelize, DataTypes);
  const doctors = _doctors.init(sequelize, DataTypes);
  const persons = _persons.init(sequelize, DataTypes);
  const user_roles = _user_roles.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  activities.belongsTo(activity_types, { foreignKey: 'activity_type_id' });
  activity_types.hasMany(activities, { foreignKey: 'activity_type_id' });
  activities.belongsTo(persons, { foreignKey: 'person_id' });
  persons.hasMany(activities, { foreignKey: 'person_id' });
  doctors.belongsTo(persons, { foreignKey: 'person_id' });
  persons.hasMany(doctors, { foreignKey: 'person_id' });
  users.belongsTo(persons, { foreignKey: 'person_id' });
  persons.hasOne(users, { foreignKey: 'person_id' });
  user_roles.belongsTo(users, { foreignKey: 'user_id' });
  users.hasMany(user_roles, { foreignKey: 'user_id' });

  return {
    Query,
    activities,
    activity_types,
    doctors,
    persons,
    user_roles,
    users,
  };
}
