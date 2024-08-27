import { useState, useEffect } from 'react';
import MonthView from '../components/monthCalendar';
import MonthYearSelector from '../components/MonthYearSelector';
import axios from 'axios';
import Stats from '../components/stats';

const apiRoute = `${import.meta.env.VITE_API_ROUTE}activities/period/`;

export default function Werkrooster() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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
          `${apiRoute}${startWeekBefore.toISOString().slice(0, 10)}/${endWeekAfter.toISOString().slice(0, 10)}`,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 flex flex-col">
      <MonthYearSelector
        defaultMonth={month}
        defaultYear={year}
        onChange={({ month, year }) => {
          setMonth(month);
          setYear(year);
        }}
      />
      <MonthView month={month} year={year} events={activities} />
      <Stats />
    </div>
  );
}
