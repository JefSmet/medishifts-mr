import ics from 'ics';
import { Op } from 'sequelize';

export const generateICS = async (models, userId, activityTypes) => {
  // Zorg ervoor dat activityTypes een array is
  if (typeof activityTypes === 'string') {
    activityTypes = activityTypes.split(','); // Als het een string is, splits deze dan in een array
  }

  const activities = await models.activities.findAll({
    where: { person_id: userId, activity_type_id: activityTypes },
    include: [{ model: models.activity_types }],
  });

  const events = activities.map((activity) => ({
    title: activity.activity_type.name,
    start: [
      activity.begin_DT.getFullYear(),
      activity.begin_DT.getMonth() + 1,
      activity.begin_DT.getDate(),
    ],
    end: [
      activity.end_DT.getFullYear(),
      activity.end_DT.getMonth() + 1,
      activity.end_DT.getDate(),
    ],
    description: activity.description,
  }));

  const { error, value } = ics.createEvents(events);

  if (error) {
    throw new Error('Error generating ICS file');
  }

  return value;
};

// export const generateICSForAllDoctors = async (models, activityTypes) => {
//   const activities = await models.activities.findAll({
//     where: { activity_type_id: activityTypes },
//     include: [
//       { model: models.activity_types },
//       { model: models.doctors, include: [{ model: models.persons }] },
//     ],
//   });

//   const events = activities.map((activity) => ({
//     title: `${activity.doctor.person.name} - ${activity.activity_type.name}`,
//     start: [
//       activity.startDate.getFullYear(),
//       activity.startDate.getMonth() + 1,
//       activity.startDate.getDate(),
//     ],
//     end: [
//       activity.endDate.getFullYear(),
//       activity.endDate.getMonth() + 1,
//       activity.endDate.getDate(),
//     ],
//     description: activity.description,
//   }));

//   const { error, value } = ics.createEvents(events);

//   if (error) {
//     throw new Error('Error generating ICS file');
//   }

//   return value;
// };

export const generateICSForAllDoctors = async (
  models,
  activityTypes,
  startDate,
  endDate
) => {
  // Zorg ervoor dat activityTypes een array is
  if (typeof activityTypes === 'string') {
    activityTypes = activityTypes.split(','); // Als het een string is, splits deze dan in een array
  }

  // Als geen startDate of endDate is opgegeven, gebruik dan de huidige jaargrenzen
  const currentYear = new Date().getFullYear();
  const start = startDate ? new Date(startDate) : new Date(currentYear, 0, 1);
  const end = endDate ? new Date(endDate) : new Date(currentYear, 11, 31);

  const activities = await models.activities.findAll({
    where: {
      activity_type_id: activityTypes,
      begin_DT: { [Op.gte]: start },
      end_DT: { [Op.lte]: end },
    },
    include: [
      { model: models.activity_types },
      {
        model: models.persons,
        include: [{ model: models.doctors }],
      },
    ],
  });

  const events = activities.map((activity) => ({
    title: `${activity.person.first_name} ${activity.person.last_name} - ${activity.activity_type.name}`,
    start: [
      activity.begin_DT.getFullYear(),
      activity.begin_DT.getMonth() + 1,
      activity.begin_DT.getDate(),
    ],
    end: [
      activity.end_DT.getFullYear(),
      activity.end_DT.getMonth() + 1,
      activity.end_DT.getDate(),
    ],
    description: activity.description,
  }));

  const { error, value } = ics.createEvents(events);

  if (error) {
    throw new Error('Error generating ICS file');
  }

  return value;
};
