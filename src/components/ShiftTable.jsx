import React from 'react';
import { generateMonthDays } from '../helpers/utils';

function ShiftTable({
  month,
  year,
  shifts,
  lastName,
  holidays,
  vacations,
  locale,
  shiftTypes,
}) {
  const allDays = generateMonthDays(month, year, locale);

  if (!shifts || shifts.length === 0) return;

  function transformActivities(activities) {
    return activities.reduce((acc, activity) => {
      const { begin_DT, activity_type, person } = activity;
      const beginDate = new Date(begin_DT).toISOString().split('T')[0];
      const activityTypeName = activity_type.name;
      const personName = {
        last_name: person.last_name,
        first_name: person.first_name,
      };

      if (!acc[beginDate]) {
        acc[beginDate] = {};
      }

      if (!acc[beginDate][activityTypeName]) {
        acc[beginDate][activityTypeName] = [];
      }

      acc[beginDate][activityTypeName].push(personName);

      return acc;
    }, {});
  }

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
  function renderPersonsForDate(personsForDate) {
    if (!personsForDate || !Array.isArray(personsForDate)) return null;
    return personsForDate.map(function (person, idx) {
      const style = person.last_name.toLowerCase() === lastName.toLowerCase() ? 'bg-yellow-200' : '';
      return <div className={`py-2 px-4 ${style}`} key={idx}>{person.last_name}</div>;
    });
  }

  function renderShiftTypes(dateRecord) {
    const shiftsMap = transformActivities(shifts);
    const shiftForDay = shiftsMap[dateRecord.isoDate] || [];
    return shiftTypes.map(function (shiftType, idx) {
      return (
        <td key={idx} className={`py-2 px-4 border w-fit`}>
          {renderPersonsForDate(shiftForDay[shiftType])}
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
