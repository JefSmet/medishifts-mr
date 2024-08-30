import React, { useState, useEffect } from 'react';
import MonthYearSelector from './MonthYearSelector';
import ShiftTable from './ShiftTable';
import ShiftDetail from './shiftDetail';
import axios from 'axios';
import { getToken, parseJwt } from '../utils/tokenStorage';
import {
  holidaysBelgium,
  schoolHolidaysCalendarYear,
} from '../utils/HolidaysBelgium';

const ShiftManager = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [activityTypes, setActivityTypes] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [verlof, setVerlof] = useState([]);
  const [holidays, setHolidays] = useState(holidaysBelgium(year));
  const [schoolHolidays, setSchoolHolidays] = useState(
    schoolHolidaysCalendarYear(year),
  );
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const startDate = new Date(year, month - 1, 1); //gets first day of the month
    const endDate = new Date(year, month, 1); //gets the first day of the next month
    async function fetchActivities() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activities/period/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}/1`,
        );
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchActivities();

    async function fetchVerlof() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activities/period/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}/0`,
        );
        setVerlof(response.data);
      } catch (error) {
        console.error('Error fetching verlof:', error);
      }
    }
    fetchVerlof();

    async function fetchActivityTypes() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activity_types`,
        );
        const filteredActivityTypes = response.data.filter(
          (activityType) => activityType.isWork === true,
        );
        setShiftTypes(filteredActivityTypes);
        setActivityTypes(response.data);
      } catch (error) {
        console.error('Error fetching activity types:', error);
      }
    }
    fetchActivityTypes();
    setLastName(parseJwt(getToken()).lastName);
  }, []);

  useEffect(() => {
    const startDate = new Date(year, month - 1, 1); //gets first day of the month
    const endDate = new Date(year, month, 3); //gets the last day of the month
    async function fetchActivities() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activities/period/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}/1`,
        );
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchActivities();

    async function fetchVerlof() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activities/period/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}/0`,
        );
        setVerlof(response.data);
      } catch (error) {
        console.error('Error fetching verlof:', error);
      }
    }
    fetchVerlof();
    setHolidays(holidaysBelgium(year));
    setSchoolHolidays(schoolHolidaysCalendarYear(year));
    setLastName(parseJwt(getToken()).lastName);
  }, [month, year]);

  function selectedDaySetter(day) {
    setSelectedDay(day);
    console.log(day);
  }

  function updateActivities(newActivities) {
    setActivities(newActivities);
  }
  return (
    <div>
      <MonthYearSelector
        defaultMonth={month}
        defaultYear={year}
        onChange={({ month, year }) => {
          setMonth(month);
          setYear(year);
        }}
      />
      <div className="flex">
        <ShiftTable
          month={month}
          year={year}
          shifts={activities}
          lastName={lastName}
          holidays={holidays}
          vacations={schoolHolidays}
          locale="nl-BE"
          shiftTypes={shiftTypes}
          callback={selectedDaySetter}
        />
        <div className="ml-auto mr-auto">
          <ShiftDetail
            selectedDay={selectedDay}
            shiftTypes={shiftTypes}
            updateActivities={updateActivities}
            activities={activities}
          />
        </div>
      </div>
    </div>
  );
};

export default ShiftManager;
