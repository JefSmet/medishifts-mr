import { useState } from 'react';
import MonthView from '../components/monthCalendar';
import MonthYearSelector from '../components/MonthYearSelector';
import axios from 'axios';

const apiRoute = `${import.meta.env.VITE_API_ROUTE}/activities/period/`;

export async function loader({ request }) {
  const url = new URL(request.url);
  const month = url.searchParams.get('month') || new Date().getMonth() + 1;
  const year = url.searchParams.get('year') || new Date().getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const startWeekBefore = new Date(
    startDate.getTime() - 6 * 24 * 60 * 60 * 1000,
  );
  const endWeekAfter = new Date(endDate.getTime() + 8 * 24 * 60 * 60 * 1000);

  const response = await axios.get(
    `${apiRoute}${startWeekBefore.toISOString().slice(0, 10)}/${endWeekAfter.toISOString().slice(0, 10)}`,
  );

  return { month, year, activities: response.data };
}

export default function Werkrooster() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
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
      <MonthView month={month} year={year} />
    </div>
  );
}
