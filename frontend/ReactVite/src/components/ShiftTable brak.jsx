import React, { useState } from 'react';
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
  doctorsList,
  onSaveChanges,
}) {
  const allDays = generateMonthDays(month, year, locale);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState({});

  if (!shifts || shifts.length === 0) return null;

  function handleRowClick(dateRecord) {
    setSelectedDate(dateRecord.isoDate);
    setShowDetails(true);

    const shiftsMap = transformActivities(shifts);
    setSelectedShifts(shiftsMap[dateRecord.isoDate] || {});
  }

  function transformActivities(activities) {
    return activities.reduce((accumulator, activity) => {
      const { begin_DT, activity_type, person } = activity;
      const beginDate = toDateOnlyString(begin_DT);
      const activityTypeName = activity_type.name;
      const personId = activity.person_id;

      if (!accumulator[beginDate]) {
        accumulator[beginDate] = {};
      }

      if (!accumulator[beginDate][activityTypeName]) {
        accumulator[beginDate][activityTypeName] = [];
      }

      accumulator[beginDate][activityTypeName].push(personId);

      return accumulator;
    }, {});
  }

  function isHoliday(date) {
    return holidays.some(
      (holiday) => holiday.datum.toDateString() === date.toDateString(),
    );
  }

  function isVacation(date) {
    return vacations.some(
      (vacation) => date >= vacation.startDate && date <= vacation.endDate,
    );
  }

  function getDayColor(dateRecord) {
    if (dateRecord.date.getDay() === 0 || dateRecord.date.getDay() === 6)
      return 'bg-red-200'; // Weekend
    if (isHoliday(dateRecord.date)) return 'bg-blue-200'; // Holiday
    if (isVacation(dateRecord.date)) return 'bg-green-200'; // Vacation
    return '';
  }

  function renderPersonsForDate(personIds) {
    if (!personIds || !Array.isArray(personIds)) return null;
    return personIds.map((personId, idx) => {
      const person = doctorsList.find((doc) => doc.id === personId);
      if (!person) return null;

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
    return shiftTypes.map((shiftType, idx) => (
      <td key={idx} className={`w-fit border px-4 py-2`}>
        {renderPersonsForDate(shiftForDay[shiftType.name])}
      </td>
    ));
  }

  function renderRows() {
    return allDays.map((dateRecord, index) => (
      <tr
        key={index}
        className="cursor-pointer text-center"
        onClick={() => handleRowClick(dateRecord)}
      >
        <td
          className={`border px-4 py-2 ${getDayColor(dateRecord)} w-fit text-left`}
        >
          {dateRecord.caption}
        </td>
        {renderShiftTypes(dateRecord)}
      </tr>
    ));
  }

  function renderHeaders() {
    return shiftTypes.map((type, idx) => (
      <th key={idx} className="min-w-36 border px-4 py-2">
        {type.name}
      </th>
    ));
  }

  function handleDoctorChange(shiftType, index, event) {
    const selectedDoctorId = event.target.value;
    setSelectedShifts((prev) => {
      const updatedShift = [...(prev[shiftType.name] || [])];
      updatedShift[index] = selectedDoctorId;
      return {
        ...prev,
        [shiftType.name]: updatedShift,
      };
    });
  }

  function handleAddDoctor(shiftType) {
    console.log(shiftType);
    setSelectedShifts((prev) => ({
      ...prev,
      [shiftType]: [...(prev[shiftType] || []), ''],
    }));
  }

  function handleRemoveDoctor(shiftType, index) {
    setSelectedShifts((prev) => {
      const updatedShift = [...(prev[shiftType.name] || [])];
      updatedShift.splice(index, 1);
      return {
        ...prev,
        [shiftType.name]: updatedShift,
      };
    });
  }

  function renderDoctorsList(shiftType) {
    const selectedDoctors = selectedShifts[shiftType.name] || [];
    return selectedDoctors.map((doctorId, index) => (
      <div key={index} className="mb-2 flex items-center">
        <select
          value={doctorId || ''}
          onChange={(e) => handleDoctorChange(shiftType, index, e)}
          className="mr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
          <option value="">Select a doctor</option>
          {doctorsList.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.last_name} {doc.first_name}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleRemoveDoctor(shiftType, index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    ));
  }

  function renderDetailsTable(shiftType) {
    if (!selectedDate || !showDetails) return null;

    return (
      <div className="ml-10 mt-5">
        <h3 className="text-lg font-semibold">Shifts for {selectedDate}</h3>
        {shiftTypes.map((shiftType, idx) => (
          <div key={idx} className="mb-4">
            <h4 className="text-md font-semibold">{shiftType.name}</h4>
            {renderDoctorsList(shiftType)}
            <button
              onClick={() => handleAddDoctor(shiftType)}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Doctor
            </button>
          </div>
        ))}
        <button
          className="mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    );
  }

  function handleSave() {
    onSaveChanges(selectedDate, selectedShifts);
    setShowDetails(false); // Close the details view after saving
  }

  return (
    <div className="flex">
      <table className="w-fit border bg-white">
        <thead>
          <tr>
            <th className="min-w-36 border px-4 py-2">Datum</th>
            {renderHeaders()}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      {renderDetailsTable()}
    </div>
  );
}

export default ShiftTable;
