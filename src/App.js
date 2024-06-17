import React, { useEffect, useState } from 'react';
import ShiftTable from './components/ShiftTable';
import {
  schoolHolidaysCalendarYear,
  holidaysBelgium,
} from './utils/HolidaysBelgium';
import testData from './testData/wachtlijstData';

const App = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Huidige maand
  const [year, setYear] = useState(new Date().getFullYear() - 1); // Huidig jaar
  const [person, setPerson] = useState('');
  const [shifts, setShifts] = useState([]);
  const [shiftTypes] = useState(['Dag', 'Nacht', 'Arts3']);

  useEffect(() => {
    async function fetchAndSetShifts() {
      const data = await fetchShifts(year, month);
      setShifts(data);
    }

    fetchAndSetShifts();
  }, [year, month]);

  async function fetchShifts(year, month) {
    // try {
    //   const response = await axios.get(`http://localhost:3001/activities/${year}/${month}`);
    //   return response.data;
    // } catch (error) {
    //   console.error('Er is een fout opgetreden!', error);
    //   return []; // Return an empty array in case of an error
    // }
    return testData;
  }
  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  const handlePersonChange = (event) => {
    setPerson(event.target.value);
  };

  const holidays = holidaysBelgium(year);
  const vacations = schoolHolidaysCalendarYear(year);

  const locale = navigator.language; // Haal de systemlocale op
  const monthNames = Array.from({ length: 12 }, (e, i) =>
    new Date(0, i).toLocaleString(locale, { month: 'long' })
  );

  return (
    <div className='App'>
      <header className='bg-blue-500 text-white p-4 text-center'>
        <h1 className='text-3xl'>Shift Schedule</h1>
      </header>
      <main className='p-4'>
        <div className='mb-4 flex items-center'>
          <label className='mr-2'>Month:</label>
          <select
            value={month}
            onChange={handleMonthChange}
            className='mr-4 p-2 border'
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <label className='mr-2'>Year:</label>
          <select
            value={year}
            onChange={handleYearChange}
            className='mr-4 p-2 border'
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <label className='mr-2'>Person:</label>
          <input
            type='text'
            value={person}
            onChange={handlePersonChange}
            className='p-2 border'
            placeholder='Enter name'
          />
        </div>
        <ShiftTable
          month={month}
          year={year}
          shifts={shifts}
          lastName={person}
          holidays={holidays}
          vacations={vacations}
          locale={locale}
          shiftTypes={shiftTypes}
        />
      </main>
    </div>
  );
};

export default App;
