import { toFormattedString } from './helpers/dateTimeHelpers';

export const generateMonthDays = (month, year, locale) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayStringNumeric = date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const dayStringWeekDay = date.toLocaleDateString(locale, {
      weekday: 'short',
    });
    const dateRecord = {
      caption: `${dayStringNumeric} ${dayStringWeekDay}`,
      isoDate: date.toIsoDateString(),
      date: date,
    };
    daysArray.push(dateRecord);
  }

  return daysArray;
};
