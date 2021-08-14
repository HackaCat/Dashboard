const dbRef = firebase.database().ref();
const mealsRef = dbRef.child('meals');


	readMealData(); 
	

// --------------------------
// READ
// --------------------------

// Reading in data from Firebase
// snap, childSnap are firebase elements
function readMealData() {

	const mealListUI = document.getElementById("meal-list");

	mealsRef.on("value", snap => {

		mealListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key;
			let value = childSnap.val();

			let column = document.createElement("div");
			column.setAttribute("class", "column is-one-third");

			let container = document.createElement("div");
			container.setAttribute("class", "card");

			let wrapper = document.createElement("div");
			wrapper.setAttribute("class", "card-content");

			let $footer = document.createElement("footer");
			$footer.setAttribute("class", "card-footer");

			let $div = document.createElement("div");

			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-meal";
			editIconUI.innerHTML = "Edit";
			editIconUI.setAttribute("mealID", key);
			editIconUI.setAttribute("class", "card-footer-item");
			editIconUI.addEventListener("click", editButtonClicked)

			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-meal";
			deleteIconUI.innerHTML = "Delete";
			deleteIconUI.setAttribute("mealID", key);
			deleteIconUI.setAttribute("class", "card-footer-item");
			deleteIconUI.addEventListener("click", deleteButtonClicked)
			
			$div.innerHTML = value.name;
			$footer.append(editIconUI);
			$footer.append(deleteIconUI);
			$div.append($footer)

			$div.setAttribute("meal-key", key);
			$div.setAttribute("class", "content");
			$div.addEventListener("click", mealClicked)

			wrapper.append($div);
			container.append(wrapper);
			column.append(container);
			mealListUI.append(column);

 		});

	})

}


//We've clicked a meal listing and want to populate edit fields
function mealClicked(e) {
		var mealID = e.target.getAttribute("meal-key");

		const mealRef = dbRef.child('meals/' + mealID + "name");
		const mealDetailUI = document.getElementById("meal-name");
		mealRef.on("value", snap => {

			mealDetailUI.innerHTML = ""
			console.log("grabbing this meal id! " + mealID );
			snap.forEach(childSnap => {
				var $p = document.createElement("p");
				$p.innerHTML = childSnap.key  + " - " +  childSnap.val();
				console.log(childSnap.key  + " - " +  childSnap.val());
				mealDetailUI.append($p);
			})

		});

		const ingredientRef = dbRef.child('meals/'+mealID+"/ingredients");
		const ingredientUI = document.getElementById("ingredients");
		ingredientUI.innerHTML = ""
		// console.log(mealID);
		ingredientRef.on("value", snap => {
			//
			console.log('ingredientsref.value', snap.key, snap.val())
		});
		ingredientRef.on("value", snap => {
			var $li = document.createElement("li");
			$li.innerHTML = snap.val(); 
			// console.log("ingred: " + snap.val());
			ingredientUI.append($li);
		});
	
		const recipeRef = dbRef.child('meals/'+mealID+"/recipe");
		const recipeUI = document.getElementById("recipe");
		recipeUI.innerHTML = ""
		recipeRef.on("value", snap => {
			var $li = document.createElement("li");
			$li.innerHTML = (snap.key +": " + snap.val()); 
			// console.log("recipe: " + snap.val());
			recipeUI.append($li);
		});
	

}





// --------------------------
// ADD
// --------------------------

const addMealBtnUI = document.getElementById("add-meal-btn");
addMealBtnUI.addEventListener("click", addMealBtnClicked)



function addMealBtnClicked() {

	const mealsRef = dbRef.child('meals');

	const addMealInputsUI = document.getElementsByClassName("meal-input");

 	// this object will hold the new meal information
    let newMeal = {};

    // loop through View to get the data for the model 
    for (let i = 0, len = addMealInputsUI.length; i < len; i++) {

        let key = addMealInputsUI[i].getAttribute('data-key');
        let value = addMealInputsUI[i].value;
        newMeal[key] = value;
    }

	mealsRef.push(newMeal)
}


// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {

		e.stopPropagation();

		var mealID = e.target.getAttribute("mealID");

		const mealRef = dbRef.child('meals/' + mealID);
		
		mealRef.remove();

}


// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
	
	document.getElementById('edit-meal-module').style.display = "block";

	//set meal id to the hidden input field
	document.querySelector(".edit-meal-id").value = e.target.getAttribute("mealID");

	const mealRef = dbRef.child('meals/' + e.target.getAttribute("mealID"));

	// set data to the meal field
	const editMealInputsUI = document.querySelectorAll(".edit-meal-input");

	mealRef.on("value", snap => {

		for(var i = 0, len = editMealInputsUI.length; i < len; i++) {

			var key = editMealInputsUI[i].getAttribute("data-key");
					editMealInputsUI[i].value = snap.val()[key];
		}

	});

	const saveBtn = document.querySelector("#edit-meal-btn");
	saveBtn.addEventListener("click", saveMealBtnClicked)
}


function saveMealBtnClicked(e) {
 
	const mealID = document.querySelector(".edit-meal-id").value;
	const mealRef = dbRef.child('meals/' + mealID);

	var editedMealObject = {}

	const editMealInputsUI = document.querySelectorAll(".edit-meal-input");

	editMealInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
  		editedMealObject[textField.getAttribute("data-key")] = textField.value
	});

	mealRef.update(editedMealObject);

	document.getElementById('edit-meal-module').style.display = "none";


}



        








