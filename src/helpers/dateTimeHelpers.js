import { padLeft } from './stringHelpers';

Date.prototype.toIsoDateString = function () {
  // Get components of the date
  let month = String(this.getMonth() + 1).padLeft(2, '0');
  let day = String(this.getDate()).padLeft(2, '0');
  let year = String(this.getFullYear());
  let hours = String(this.getHours()).padLeft(2, '0');
  let minutes = String(this.getMinutes()).padLeft(2, '0');

  // Format the date and time components
  return `${year}-${month}-${day}`;
};
