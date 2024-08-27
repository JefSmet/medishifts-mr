import { useState, useEffect } from 'react';
import VerlofCalendar from './verlofCalendar';
import MonthYearSelector from './MonthYearSelector';
import axios from 'axios';
import { parseJwt } from '../utils/tokenStorage';

const apiRoute = import.meta.env.VITE_API_ROUTE;
export default function AddVerlof() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const personId = parseJwt(localStorage.getItem('jwtToken')).id;
  const verlofId = 'CEA9E986-D24D-4B16-B9A4-3E8A0BB28BCD';

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (errors.startDate) {
      setErrors({ ...errors, startDate: '' });
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    if (errors.endDate) {
      setErrors({ ...errors, endDate: '' });
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const startWeekBefore = new Date(
          startDate.getTime() - 6 * 24 * 60 * 60 * 1000,
        );
        const endWeekAfter = new Date(
          endDate.getTime() + 8 * 24 * 60 * 60 * 1000,
        );

        const response = await axios.get(
          `${apiRoute}activities/period/${startWeekBefore.toISOString().slice(0, 10)}/${endWeekAfter.toISOString().slice(0, 10)}/0`,
        );
        setActivities(response.data);
      } catch (error) {
        console.error(
          'Er is een fout opgetreden tijdens het ophalen van de activiteiten:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [month, year]);
  // Huidige datum in het formaat YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // Validatie van startDate
    if (!startDate) {
      newErrors.startDate = 'Startdatum moet worden ingevuld.';
    }

    // Validatie van endDate
    if (!endDate) {
      setEndDate(startDate); // Als einddatum leeg is, stel deze gelijk aan startdatum
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Helper functie om een array van datums te genereren tussen start en end
    const generateDateRange = (start, end) => {
      const dateArray = [];
      let currentDate = new Date(start);

      while (currentDate <= new Date(end)) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    };

    const dateRange = generateDateRange(startDate, endDate);

    try {
      for (const date of dateRange) {
        const begin_DT = new Date(date);
        begin_DT.setHours(0, 0, 0, 0);

        const eind_DT = new Date(date);
        eind_DT.setHours(23, 59, 59, 999);

        const response = await axios.post(
          `${import.meta.env.VITE_API_ROUTE}activities`,
          {
            begin_DT: begin_DT.toISOString(),
            end_DT: eind_DT.toISOString(),
            activity_type_id: verlofId,
            person_id: personId,
            status: 'AV',
          },
        );
        console.log(
          `Verlof aangemaakt voor ${begin_DT.toDateString()}:`,
          response.data,
        );
      }

      // Succesbericht in de console (of je kunt een ander succesindicator tonen)
      console.log(
        'Verlofaanvraag succesvol ingediend voor alle geselecteerde dagen.',
      );
    } catch (error) {
      console.error(
        'Er is een fout opgetreden bij het indienen van verlof:',
        error,
      );
      // Optioneel: je kunt hier ook een algemene foutmelding tonen
    }
  }

  async function handleDelete(e) {
    e.preventDefault();

    const newErrors = {};

    // Validatie van startDate
    if (!startDate) {
      newErrors.startDate = 'Startdatum moet worden ingevuld.';
    }

    // Validatie van endDate
    if (!endDate) {
      setEndDate(startDate); // Als einddatum leeg is, stel deze gelijk aan startdatum
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ROUTE}activities/verlof/${personId}/${startDate}/${endDate}`,
      );
      console.log('Verlof verwijderd:', response.data);
    } catch (error) {
      console.error(
        'Er is een fout opgetreden bij het verwijderen van verlof:',
        error,
      );
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Verlof aanvragen
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Geef hier de gegevens van het verlof in.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="begin_DT"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Startdatum
                </label>
                <div className="mt-2">
                  <input
                    id="begin_DT"
                    name="begin_DT"
                    type="date"
                    value={startDate}
                    min={today} // Min is de huidige datum
                    onChange={handleStartDateChange}
                    className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.startDate ? 'ring-red-500' : 'ring-gray-300'
                    } focus:ring-2 focus:ring-inset ${
                      errors.startDate
                        ? 'focus:ring-red-500'
                        : 'focus:ring-indigo-600'
                    } sm:text-sm sm:leading-6`}
                  />
                  {errors.startDate && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="start-date-error"
                    >
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="end_DT"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Einddatum
                </label>
                <div className="mt-2">
                  <input
                    id="end_DT"
                    name="end_DT"
                    type="date"
                    value={endDate}
                    min={startDate || today} // Min is de startdatum of de huidige datum
                    onChange={handleEndDateChange}
                    className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.endDate ? 'ring-red-500' : 'ring-gray-300'
                    } focus:ring-2 focus:ring-inset ${
                      errors.endDate
                        ? 'focus:ring-red-500'
                        : 'focus:ring-indigo-600'
                    } sm:text-sm sm:leading-6`}
                  />
                  {errors.endDate && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="end-date-error"
                    >
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Verwijderen
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Aanvragen
          </button>
        </div>
      </form>
      <div className="mt-10">
        <MonthYearSelector
          defaultMonth={month}
          defaultYear={year}
          onChange={({ month, year }) => {
            setMonth(month);
            setYear(year);
          }}
        />
        <VerlofCalendar month={month} year={year} events={activities} />
      </div>
    </>
  );
}
