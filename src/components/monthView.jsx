import React, { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';

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

function toDateOnlyString(
  date,
  order = ['year', 'month', 'day'],
  delimiter = '-'
) {
  const datum = new Date(date);
  let components = {
    year: String(datum.getFullYear()),
    month: padLeft(datum.getMonth() + 1, 2),
    day: padLeft(datum.getDate(), 2),
  };
  let formattedDate = order
    .map((component) => components[component])
    .join(delimiter);

  return formattedDate;
}

function padLeft(number, digits) {
  return number.toString().padStart(digits, '0');
}

const Calendar = ({ month, year, events }) => {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const {
      numRows,
      firstDayOfMonthColumn,
      lastDayOfMonthColumn,
      firstCellDate,
      lastCellDate,
    } = calculateGridDetails(month, year);
    const dayList = [];
    let currentDate = new Date(firstCellDate);

    for (let i = 0; i < numRows * 7; i++) {
      const isCurrentMonth = currentDate.getMonth() === month - 1;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const dayEvents = events.filter(
        (event) =>
          new Date(event.datetime).toDateString() === currentDate.toDateString()
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

  const selectedDay = days.find((day) => day.isSelected);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className='lg:flex lg:h-full lg:flex-col'>
      <header className='flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none'>
        <h1 className='text-white font-semibold leading-6 text-gray-900'>
          <time dateTime={`${year}-${month}`}>
            {new Intl.DateTimeFormat(navigator.language, {
              month: 'long',
              monthDay: 'numeric',
            })
              .format(new Date(year, month - 1))
              .split(' ')
              .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(' ')}{' '}
            {year}
          </time>
        </h1>
        <div className='flex items-center'>
          <div className='relative flex items-center rounded-md bg-white shadow-sm md:items-stretch'>
            <button
              type='button'
              className='flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50'
            >
              <span className='sr-only'>Previous month</span>
              <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
            </button>
            <button
              type='button'
              className='hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block'
            >
              Today
            </button>
            <span className='relative -mx-px h-5 w-px bg-gray-300 md:hidden' />
            <button
              type='button'
              className='flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50'
            >
              <span className='sr-only'>Next month</span>
              <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden md:ml-4 md:flex md:items-center'>
            <Menu as='div' className='relative'>
              <MenuButton
                type='button'
                className='flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                Month view
                <ChevronDownIcon
                  className='-mr-1 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </MenuButton>

              <Transition
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <MenuItems className='absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href='#'
                          className={classNames(
                            focus
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href='#'
                          className={classNames(
                            focus
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href='#'
                          className={classNames(
                            focus
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <a
                          href='#'
                          className={classNames(
                            focus
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
            <div className='ml-6 h-6 w-px bg-gray-300' />
            <button
              type='button'
              className='ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Add event
            </button>
          </div>
          <Menu as='div' className='relative ml-6 md:hidden'>
            <MenuButton className='-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500'>
              <span className='sr-only'>Open menu</span>
              <EllipsisHorizontalIcon className='h-5 w-5' aria-hidden='true' />
            </MenuButton>

            <Transition
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <MenuItems className='absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </MenuItem>
                </div>
                <div className='py-1'>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </MenuItem>
                </div>
                <div className='py-1'>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <a
                        href='#'
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </header>
      <div className='shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col'>
        <div className='grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none'>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 1))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 1))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 2))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 2))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 3))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 3))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 4))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 4))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 5))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 5))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 6))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 6))
                .slice(1)}
          </div>
          <div className='bg-white py-2'>
            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
              .format(new Date(year, month - 1, 7))
              .toUpperCase()
              .charAt(0) +
              Intl.DateTimeFormat(navigator.language, { weekday: 'short' })
                .format(new Date(year, month - 1, 7))
                .slice(1)}
          </div>
        </div>
        <div className='flex bg-gray-200 text-xs leading-6 text-current-month lg:flex-auto'>
          <div className='hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px'>
            {days.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-other-month text-other-month',
                  'relative px-3 py-2'
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                      : undefined
                  }
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
                {day.events.length > 0 && (
                  <ol className='mt-2'>
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className='group flex'>
                          <p className='flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600'>
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className='ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block'
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className='text-gray-500'>
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className='isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden'>
            {days.map((day) => (
              <button
                key={day.date}
                type='button'
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-500',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected &&
                    day.isToday &&
                    'font-bold text-indigo-600 ',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-indigo-600',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                    'ml-auto'
                  )}
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
                <span className='sr-only'>{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className='-mx-0.5 mt-auto flex flex-wrap-reverse'>
                    {day.events.map((event) => (
                      <span
                        key={event.id}
                        className='mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400'
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay?.events.length > 0 && (
        <div className='px-4 py-10 sm:px-6 lg:hidden'>
          <ol className='divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5'>
            {selectedDay.events.map((event) => (
              <li
                key={event.id}
                className='group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50'
              >
                <div className='flex-auto'>
                  <p className='font-semibold text-gray-900'>{event.name}</p>
                  <time
                    dateTime={event.datetime}
                    className='mt-2 flex items-center text-gray-700'
                  >
                    <ClockIcon
                      className='mr-2 h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    {event.time}
                  </time>
                </div>
                <a
                  href={event.href}
                  className='ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100'
                >
                  Edit<span className='sr-only'>, {event.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Calendar;
