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
let refreshReference = setTimeout(refresh, 5*60*1000)