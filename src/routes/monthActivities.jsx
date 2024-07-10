import { useState } from 'react';
import MonthView from '../components/monthView';
import MonthYearSelector from '../components/MonthYearSelector';

export default function MonthActivityView() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <div className="flex flex-col">
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
