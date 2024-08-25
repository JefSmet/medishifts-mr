import ics from 'ics';

export const generateICS = async (models, userId, activityTypes) => {
  const activities = await models.activities.findAll({
    where: { userId, activityTypeId: activityTypes },
    include: [{ model: models.activity_types }],
  });

  const events = activities.map((activity) => ({
    title: activity.activity_type.name,
    start: [
      activity.startDate.getFullYear(),
      activity.startDate.getMonth() + 1,
      activity.startDate.getDate(),
    ],
    end: [
      activity.endDate.getFullYear(),
      activity.endDate.getMonth() + 1,
      activity.endDate.getDate(),
    ],
    description: activity.description,
  }));

  const { error, value } = ics.createEvents(events);

  if (error) {
    throw new Error('Error generating ICS file');
  }

  return value;
};

export const generateICSForAllDoctors = async (models, activityTypes) => {
  const activities = await models.activities.findAll({
    where: { activityTypeId: activityTypes },
    include: [
      { model: models.activity_types },
      { model: models.doctors, include: [{ model: models.persons }] },
    ],
  });

  const events = activities.map((activity) => ({
    title: `${activity.doctor.person.name} - ${activity.activity_type.name}`,
    start: [
      activity.startDate.getFullYear(),
      activity.startDate.getMonth() + 1,
      activity.startDate.getDate(),
    ],
    end: [
      activity.endDate.getFullYear(),
      activity.endDate.getMonth() + 1,
      activity.endDate.getDate(),
    ],
    description: activity.description,
  }));

  const { error, value } = ics.createEvents(events);

  if (error) {
    throw new Error('Error generating ICS file');
  }

  return value;
};
