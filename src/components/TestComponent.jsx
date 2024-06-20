import React from 'react';

function TestComponent() {
  return (
    <div className='p-4'>
      <div
        className='bg-calendar-activeMonthBg border-r-4
      border-calendar-activeMonth-border text-calendar-activeMonth-text p-4'
      >
        Active Month
      </div>
      <div className='bg-calendar-inActiveMonth-bg text-calendar-inActiveMonth-text p-4 mt-4'>
        Not Active Month
      </div>
      <div className='bg-dark-bg border-8 border-dark-border text-dark-text p-4 mt-4'>
        Dark Mode
      </div>
    </div>
  );
}

export default TestComponent;
