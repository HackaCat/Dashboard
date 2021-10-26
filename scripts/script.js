/**
 * 
 *
 * @format
 */

// TODO Set up authentication so only logged in users can make changes
// TODO Prettify layour, add colour, ect.
// TODO Data validation on input fields
// TODO cont. - we need to make sure blank fields/bad code doesn't get through.
// TODO clean up how we fetch and push values to DB

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
]



// Get Data For Each Section Once on load 
weatherUpdate();
recipeUpdate();
otherUpdate();

// Refresh each section every 5 minutes
function refresh() { 
	console.log('refreshing all data')
	weatherUpdate();
	recipeUpdate();
	otherUpdate();
} 
let refreshReference = setInterval(refresh, 5*60*1000)



// convert time to 24hr format, padding single digits with a zero vi padStart
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
function dateTo24hourTime (date) {
	let minutes = date.getMinutes().toString().padStart(2, '0')
	let hours = date.getHours().toString().padStart(2, '0')
	return `${hours}:${minutes}`;
}

// set clock time every second:
const clock = document.getElementById('clock');
function setTime () {
	let date = new Date();
	let timeString = dateTo24hourTime(date);
	clock.innerHTML = timeString;
}
let clockReference = setInterval(setTime, 1000)
setTime()