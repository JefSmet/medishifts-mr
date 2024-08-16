import React, { useEffect, useState } from 'react';

const MonthYearSelector = ({
  defaultMonth = new Date().getMonth() + 1,
  defaultYear = new Date().getFullYear(),
  onChange,
}) => {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(navigator.language, { month: 'long' }).format(
      new Date(2000, i),
    ),
  );

  useEffect(() => {
    if (onChange) {
      onChange({ month, year });
    }
  }, [month, year, onChange]);

  const handleMonthChange = (newMonth) => {
    if (newMonth < 1) {
      setMonth(12);
      setYear(year - 1);
    } else if (newMonth > 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  return (
    <div className="flex items-center space-x-4 p-4 dark:bg-gray-800 dark:text-white">
      <MonthSelector
        month={month}
        onMonthChange={handleMonthChange}
        monthNames={monthNames}
      />
      <YearSelector year={year} onYearChange={handleYearChange} />
    </div>
  );
};

const MonthSelector = ({ month, onMonthChange, monthNames }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onMonthChange(month === 0 ? 12 : month - 1)}
        className="dark:bg-gray-700 dark:text-white"
      >
        {'<'}
      </button>
      <select
        value={month}
        onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
        className="dark:bg-gray-700 dark:text-white"
      >
        {monthNames.map((name, index) => (
          <option key={index} value={index + 1}>
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={() => onMonthChange(month === 13 ? 1 : month + 1)}
        className="dark:bg-gray-700 dark:text-white"
      >
        {'>'}
      </button>
    </div>
  );
};

const YearSelector = ({ year, onYearChange }) => {
  const yearOptions = [];
  for (let i = year - 5; i <= year + 5; i++) {
    yearOptions.push(i);
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onYearChange(year - 1)}
        className="dark:bg-gray-700 dark:text-white"
      >
        {'<'}
      </button>
      <select
        value={year}
        onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
        className="dark:bg-gray-700 dark:text-white"
      >
        {yearOptions.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>
      <button
        onClick={() => onYearChange(year + 1)}
        className="dark:bg-gray-700 dark:text-white"
      >
        {'>'}
      </button>
    </div>
  );
};

export default MonthYearSelector;
