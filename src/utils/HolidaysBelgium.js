// Function to calculate Easter
function easter(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Function to calculate autumn break
function autumnBreak(year) {
  let date = new Date(year, 10, 1); // 1st of november
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    // Sunday
    date.setDate(date.getDate() + 1);
  } else {
    date.setDate(date.getDate() - dayOfWeek + 1);
  }
  return {
    startDate: date,
    endDate: new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000),
    info: 'Herfstvakantie',
  };
}

// Function to calculate Christmas break
function chirstmasBreak(year) {
  let date = new Date(year, 11, 25); // 25 december
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    // zaterdag of zondag
    date.setDate(date.getDate() + (8 - dayOfWeek));
  } else {
    date.setDate(date.getDate() - dayOfWeek + 1);
  }
  return {
    startDate: date,
    endDate: new Date(date.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Kerstvakantie',
  };
}

// Function to calculate spring break
function springBreak(year) {
  let pasenDate = easter(year);
  pasenDate.setDate(pasenDate.getDate() - 42); // 42 dagen voor Pasen
  let start = new Date(pasenDate);
  start.setDate(start.getDate() - (start.getDay() ? start.getDay() - 1 : 6)); // Start van de week
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000),
    info: 'Krokusvakantie',
  };
}

// Function to calculate Easter hollidays
function easterHollidays(year) {
  const pasenDate = easter(year);
  let start;
  if (pasenDate.getMonth() === 2) {
    // March
    start = new Date(pasenDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day after Easter
  } else if (pasenDate > new Date(year, 3, 15)) {
    // After april 15th
    start = new Date(pasenDate);
    start.setDate(start.getDate() - (start.getDay() ? start.getDay() - 1 : 6)); // Beginning of week, 1 week before Easter
  } else {
    // Before april 15th
    for (let i = 1; i <= 7; i++) {
      start = new Date(year, 3, i);
      if (start.getDay() === 1) break; // First monday of april
    }
  }
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Paasvakantie',
  };
}

// Function to calculate Ascension break
function ascensionBreak(year) {
  const ascensionDayDate = new Date(
    easter(year).getTime() + 39 * 24 * 60 * 60 * 1000
  ); // 39 days after Easter
  const start = new Date(ascensionDayDate.getTime() + 1 * 24 * 60 * 60 * 1000); // The day after Ascension Day
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 1 * 24 * 60 * 60 * 1000),
    info: 'Hemelvaart Schoolvakantie',
  };
}

// Function to calculate Summer break
function summerBreak(year) {
  const start = new Date(year, 6, 1); // 1 juli
  const end = new Date(year, 7, 31); // 31 augustus
  return { startDate: start, endDate: end, info: 'Zomervakantie' };
}

// Function to calculate Christmas break for the second part of the previous year
function chirstmasBreakPreviousYear(year) {
  const start = new Date(year - 1, 11, 25); // 25th of december of the previous year
  return {
    startDate: start,
    endDate: new Date(start.getTime() + 13 * 24 * 60 * 60 * 1000),
    info: 'Kerstvakantie',
  };
}

// Function to calculate all school holidays for a calendar year
function schoolHolidaysCalendarYear(year) {
  const holidays = [];
  const previousChristmasBreak = chirstmasBreakPreviousYear(year);

  // Add the overlapping part of the Christmas holidays of the previous year (only January)
  if (previousChristmasBreak.endDate.getFullYear() === year) {
    holidays.push({
      startDate: new Date(year, 0, 1),
      endDate: previousChristmasBreak.endDate,
      info: previousChristmasBreak.info,
    });
  }

  holidays.push(springBreak(year));
  holidays.push(easterHollidays(year));
  holidays.push(ascensionBreak(year));
  holidays.push(summerBreak(year));
  holidays.push(autumnBreak(year));

  const currentChristmasBreak = chirstmasBreak(year);

  // Add the part of Christmas holidays of the current year (only December)
  if (currentChristmasBreak.startDate.getFullYear() === year) {
    holidays.push(currentChristmasBreak);
  } else {
    holidays.push({
      startDate: currentChristmasBreak.startDate,
      endDate: new Date(year, 11, 31),
      info: currentChristmasBreak.info,
    });
  }

  return holidays;
}

// Function to calculate the official Belgian public holidays
function holidaysBelgium(year) {
  const easterDate = easter(year);
  const easterMonday = new Date(easterDate.getTime() + 1 * 24 * 60 * 60 * 1000);
  const ascensionDay = new Date(
    easterDate.getTime() + 39 * 24 * 60 * 60 * 1000
  );
  const pentecost = new Date(easterDate.getTime() + 49 * 24 * 60 * 60 * 1000);
  const pentecostMonday = new Date(
    pentecost.getTime() + 1 * 24 * 60 * 60 * 1000
  );

  return [
    { datum: new Date(year, 0, 1), info: 'Nieuwjaar' }, // 1st of january
    { datum: easterMonday, info: 'Paasmaandag' }, // Easter Monday
    { datum: new Date(year, 4, 1), info: 'Dag van de Arbeid' }, // labour day
    { datum: ascensionDay, info: 'O.L.H. Hemelvaart' }, // Ascension Day
    { datum: pentecostMonday, info: 'Pinkstermaandag' }, // Pentecost Monday
    { datum: new Date(year, 6, 21), info: 'Nationale Feestdag' }, // 21st of july
    { datum: new Date(year, 7, 15), info: 'O.L.V. Hemelvaart' }, // 15th of august
    { datum: new Date(year, 10, 1), info: 'Allerheiligen' }, // 1st of november
    { datum: new Date(year, 10, 11), info: 'Wapenstilstand' }, // 11th of november
    { datum: new Date(year, 11, 25), info: 'Kerstmis' }, // 25th of december
  ];
}

// Exports
export {
  easter,
  autumnBreak,
  chirstmasBreak,
  springBreak,
  easterHollidays,
  ascensionBreak,
  summerBreak,
  schoolHolidaysCalendarYear,
  holidaysBelgium,
};
