import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShiftDetail({ selectedDay, shiftTypes }) {
  const [persons, setPersons] = useState([]);
  const [newActivities, setNewActivities] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_ROUTE}persons`)
      .then((response) => {
        console.log(response.data);
        setPersons(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Initialize newActivities with selectedDay activities
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
        console.log(
          `Verander activiteit naar dokter  ${selectedPerson.last_name} ${selectedPerson.first_name}`,
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

    console.log('Data to save:', dataToSave);

    // try {
    //   const response = await axios.post(`${import.meta.env.VITE_API_ROUTE}activities`, dataToSave);
    //   console.log('Activities saved successfully:', response.data);
    //   alert('Activities saved successfully!');
    // } catch (error) {
    //   console.error('Error saving activities:', error);
    //   alert('Error saving activities');
    // }
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
    <div>
      <h2>{selectedDay.caption}</h2>
      {newActivities.map((type, idx) => (
        <div key={idx}>
          <h3>{type.type}</h3>
          <ul>
            {type.activities.map((activity, index) => (
              <li key={index}>
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
                  className="text-red-500 hover:text-red-700"
                >
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddPerson(type.type)}>
            Voeg dokter toe
          </button>
        </div>
      ))}
      <button onClick={handleSave}>Opslaan</button>
    </div>
  );
}
