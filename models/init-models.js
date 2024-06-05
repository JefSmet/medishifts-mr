var DataTypes = require('sequelize').DataTypes;
var _activities = require('./activities');
var _activity_types = require('./activity_types');
var _doctors = require('./doctors');
var _persons = require('./persons');
var _user_roles = require('./user_roles');
var _users = require('./users');

function initModels(sequelize) {
  var activities = _activities(sequelize, DataTypes);
  var activity_types = _activity_types(sequelize, DataTypes);
  var doctors = _doctors(sequelize, DataTypes);
  var persons = _persons(sequelize, DataTypes);
  var user_roles = _user_roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

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
    activities,
    activity_types,
    doctors,
    persons,
    user_roles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
