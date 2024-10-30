/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    // games will be an array of objects with the same structure as GAMES_JSON.
    for (let game of games){
        // create a new div element, which will become the game card
        // document.createElement(/* some HTML tag here */) - creates an HTML element
        let newDiv = document.createElement("div");

        // add the class game-card to the list
        // element.classList.add(/* string with class name here */) - adds a class to the given element
        newDiv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        // element.innerHTML = /* HTML goes here */ - sets the inner HTML of an element
        // console.log(game)
        newDiv.innerHTML = `
            <p> Game Name: ${game.name} </p>
            <p> ${game.description} </p>
            <p> Backers: ${game.backers} </p>
            <p> Pledged: $${game.pledged.toLocaleString("en-US")} </p>
            <p> Goal: $${game.goal.toLocaleString("en-US")} </p>
            <img class="game-img" src="${game.img}" alt="game image">
        `;

        // append the game to the games-container
        gamesContainer.appendChild(newDiv);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
// const totalListens = songs.reduce( (acc, song) => {
// return acc + song.listens;
// }, 0);
const totalContributions = GAMES_JSON.reduce( (acc, game ) => {
    return acc + game.backers
}, 0);

// testing
// console.log(totalContributions)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
<p>${totalContributions.toLocaleString('en-US')} </p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
<p>$${totalRaised.toLocaleString('en-US')}</p>
`

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const numGames = GAMES_JSON.reduce ( (acc) => {
    return acc + 1
}, 0);

gamesCard.innerHTML = `
<p>${numGames}</p>
`


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/
// let listOfIncreasedSongs = songs.filter ( (song) => {
//     return song.playsIn2022 > song.playsIn2021;
//     });

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged < game.goal
    });
    //console.log(unfundedGames);
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter ( (game) => {
        return game.pledged >= game.goal
    });
    //console.log(`Funded Games ${fundedGames}`);
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
//ex.document.getElementById("myBtn").addEventListener("click", displayDate);
//element.addEventListener(event, function, useCapture);
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
// let totalUnfunded = GAMES_JSON.filter ( game => 
//     game.pledged < game.goal
// ).length;

let totalUnfunded = GAMES_JSON.reduce( (acc, game) => {
    return game.pledged < game.goal ? acc + 1 : acc;
}, 0);

//console.log(totalUnfunded)

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `Currently ${totalUnfunded} ${totalUnfunded != 1 ? "games" : "game" } are unfunded. 
${totalUnfunded > 0 ? "Please help us fund these amazing games!" : "We did it!"}
`;
//console.log(displayStr);

// create a new DOM element containing the template string and append it to the description container
let strDiv = document.createElement("p");
strDiv.innerHTML = `
${displayStr}
`;

descriptionContainer.appendChild(strDiv);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

// create a new element to hold the name of the top pledge game, then append it to the correct element

// do the same for the runner up item