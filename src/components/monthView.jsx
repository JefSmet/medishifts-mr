import classNames from '../utils/tailwindUtils';
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

function CalendarHeader({ month, year }) {
  return (
    <hearder className='flex items-center justify-between border-b border-calendar-header-border px-6 py-4 lg:flex-none bg-calendar-header-bg'>
      <h1 className='text-base font-semibold leading-6 text-calendar-header-text'>
        <time dateTime={`${year}-${String(month).padStart(2, '0')}`}>
          {new Intl.DateTimeFormat(navigator.language, {
            month: 'long',
            year: 'numeric',
          })
            .format(new Date(year, month - 1))
            .replace(/(^\w)/g, (match) => match.toUpperCase())}
        </time>
      </h1>
    </hearder>
  );
}
function WeekdaysHeader({ month, year, firstDayOfWeek = 1 }) {
  return (
    <div className='grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none'>
      <div className='bg-white py-2'>
        M<span className='sr-only sm:not-sr-only'>on</span>
      </div>
      <div className='bg-white py-2'>
        T<span className='sr-only sm:not-sr-only'>ue</span>
      </div>
      <div className='bg-white py-2'>
        W<span className='sr-only sm:not-sr-only'>ed</span>
      </div>
      <div className='bg-white py-2'>
        T<span className='sr-only sm:not-sr-only'>hu</span>
      </div>
      <div className='bg-white py-2'>
        F<span className='sr-only sm:not-sr-only'>ri</span>
      </div>
      <div className='bg-white py-2'>
        S<span className='sr-only sm:not-sr-only'>at</span>
      </div>
      <div className='bg-white py-2'>
        S<span className='sr-only sm:not-sr-only'>un</span>
      </div>
    </div>
  );
}
function DaysGrid({ days }) {
  return;
}
function MonthView({
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  days,
  firstDayOfWeek = 1,
}) {
  return (
    <div className='lg:flex lg:h-full lg:flex-col'>
      <CalendarHeader month={month} year={year} />
      <div className='lg:flex lg:flex-auto lg:flex-col'>
        <WeekdaysHeader
          month={month}
          year={year}
          firstDayOfWeek={firstDayOfWeek}
        />
        <DaysGrid days={days} />
      </div>
    </div>
  );
}
export default MonthView;
