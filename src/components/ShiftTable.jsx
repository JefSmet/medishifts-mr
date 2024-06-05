import React from 'react';
import { generateMonthDays } from '../utils';

function ShiftTable({
  month,
  year,
  shifts,
  person,
  holidays,
  vacations,
  locale,
  shiftTypes,
}) {
  const allDays = generateMonthDays(month, year, locale);

  const shiftsMap = shifts.reduce(function (acc, shiftData) {
    acc[shiftData.Datum.split('T')[0]] = shiftData;
    return acc;
  }, {});

  function isHoliday(date) {
    return holidays.some(function (holiday) {
      return holiday.datum.toDateString() === date.toDateString();
    });
  }

  function isVacation(date) {
    return vacations.some(function (vacation) {
      return date >= vacation.startDate && date <= vacation.endDate;
    });
  }

  function getDayColor(dateRecord) {
    if (dateRecord.date.getDay() === 0 || dateRecord.date.getDay() === 6)
      return 'bg-red-200'; // Weekend
    if (isHoliday(dateRecord.date)) return 'bg-blue-200'; // Holiday
    if (isVacation(dateRecord.date)) return 'bg-green-200'; // Vacation
    return '';
  }

  function renderShiftTypes(dateRecord) {
    const shiftForDay = shiftsMap[dateRecord.isoDate] || {};
    return shiftTypes.map(function (shiftType, idx) {
      return (
        <td
          key={idx}
          className={`py-2 px-4 border ${
            shiftForDay[shiftType] ? shiftForDay[shiftType].toUpperCase() === person.toUpperCase() ? 'bg-yellow-200' : '' : ''
          } w-fit`}
        >
          {shiftForDay[shiftType] || ''}
        </td>
      );
    });
  }

  function renderRows() {
    return allDays.map(function (dateRecord, index) {
      return (
        <tr key={index} className='text-center'>
          <td
            className={`py-2 px-4 border ${getDayColor(
              dateRecord
            )} text-left w-fit`}
          >
            {dateRecord.caption}
          </td>
          {renderShiftTypes(dateRecord)}
        </tr>
      );
    });
  }

  function renderHeaders() {
    return shiftTypes.map(function (type, idx) {
      return (
        <th key={idx} className='py-2 px-4 min-w-36 border'>
          {type}
        </th>
      );
    });
  }

  return (
    <table className='w-fit bg-white border'>
      <thead>
        <tr>
          <th className='py-2 px-4 min-w-36 border'>Date</th>
          {renderHeaders()}
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
}

export default ShiftTable;
