import _sequelize from 'sequelize';
import _qualificationCode from './bescoQualificationCode.js';

const DataTypes = _sequelize.DataTypes;

export default function initBescoModels(sequelize) {
  const qualificationCode = _qualificationCode.init(sequelize, DataTypes);
  return {
    qualificationCode,
  };
}
