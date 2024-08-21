import React, { useEffect, useState } from 'react';
import { toDateOnlyString } from '../utils/dateTimeUtils';
import classNames from '../utils/tailwindUtils';

/**
 * Generates an array of days of the week based on the provided first day of the week.
 *
 * @param {number} firstDayOfWeek - The first day of the week (0-6, where 0 is Sunday and 6 is Saturday).
 * @return {Array<string>} An array of strings representing the days of the week.
 */
function daysOfWeek(firstDayOfWeek) {
  const options = { weekday: 'short', timeZone: 'UTC' };
  const days = [...new Array(7)].map(
    (_, i) =>
      new Date(0, 0, i + firstDayOfWeek)
        .toLocaleDateString(navigator.language, options)
        .charAt(0)
        .toUpperCase() +
      new Date(0, 0, i + firstDayOfWeek)
        .toLocaleDateString(navigator.language, options)
        .slice(1),
  );
  return days;
}

/**
 * Calculates the details of a grid for a given month and year.
 *
 * @param {number} month - The month of the calendar (1-12).
 * @param {number} year - The year.
 * @param {number} [firstDayOfWeek=1] - The first day of the week (0=Sunday, 1=Monday, etc.).
 * @return {Object} An object containing the details of the grid.
 *                    - numRows: The number of rows in the grid.
 *                    - firstDayOfMonthColumn: The first day of the month.
 *                    - lastDayOfMonthColumn: The last day of the month.
 *                    - firstCellDate: The date of the first cell.
 *                    - lastCellDate: The date of the last cell.
 */
function calculateGridDetails(month, year, firstDayOfWeek = 1) {
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);
  const numDays = lastDate.getDate();
  const firstDayOfMonthColumn = (firstDate.getDay() - firstDayOfWeek + 7) % 7;
  const lastDayOfMonthColumn = (lastDate.getDay() - firstDayOfWeek + 7) % 7;

  let numRows = Math.ceil((numDays + firstDayOfMonthColumn) / 7);

  if (firstDayOfMonthColumn === 0) {
    numRows += 1;
  }

  if (lastDayOfMonthColumn === 6) {
    numRows += 1;
  }
  const toDeductDays = firstDayOfMonthColumn === 0 ? 7 : firstDayOfMonthColumn;
  const firstCellDate = new Date(firstDate);
  firstCellDate.setDate(firstDate.getDate() - toDeductDays);

  const toAddDays = lastDayOfMonthColumn === 6 ? 7 : 6 - lastDayOfMonthColumn;
  const lastCellDate = new Date(lastDate);
  lastCellDate.setDate(lastDate.getDate() + toAddDays);
  return {
    numRows,
    firstDayOfMonthColumn,
    lastDayOfMonthColumn,
    firstCellDate,
    lastCellDate,
  };
}

/**
 * Renders the header of a calendar component.
 *
 * @param {Object} props - The properties for the CalendarHeader component.
 * @param {number} props.month - The month of the calendar (1-12).
 * @param {number} props.year - The year of the calendar.
 * @return {JSX.Element} The rendered CalendarHeader component.
 */
