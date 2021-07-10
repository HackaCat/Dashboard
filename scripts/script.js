var firebaseConfig = {
    apiKey: "AIzaSyAyn6b7re7dCQWIIDikmwLDc9aBnq_RMNA",
    authDomain: "dashboard-12638.firebaseapp.com",
    databaseURL: "https://dashboard-12638-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dashboard-12638",
    storageBucket: "dashboard-12638.appspot.com",
    messagingSenderId: "713795201639",
    appId: "1:713795201639:web:3e12266089c1514351c2c2",
    measurementId: "G-M0K5MZHNME"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

const db = firebase.database().ref();
const mealRef = db.child('meals');
// TODO: Set up shopping list in DB
// const listRef = db.child('list');

const mealListUI = document.getElementById("meal-list");

// * Here we're adding the child added event to the meal db reference object
// * It's similar to the 'onClick' event of JS, that grabs a list from Firebase

mealRef.on("child_added", snap => {
    let meal = snap.val();
    let $li = document.createElement("li");
    $li.innerHTML = meal.name;
    $li.setAttribute("child-key", snap.key);
    $li.addEventListener("click", mealClick);
    mealListUI.append($li);
});

function mealClick(e) {
    console.log('beep de boop')
    var mealID = e.target.getAttribute("child-key");
    //Pointing this to the list of ingredients in the DB!
    const ingredientRef = db.child('meals/'+mealID+"/ingredients");
    const ingredientUI = document.getElementById("ingredients");
    ingredientUI.innerHTML = ""
    ingredientRef.on("child_added", snap => {
        var $li = document.createElement("li");
        $li.innerHTML = snap.val(); 
        ingredientUI.append($li);
    });

    const recipeRef = db.child('meals/'+mealID+"/recipe");
    const recipeUI = document.getElementById("recipe");
    recipeUI.innerHTML = ""
    recipeRef.on("child_added", snap => {
        var $li = document.createElement("li");
        // TODO: Key is outputting array key - need this to start at 1
        $li.innerHTML = (snap.key +": " + snap.val()); 
        recipeUI.append($li);
    });
}