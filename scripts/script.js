/* /** @format */

const dbRef = firebase.database().ref();
const mealsRef = dbRef.child('meals');

readMealData();

function setModules(edit, add, recipe) {
	var var_edit = edit.toString();
	var var_add = add.toString();
	var var_recipe = recipe.toString();

	document.getElementById('edit-meal-module').style.display = var_edit;
	document.getElementById('add-meal-module').style.display = var_add;
	document.getElementById('recipe-module').style.display = var_recipe;
}
// --------------------------
// READ
// --------------------------

// Reading in data from Firebase
// snap, childSnap are firebase elements
function readMealData() {
	const mealListUI = document.getElementById('meal-list');
	setModules('none', 'none', 'none');
	mealsRef.on('value', (snap) => {
		mealListUI.innerHTML = '';

		snap.forEach((childSnap) => {
			let key = childSnap.key;
			let value = childSnap.val();

			let column = document.createElement('div');
			column.setAttribute('class', 'column is-one-third');

			let container = document.createElement('div');
			container.setAttribute('class', 'card');

			let wrapper = document.createElement('div');
			wrapper.setAttribute('class', 'card-content');

			let $footer = document.createElement('footer');
			$footer.setAttribute('class', 'card-footer');

			let $div = document.createElement('div');

			// view recipe icon
			let viewIconUI = document.createElement('span');
			viewIconUI.class = 'edit-meal';
			viewIconUI.innerHTML = 'View Recipe';
			viewIconUI.setAttribute('mealID', key);
			viewIconUI.setAttribute('class', 'card-footer-item');
			viewIconUI.addEventListener('click', mealClicked);
			viewIconUI.setAttribute('meal-key', key);

			// edit icon
			let editIconUI = document.createElement('span');
			editIconUI.class = 'edit-meal';
			editIconUI.innerHTML = 'Edit';
			editIconUI.setAttribute('mealID', key);
			editIconUI.setAttribute('class', 'card-footer-item');
			editIconUI.addEventListener('click', editButtonClicked);

			// delete icon
			let deleteIconUI = document.createElement('span');
			deleteIconUI.class = 'delete-meal';
			deleteIconUI.innerHTML = 'Delete';
			deleteIconUI.setAttribute('mealID', key);
			deleteIconUI.setAttribute('class', 'card-footer-item');
			deleteIconUI.addEventListener('click', deleteButtonClicked);

			$div.innerHTML = value.name;
			$footer.append(viewIconUI);
			$footer.append(editIconUI);
			$footer.append(deleteIconUI);
			$div.append($footer);

			
			$div.setAttribute('class', 'content');
			

			wrapper.append($div);
			container.append(wrapper);
			column.append(container);
			mealListUI.append(column);
		});
	});
}

//We've clicked a meal listing and want to populate recipe fields
function mealClicked(e) {
	console.log("meal clicked on");
	setModules('none', 'none', 'block');
	var mealID = e.target.getAttribute('meal-key');

	const mealRef = dbRef.child('meals/' + mealID + 'name');
	const mealDetailUI = document.getElementById('meal-name');
	mealRef.on('value', (snap) => {
		mealDetailUI.innerHTML = '';
		snap.forEach((childSnap) => {
			var $p = document.createElement('p');
			$p.innerHTML = childSnap.key + ' - ' + childSnap.val();
			mealDetailUI.append($p);
		});
	});

	const ingredientRef = dbRef.child('meals/' + mealID + '/ingredients');
	const ingredientUI = document.getElementById('ingredients');
	ingredientUI.innerHTML = '';
	ingredientRef.on('value', (snap) => {});
	ingredientRef.on('value', (snap) => {
		var $li = document.createElement('li');
		$li.innerHTML = snap.val();
		ingredientUI.append($li);
	});

	const recipeRef = dbRef.child('meals/' + mealID + '/recipe');
	const recipeUI = document.getElementById('recipe');
	recipeUI.innerHTML = '';
	recipeRef.on('value', (snap) => {
		var $li = document.createElement('li');
		$li.innerHTML = snap.key + ': ' + snap.val();
		// console.log("recipe: " + snap.val());
		recipeUI.append($li);
	});
}

// --------------------------
// ADD
// --------------------------

const addMealBtn = document.getElementById('open-recipe-module');
addMealBtn.addEventListener('click', showRecipeBox);

function showRecipeBox(){
setModules("none","block","none");
}

const addMealBtnUI = document.getElementById('add-meal-btn');
addMealBtnUI.addEventListener('click', addMealBtnClicked);

function addMealBtnClicked() {
	console.log('adding a meal...')
	setModules('none', 'block', 'none');
	const mealsRef = dbRef.child('meals');

	const addMealInputsUI = document.getElementsByClassName('meal-input');

	// this object will hold the new meal information
	let newMeal = {};

	// loop through View to get the data for the model
	for (let i = 0, len = addMealInputsUI.length; i < len; i++) {
		let key = addMealInputsUI[i].getAttribute('data-key');
		let value = addMealInputsUI[i].value;
		newMeal[key] = value;
	}

	mealsRef.push(newMeal);
}
/*  */
// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {
	e.stopPropagation();

	var mealID = e.target.getAttribute('mealID');

	const mealRef = dbRef.child('meals/' + mealID);

	mealRef.remove();
}

// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
	console.log('edit button clicked');
	//set meal id to the hidden input field
	document.querySelector('.edit-meal-id').value =
		e.target.getAttribute('mealID');

	const mealRef = dbRef.child('meals/' + e.target.getAttribute('mealID'));

	// set data to the meal field
	const editMealInputsUI = document.querySelectorAll('.edit-meal-input');

	mealRef.on('value', (snap) => {
		for (var i = 0, len = editMealInputsUI.length; i < len; i++) {
			var key = editMealInputsUI[i].getAttribute('data-key');
			editMealInputsUI[i].value = snap.val()[key];
		}
	});
	setModules('block', 'none', 'none');
	const saveBtn = document.querySelector('#edit-meal-btn');
	saveBtn.addEventListener('click', saveMealBtnClicked);
}

function saveMealBtnClicked(e) {
	const mealID = document.querySelector('.edit-meal-id').value;
	const mealRef = dbRef.child('meals/' + mealID);

	var editedMealObject = {};

	const editMealInputsUI = document.querySelectorAll('.edit-meal-input');

	editMealInputsUI.forEach(function (textField) {
		let key = textField.getAttribute('data-key');
		let value = textField.value;
		editedMealObject[textField.getAttribute('data-key')] = textField.value;
	});

	mealRef.update(editedMealObject);

	document.getElementById('edit-meal-module').style.display = 'none';
}
