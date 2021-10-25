/**
 *   Recipes are saved in Firebase. Load and display recipes, and allow editing /
 * adding more recipes
**/

// get firebase reference and data
const dbRef = firebase.database().ref();
const mealsRef = dbRef.child('meals');

// connect UI listeners
const showMealBtnUI = document.getElementById('display-recipe-module');
showMealBtnUI.addEventListener('click', showMealBtnClicked);

const openMealBtn = document.getElementById('open-recipe-module');
openMealBtn.addEventListener('click', showRecipeBox);

const addMealBtnUI = document.getElementById('add-meal-btn');
addMealBtnUI.addEventListener('click', addMealBtnClicked);




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
  document.getElementById('meal-list').style.display = 'none';
  loadDayWithRecipe();
  mealsRef.on('value', (snap) => {
    mealListUI.innerHTML = '';

    snap.forEach((childSnap) => {
      let key = childSnap.key;
      let value = childSnap.val();

      let column = document.createElement('div');
      column.setAttribute('class', 'column is-one-third');

      let container = document.createElement('div');
      container.setAttribute('class', 'card recipe-card');
      container.setAttribute('meal-key', key);
      container.addEventListener('click', fillDayWithRecipe);

      let wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'card-content');
      wrapper.setAttribute('meal-key', key);

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

      $div.setAttribute('class', 'content');
      $div.setAttribute('meal-key', key);

      wrapper.append($div);
      container.append(wrapper);
      column.append(container);
      mealListUI.append(column);
      container.append($footer);
    });
  });
}

//We've clicked a meal listing and want to populate recipe fields
function mealClicked(e) {
  setModules('none', 'none', 'block');
  var mealID = e.target.getAttribute('meal-key');

  const mealRef = dbRef.child('meals/' + mealID + '/name');
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
    recipeUI.append($li);
  });
}

function showRecipeBox() {
  if (document.getElementById('add-meal-module').style.display == 'block') {
    document.getElementById('add-meal-module').style.display = 'none';
  } else {
    setModules('none', 'block', 'none');
  }
}

function addMealBtnClicked() {
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
  ///Finally clear out the add recipe field!
  for (let i = 0, len = addMealInputsUI.length; i < len; i++) {
    addMealInputsUI[i].value = '';
  }

  setModules('none', 'none', 'none');
}

// --------------------------
// Show Meals
// 
// Show the list of meals loaded from firebase
// --------------------------
function showMealBtnClicked() {
  let list = document.getElementById('meal-list')
  if (list.style.display == 'flex') {
    list.style.display = 'none';
    showMealBtnUI.innerHTML = 'Show Recipes';
  } else if ((list.style.display = 'none')) {
    list.style.display = 'flex';
    showMealBtnUI.innerHTML = 'Hide Recipes';
  }
}

// --------------------------
// DELETE
// 
// Delete a meal recipe from firebase
// --------------------------
function deleteButtonClicked(e) {
  e.stopPropagation();

  var mealID = e.target.getAttribute('mealID');

  const mealRef = dbRef.child('meals/' + mealID);

  mealRef.remove();
}

// --------------------------
// EDIT 
// 
// Edit a meal recipe. 
// Open the Edit Form and populate it with data from this meal.
// --------------------------
function editButtonClicked(e) {
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


function fillDayWithRecipe(e) {
  let weekday = '';
  let meal = '';
  if (e.target.getAttribute('meal-key') != undefined) {
    meal = e.target.getAttribute('meal-key');
  }
  if (e.target.getAttribute('day') != undefined) {
    weekday = e.target.getAttribute('day');
  }
  if (weekday != '' && meal != '') {
    const mealRef = dbRef.child('meals/' + meal + '/name');
    const weekdayUI = document.getElementsByClassName(weekday)[0];
    const dayRef = dbRef.child('weekday/');
    // const cardUI = document.getElementById(weekday + '-card');
    let mealSection = document.getElementById(`${weekday}-meal`);
    if (mealSection == undefined) {
      setWeatherDays();
      mealSection = document.getElementById(`${weekday}-meal`);
    }
    meal = snapshot.val()
    let dayMeal = {};
    mealRef.on(
      'value',
      (snapshot) => {
        let meal = snapshot.val();
        mealSection.getElementsByClassName('meal')[0].innerHTML = meal;
        dayMeal[weekday] = meal;
        dayRef.update(dayMeal);
        weekday = '';
        meal = '';
      },
      (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
      }
    );
  }
}



function loadDayWithRecipe() {
  const dayRef = dbRef.child('weekday/');
  dayRef.on('value', (snap) => {
    snap.forEach((childSnap) => {
      let key = childSnap.key;
      let value = childSnap.val();
      let mealSection = document.getElementById(`${key}-meal`);
      if (mealSection == undefined) {
        setWeatherDays();
        mealSection = document.getElementById(`${key}-meal`);
      }
      mealSection.getElementsByClassName('meal')[0].innerHTML = value;
      const weekdayUI = document.getElementsByClassName(key)[0];
    });
  });
}

// if the weather api is slower than the recipe from firebase,
//  then the days aren't set on the days yet. Can set them manually based on 
//  today's day.
function setWeatherDays() {
  let today = new Date().getDay();
  for (var i = 0; i < 7; i++) {
    let day = (today + i) % 7;
    let weekday = days[date.getDay()].toLowerCase();
    let card = document.getElementsByClassName(`day-${i}`)[0];
    card.getElementsByClassName('meals')[0].id = weekday.toLowerCase() + '-meal';
  }
}

window.recipeUpdate = function () {
  readMealData();
}