import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateShiftTypes = () => {
  const [activityTypes, setActivityTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    minutes: '',
    isWork: true,
    sortorder: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Haal activiteitstypes op bij het laden van de component
  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_ROUTE + 'activity_types',
        );
        setActivityTypes(response.data);
      } catch (err) {
        setError('Fout bij het ophalen van activiteitstypes.');
      }
    };

    fetchActivityTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Valideer de invoer
    if (!formData.name || !formData.start_time || !formData.minutes) {
      setError('Alle velden zijn verplicht.');
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_ROUTE + 'activity_types',
        formData,
      );

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          start_time: '',
          minutes: '',
          isWork: true,
          sortorder: '',
        });
        setActivityTypes([...activityTypes, response.data]);
      }
    } catch (err) {
      setError(
        'Er is een fout opgetreden bij het aanmaken van het activiteitstype.',
      );
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_ROUTE + 'activity_types/' + id,
      );
      setActivityTypes(activityTypes.filter((type) => type.id !== id));
    } catch (err) {
      setError(
        'Er is een fout opgetreden bij het verwijderen van het activiteitstype.',
      );
      console.error(err);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded border p-4">
      <h2 className="mb-4 text-xl font-bold">Activiteitstype Aanmaken</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && (
        <div className="mb-4 text-green-500">
          Activiteitstype succesvol aangemaakt!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Naam:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="start_time" className="block text-gray-700">
            Starttijd:
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="minutes" className="block text-gray-700">
            Duur (in minuten):
          </label>
          <input
            type="number"
            id="minutes"
            name="minutes"
            value={formData.minutes}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isWork" className="block text-gray-700">
            Werkgerelateerd:
          </label>
          <input
            type="checkbox"
            id="isWork"
            name="isWork"
            checked={formData.isWork}
            onChange={() =>
              setFormData((prevData) => ({
                ...prevData,
                isWork: !prevData.isWork,
              }))
            }
            className="mr-2 leading-tight"
          />
          <span>{formData.isWork ? 'Ja' : 'Nee'}</span>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white"
        >
          Aanmaken
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Bestaande Activiteitstypes</h3>
        <ul>
          {activityTypes.map((type) => (
            <li
              key={type.id}
              className="mt-2 flex items-center justify-between"
            >
              {type.name} -{' '}
              {new Intl.DateTimeFormat('nl-BE', {
                timeStyle: 'short',
                hourCycle: 'h23',
              }).format(new Date(type.start_time))}{' '}
              {type.isWork ? 'Werk' : 'Niet Werk'}{' '}
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemove(type.id)}
              >
                Verwijderen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateShiftTypes;
