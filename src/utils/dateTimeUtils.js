/**
 * Pad the input number with zeros to the target length.
 *
 * @param {number} number - The number to pad.
 * @param {number} targetLength - The desired length of the padded number.
 * @return {string} The padded number as a string.
 */
function padLeft(number, targetLength) {
  return String(number).padStart(targetLength, "0");
}

/**
 * Converts a date object to a string with only year, month, and day components.
 *
 * @param {Date} date - The input date object.
 * @param {Array} [order=["year", "month", "day"]] - The order in which the components should be arranged.
 * @param {string} [delimiter="-"] - The delimiter to separate the components.
 * @return {string} The formatted date string with specified components.
 */
export function toDateOnlyString(
  date,
  order = ["year", "month", "day"],
  delimiter = "-"
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

/**
 * Generates an array of date records for each day in the specified month.
 *
 * @param {number} month - The month (1-12).
 * @param {number} year - The year.
 * @param {string} locale - The locale for date formatting.
 * @return {Array} An array of date records for each day in the month.
 */
export function generateMonthDays(month, year, locale) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayStringNumeric = date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dayStringWeekDay = date.toLocaleDateString(locale, {
      weekday: "short",
    });
    const dateRecord = {
      caption: `${dayStringNumeric} ${dayStringWeekDay}`,
      isoDate: toDateOnlyString(date),
      date: date,
    };
    daysArray.push(dateRecord);
  }

  return daysArray;
}

/**
 * Calculates details for a month grid.
 *
 * @param {number} month - The month (1-12).
 * @param {number} year - The year.
 * @param {number} [firstDayOfWeek=1] - The first day of the week (0=Sunday, 1=Monday, etc.).
 * @returns {Object} An object containing details about the grid.
 */
export function calculateMonthGridDetails(month, year, firstDayOfWeek = 1) {
  // Calculate the number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Calculate the first day of the month (0 = Sunday, 1 = Monday, etc.)
  let firstDay = new Date(year, month - 1, 1).getDay();
  firstDay = (firstDay + 7 - firstDayOfWeek) % 7; // Adjust to the first day of the week

  // Calculate the last day of the month (0 = Sunday, 1 = Monday, etc.)
  let lastDay = new Date(year, month - 1, daysInMonth).getDay();
  lastDay = (lastDay + 7 - firstDayOfWeek) % 7; // Adjust to the first day of the week

  // Determine the starting column for the first day of the month
  const startColumn = firstDay;

  // Determine the ending column for the last day of the month
  const endColumn = lastDay;

  // Calculate the number of rows in the grid
  let totalDays = startColumn + daysInMonth;
  let numRows = Math.ceil(totalDays / 7);

  // Check if an extra row needs to be added
  if (startColumn === 0) {
    numRows++;
  }
  if (endColumn === 6) {
    numRows++;
  }

  // Calculate the days of the previous month
  let prevMonth = month - 1 === 0 ? 12 : month - 1;
  let nextMonth = month + 1 === 13 ? 1 : month + 1;
  const prevYear = month - 1 === 0 ? year - 1 : year;
  const nextYear = month + 1 === 13 ? year + 1 : year;
  prevMonth--;
  nextMonth--;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  const firstDate = new Date(
    prevYear,
    prevMonth,
    startColumn === 0 ? daysInPrevMonth - 6 : daysInPrevMonth - startColumn + 1
  );
  const lastDate = new Date(
    nextYear,
    nextMonth,
    endColumn === 6 ? 7 : 6 - endColumn
  );
  return {
    numRows: numRows,
    startColumn: startColumn,
    endColumn: endColumn,
    firstDateInGrid: toDateOnlyString(firstDate),
    lastDateInGrid: toDateOnlyString(lastDate),
  };
}

// module.exports = {
//   toDateOnlyString,
//   generateMonthDays,
//   calculateMonthGridDetails,
// };
