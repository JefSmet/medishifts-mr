const DataTypes = require('sequelize').DataTypes;
const _qualificationCode = require('./bescoQualificationCode');

function initBescoModels(sequelize) {
  const qualificationCode = _qualificationCode(sequelize, DataTypes);

  return {
    qualificationCode,
  };
}
module.exports = initBescoModels;
module.exports.initBescoModels = initBescoModels;
module.exports.default = initBescoModels;
