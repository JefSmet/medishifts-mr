Date.prototype.toDateOnlyString = function (
  order = ['year', 'month', 'day'],
  delimiter = '-'
) {
  // Helper function to pad numbers with leading zeros
  function padLeft(number, targetLength) {
    return String(number).padStart(targetLength, '0');
  }

  // Get components of the date
  let components = {
    year: String(this.getFullYear()),
    month: padLeft(this.getMonth() + 1, 2),
    day: padLeft(this.getDate(), 2),
  };

  // Format the date components according to the specified order and delimiter
  let formattedDate = order
    .map((component) => components[component])
    .join(delimiter);

  return formattedDate;
};
