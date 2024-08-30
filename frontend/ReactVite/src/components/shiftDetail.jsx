import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShiftDetail({
  selectedDay,
  shiftTypes,
  activities,
  updateActivities,
}) {
  const [persons, setPersons] = useState([]);
  const [newActivities, setNewActivities] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_ROUTE}persons-staffmembers`)
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedDay.activities) return;

    const activitiesCopy = shiftTypes.map((type) => ({
      isoDate: selectedDay.isoDate,
      caption: selectedDay.caption,
      type: type.name,
      activities: selectedDay.activities[type.name] || [],
    }));
    setNewActivities(activitiesCopy);
  }, [selectedDay, shiftTypes]);

  function handlePersonChange(activityType, activityIndex, event) {
    const selectedPersonId = event.target.value;
    if (selectedPersonId) {
      const selectedPerson = persons.find(
        (person) => person.id === selectedPersonId,
      );
      if (selectedPerson) {
        setNewActivities((prevActivities) =>
          prevActivities.map((type) =>
            type.type === activityType
              ? {
                  ...type,
                  activities: type.activities.map((activity, index) =>
                    index === activityIndex
                      ? {
                          ...activity,
                          last_name: selectedPerson.last_name,
                          first_name: selectedPerson.first_name,
                        }
                      : activity,
                  ),
                }
              : type,
          ),
        );
      }
    }
  }

  async function handleSave() {
    const filteredActivities = newActivities.map((activityGroup) => ({
      ...activityGroup,
      activities: activityGroup.activities.filter(
        (activity) => activity.first_name && activity.last_name,
      ),
    }));

    const dataToSave = {
      activities: filteredActivities.reduce((acc, group) => {
        acc[group.type] = group.activities;
        return acc;
      }, {}),
      caption: selectedDay.caption,
      isoDate: selectedDay.isoDate,
    };

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_ROUTE}activities/day/${selectedDay.isoDate}`,
      );

      for (const [shiftType, activities] of Object.entries(
        dataToSave.activities,
      )) {
        for (const activity of activities) {
          await axios.post(`${import.meta.env.VITE_API_ROUTE}activities`, {
            person_id: activity.id,
            begin_DT: activity.beginDT,
            end_DT: activity.endDT,
            activity_type_id: activity.activityTypeId,
            status: 'OK',
          });
        }
      }

      const { year, month } = selectedDay.isoDate.split('-').reduce(
        (acc, value, index) => {
          acc[index === 0 ? 'year' : index === 1 ? 'month' : 'day'] = value;
          return acc;
        },
        { year: null, month: null, day: null },
      );
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const response = await axios.get(
        `${import.meta.env.VITE_API_ROUTE}activities/period/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}/1`,
      );
      updateActivities(response.data);
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }

  function handleAddPerson(activityType) {
    setNewActivities((prevActivities) =>
      prevActivities.map((type) =>
        type.type === activityType
          ? {
              ...type,
              activities: [
                ...type.activities,
                { last_name: '', first_name: '' },
              ],
            }
          : type,
      ),
    );
  }

  function handleRemovePerson(activityType, activityIndex) {
    setNewActivities((prevActivities) =>
      prevActivities.map((type) =>
        type.type === activityType
          ? {
              ...type,
              activities: type.activities.filter(
                (_, index) => index !== activityIndex,
              ),
            }
          : type,
      ),
    );
  }

  if (!selectedDay.activities) return null;

  return (
    <div className="mx-auto w-full max-w-xl rounded-lg bg-gray-100 p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        {selectedDay.caption}
      </h2>
      {newActivities.map((type, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            {type.type}
          </h3>
          <ul className="space-y-4">
            {type.activities.map((activity, index) => (
              <li key={index} className="flex items-center space-x-4">
                <select
                  value={
                    persons.find(
                      (person) =>
                        person.first_name === activity.first_name &&
                        person.last_name === activity.last_name,
                    )?.id || ''
                  }
                  onChange={(event) =>
                    handlePersonChange(type.type, index, event)
                  }
                  className="block rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Selecteer dokter</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.last_name} {person.first_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemovePerson(type.type, index)}
                  className="font-medium text-red-500 hover:text-red-700"
                >
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleAddPerson(type.type)}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Voeg dokter toe
          </button>
        </div>
      ))}
      <button
        onClick={handleSave}
        className="mt-6 w-full rounded-md bg-green-500 px-6 py-3 text-white hover:bg-green-600"
      >
        Opslaan
      </button>
    </div>
  );
}
