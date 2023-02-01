// Imports everything - uses namespace
import * as utils from "./utils.js";

window.onload = () => {
    loadBabble();
};

//declares variables. Not in init due to scope
let words1 = [];
let words2 = [];
let words3 = [];

/*
loadBabble: Locates and loads the json file
*/
const loadBabble = () => {
    const url = "./data/babble-data.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        babbleLoaded(e);
    };
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET",url);
    xhr.send();
};

/*
babbleLoaded: Once the json file is loaded, it parses the data into 3 arrays
    and initialises the button clicks, and loads the page with starter babble.
    ---Note: Almost entirely repaces init(), so init was commented out.
*/
const babbleLoaded = (e) =>{
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);
    const string = e.target.responseText;
    const json = JSON.parse(string); //parses the string into an array

    words1 = json["words1"];
    words2 = json["words2"];
    words3 = json["words3"];

    generateTechno(1);
    //.addEventListener("click", generateTechno(1));
    document.querySelector("#btn-gen-1").onclick = () => {
        generateTechno(1);
    };
    document.querySelector("#btn-gen-5").onclick = () => {
        generateTechno(5);
    };
};

/*
generateTechno: Utilizes a selection of 1 random word from 3
    different arrays to produce technobabble. Updates the HTML
    with the result.
Input: number of technobabbles you'd like printed.
Output: none
*/
const generateTechno = (num) =>{
    document.querySelector("#output").innerHTML = "";
    for(let i = 0; i < num; i++)
    {
        document.querySelector("#output").innerHTML += `${utils.randomWord(words1)} ${utils.randomWord(words2)} ${utils.randomWord(words3)}!\n`;
    }
};

/*
Init: Called upon loading the page, it sets up the javascript
    for use. Prevents errors by assuring HTML is loaded first, 
    and as such can access all querys.
Input: none
Output: none
*/
// const init = () => {
//     loadBabble();           //------- Comented out since it is now a middleman due to loadBabble & babbleLoaded functions.
// };