function CalendarHeader({ month, year }) {
  return (
    <header className="flex items-center justify-between border-b border-calendar-header-border bg-calendar-header-bg px-6 py-4 lg:flex-none">
      <h1 className="text-base font-semibold leading-6 text-calendar-header-text">
        <time dateTime={`${year}-${String(month).padStart(2, '0')}`}>
          {new Intl.DateTimeFormat(navigator.language, {
            month: 'long',
            year: 'numeric',
          })
            .format(new Date(year, month - 1))
            .replace(/(^\w)/g, (match) => match.toUpperCase())}
        </time>
      </h1>
    </header>
  );
}
function WeekdaysHeader({ month, year, firstDayOfWeek = 1 }) {
  return (
    <div className="grid grid-cols-7 gap-px border-b bg-calendar-gridLines text-center text-xs font-semibold leading-6 text-calendar-weekdaysHeader-text lg:flex-none">
      {daysOfWeek(firstDayOfWeek).map((day, index) => (
        <div key={index} className="bg-calendar-weekdays-bg py-2">
          {day.charAt(0)}
          <span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
function DaysGrid({ month, year, events, firstDayOfWeek = 1 }) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDayClick = (day) => {
    if (selectedDay) {
      selectedDay.isSelected = false;
      if (selectedDay === day) {
        setSelectedDay(null);
        return;
      }
    }
    day.isSelected = true;
    setSelectedDay(day);
  };

  useEffect(() => {
    const {
      numRows,
      firstDayOfMonthColumn,
      lastDayOfMonthColumn,
      firstCellDate,
      lastCellDate,
    } = calculateGridDetails(month, year, firstDayOfWeek);
    const dayList = [];
    let currentDate = new Date(firstCellDate);

    for (let i = 0; i < numRows * 7; i++) {
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const dayEvents = events.filter(
        (event) =>
          new Date(event.begin_DT).toDateString() ===
          currentDate.toDateString(),
      );

      dayList.push({
        date: toDateOnlyString(currentDate),
        isCurrentMonth,
        isToday,
        events: dayEvents,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDays(dayList);
  }, [month, year, events]);
  return (
    <div className="flex bg-calendar-gridLines text-xs leading-6 text-calendar-activeMonth-text lg:flex-auto">
      {/* desktop */}
      <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
        {days.map((day) => (
          <div
            key={day.date}
            className={classNames(
              day.isCurrentMonth
                ? 'bg-calendar-activeMonth-bg'
                : 'bg-calendar-inActiveMonth-bg text-calendar-inActiveMonth-text',
              'relative px-3 py-2',
            )}
          >
            <time
              dateTime={day.date}
              className={
                day.isToday
                  ? 'flex h-6 w-6 items-center justify-center rounded-full bg-calendar-daysGrid-today-bg font-semibold text-calendar-daysGrid-today-text'
                  : undefined
              }
            >
              {day.date.split('-').pop().replace(/^0/, '')}
            </time>
            {day.events.length > 0 && (
              <ol className="mt-2">
                {day.events.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <div className="group flex">
                      <p className="flex-auto truncate font-medium text-calendar-events-textLeft">
                        {event.name}
                      </p>
                      <time
                        dateTime={event.datetime}
                        className="ml-3 hidden flex-none text-calendar-events-textRight xl:block"
                      >
                        {event.time}
                      </time>
                    </div>
                  </li>
                ))}
                {day.events.length > 3 && (
                  <li className="text-calendar-events-textOverflow">
                    + {day.events.length - 3} more
                  </li>
                )}
              </ol>
            )}
          </div>
        ))}
      </div>
      {/* Mobile */}
      <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            className={classNames(
              day.isCurrentMonth
                ? 'bg-calendar-activeMonth-bg'
                : 'bg-calendar-inActiveMonth-bg',
              (day.isSelected || day.isToday) && 'font-semibold',
              day.isSelected && 'text-calendar-daysGrid-selected-text',
              !day.isSelected &&
                day.isToday &&
                'font-bold text-calendar-daysGrid-today-textMobile',
              !day.isSelected &&
                day.isCurrentMonth &&
                !day.isToday &&
                'text-calendar-daysGrid-text',
              !day.isSelected &&
                !day.isCurrentMonth &&
                !day.isToday &&
                'text-calendar-inActiveMonth-text',
              day.isSelected &&
                !day.isCurrentMonth &&
                'text-calendar-daysGrid-selected-text',
              'flex h-14 flex-col px-3 py-2 hover:bg-calendar-daysGrid-bgHover focus:z-10',
            )}
            onClick={() => handleDayClick(day)}
          >
            <time
              dateTime={day.date}
              className={classNames(
                day.isSelected &&
                  'flex h-6 w-6 items-center justify-center rounded-full',
                day.isSelected &&
                  day.isToday &&
                  'bg-calendar-daysGrid-today-bg',
                day.isSelected &&
                  !day.isToday &&
                  'bg-calendar-daysGrid-selected-bg',
                'ml-auto',
              )}
            >
              {day.date.split('-').pop().replace(/^0/, '')}
            </time>
            <span className="sr-only">{day.events.length} events</span>
            {day.events.length > 0 && (
              <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                {day.events.map((event) => (
                  <span
                    key={event.id}
                    className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-calendar-events-bgMobile"
                  />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
function MonthView({
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  events = [],
  firstDayOfWeek = 1,
}) {
  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <CalendarHeader month={month} year={year} />
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <WeekdaysHeader
          month={month}
          year={year}
          firstDayOfWeek={firstDayOfWeek}
        />
        <DaysGrid
          month={month}
          year={year}
          events={events}
          firstDayOfWeek={firstDayOfWeek}
        />
      </div>
    </div>
  );
}
export default MonthView;
