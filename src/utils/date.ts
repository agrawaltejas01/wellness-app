var moment = require("moment");

moment().format();

function getMomentDate(date: string | number | Date) {
  if (typeof date == "string" || typeof date == "number") {
    date = new Date(date);
  }
  let epoch = date.getTime();
  return moment(epoch);
}

export function addDays(date: string | number | Date, days: number) {
  let momentDate = getMomentDate(date);
  let toReturn = momentDate.add(days, "days");
  return toReturn.toDate();
}

export function getDayOfWeek(date: string | number | Date) {
  let momentDate = getMomentDate(date);
  return momentDate.format("ddd").toUpperCase();
}

export function formatDate(date: string | number | Date) {
  let momentDate = getMomentDate(date);
  return {
    isoDate: momentDate.format("YYYY-MM-DD"),
    "date suffix - Day": momentDate.format("Do MMM - ddd"),
    "date suffix": momentDate.format("Do MMM "),
  };
}

export function formatTimeIntToAmPm(time: number) {
  let timeString = time.toString();
  if (timeString.length == 3) timeString = `0${timeString}`;
  const toReturn = moment(timeString, "HHmm");
  if (toReturn.minutes() === 0) {
    return toReturn.format("h A"); // Format without minutes if minutes are 0
  } else {
    return toReturn.format("h:mm A"); // Format with minutes otherwise
  }
}
