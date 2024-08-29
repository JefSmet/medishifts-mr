import React from 'react';
import { generateMonthDays, toDateOnlyString } from '../utils/dateTimeUtils';

function ShiftTable({
  month,
  year,
  shifts,
  lastName,
  holidays,
  vacations,
  locale,
  shiftTypes,
  onDaySelect, // Nieuwe prop voor het bijwerken van de geselecteerde dag
}) {
  const allDays = generateMonthDays(month, year, locale);

  if (!shifts || shifts.length === 0) return;

  function transformActivities(activities) {
    return activities.reduce((accumulator, activity) => {
      const { begin_DT, activity_type, person } = activity;
      const beginDate = toDateOnlyString(begin_DT);
      const activityTypeName = activity_type.name;
      const personName = {
        last_name: person.last_name,
        first_name: person.first_name,
      };

      if (!accumulator[beginDate]) {
        accumulator[beginDate] = {};
      }

      if (!accumulator[beginDate][activityTypeName]) {
        accumulator[beginDate][activityTypeName] = [];
      }

      accumulator[beginDate][activityTypeName].push(personName);
      accumulator[beginDate][activityTypeName].sort((a, b) => {
        if (a.first_name < b.first_name) {
          return -1;
        } else if (a.first_name > b.first_name) {
          return 1;
        } else {
          if (a.last_name < b.last_name) {
            return -1;
          } else {
            return 1;
          }
        }
      });
      return accumulator;
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
      if (!person) return;
      const background =
        person.last_name.toLowerCase() === lastName.toLowerCase()
          ? 'bg-yellow-200'
          : 'bg-gray-500';
      const textcolor =
        person.last_name.toLowerCase() === lastName.toLowerCase()
          ? 'text-gray-500'
          : 'text-white';
      return (
        <span
          className={`mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${background}`}
          key={idx}
        >
          <span className={`text-xs font-medium leading-none ${textcolor}`}>
            {person.first_name.charAt(0)}
            {person.last_name.charAt(0)}
          </span>
        </span>
      );
    });
  }

  function renderShiftTypes(dateRecord) {
    const shiftsMap = transformActivities(shifts);
    const shiftForDay = shiftsMap[dateRecord.isoDate] || [];
    return shiftTypes.map(function (shiftType, idx) {
      return (
        <td key={idx} className={`w-fit border px-4 py-2`}>
          {renderPersonsForDate(shiftForDay[shiftType.name])}
        </td>
      );
    });
  }

  function renderRows() {
    return allDays.map(function (dateRecord, index) {
      return (
        <tr
          key={index}
          className="cursor-pointer text-center hover:bg-gray-200" // Voeg styling toe voor hover effect
          onClick={() => onDaySelect(dateRecord.date)} // Update de geselecteerde dag
        >
          <td
            className={`border px-4 py-2 ${getDayColor(
              dateRecord,
            )} w-fit text-left`}
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
        <th key={idx} className="min-w-36 border px-4 py-2">
          {type.name}
        </th>
      );
    });
  }

  return (
    <table className="w-fit border bg-white">
      <thead>
        <tr>
          <th className="min-w-36 border px-4 py-2">Date</th>
          {renderHeaders()}
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
}

export default ShiftTable;
