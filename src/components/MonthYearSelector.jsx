import React, { useState, useEffect } from 'react';

const MonthYearSelector = ({ defaultMonth = new Date().getMonth(), defaultYear = new Date().getFullYear(), onChange }) => {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const monthNames = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(navigator.language, { month: 'long' }).format(new Date(2000, i)));

  useEffect(() => {
    if (onChange) {
      onChange({ month, year });
    }
  }, [month, year, onChange]);

  const handleMonthChange = (newMonth) => {
    if (newMonth < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (newMonth > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  return (
    <div className="flex items-center space-x-4 dark:bg-gray-800 dark:text-white p-4">
      <MonthSelector month={month} onMonthChange={handleMonthChange} monthNames={monthNames} />
      <YearSelector year={year} onYearChange={handleYearChange} />
    </div>
  );
};

const MonthSelector = ({ month, onMonthChange, monthNames }) => {
  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => onMonthChange(month - 1)} className="dark:bg-gray-700 dark:text-white">{"<"}</button>
      <select
        value={month}
        onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
        className="dark:bg-gray-700 dark:text-white"
      >
        {monthNames.map((name, index) => (
          <option key={index} value={index}>
            {name}
          </option>
        ))}
      </select>
      <button onClick={() => onMonthChange(month + 1)} className="dark:bg-gray-700 dark:text-white">{">"}</button>
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
      <button onClick={() => onYearChange(year - 1)} className="dark:bg-gray-700 dark:text-white">{"<"}</button>
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
      <button onClick={() => onYearChange(year + 1)} className="dark:bg-gray-700 dark:text-white">{">"}</button>
    </div>
  );
};

export default MonthYearSelector;
