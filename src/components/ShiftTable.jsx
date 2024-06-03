import React from 'react';
import { generateMonthDays } from '../utils';

const ShiftTable = ({
  month,
  year,
  shifts,
  person,
  holidays,
  vacations,
  locale,
  shiftTypes,
}) => {
  const allDays = generateMonthDays(month, year, locale);

  const shiftsMap = shifts.reduce((acc, shiftData) => {
    acc[shiftData.date] = shiftData;
    return acc;
  }, {});

  const isHoliday = (date) => {
    return holidays.some(
      (holiday) => holiday.datum.toDateString() === date.toDateString()
    );
  };

  const isVacation = (date) => {
    return vacations.some(
      (vacation) => date >= vacation.startDate && date <= vacation.endDate
    );
  };

  const getDayColor = (dateRecord) => {
    if (dateRecord.date.getDay() === 0 || dateRecord.date.getDay() === 6)
      return 'bg-red-200'; // Weekend
    if (isHoliday(dateRecord.date)) return 'bg-blue-200'; // Holiday
    if (isVacation(dateRecord.date)) return 'bg-green-200'; // Vacation
    return '';
  };

  return (
    <table className='w-fit bg-white border'>
      <thead>
        <tr>
          <th className='py-2 px-4 min-w-36 border'>Date</th>
          {shiftTypes.map((type, idx) => (
            <th key={idx} className='py-2 px-4 min-w-36 border'>
              {type}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allDays.map((dateRecord, index) => (
          <tr key={index} className='text-center'>
            <td
              className={`py-2 px-4 border ${getDayColor(
                dateRecord
              )} text-left w-fit`}
            >
              {dateRecord.caption}
            </td>
            {Object.keys(shifts[0])
              .slice(1)
              .map((shift, idx) => (
                <td
                  key={idx}
                  className={`py-2 px-4 border ${
                    shiftsMap[dateRecord.isoDate] &&
                    shiftsMap[dateRecord.isoDate][shift] === person
                      ? 'bg-yellow-200'
                      : ''
                  } w-fit`}
                >
                  {shiftsMap[dateRecord.isoDate]
                    ? shiftsMap[dateRecord.isoDate][shift]
                    : ''}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShiftTable;
