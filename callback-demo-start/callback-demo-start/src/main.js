import "./appHeader.js";
// I. We are not exporting/importing the AppHeader component class - why not?

// II. A callback function that will be invoked when a component button is clicked
const buttonCallback = (msg) => {
  document.querySelector("#column-left").textContent = `The buttonCallback message is ${msg}`;
  //document.querySelector("app-header").callback = () => console.log("I changed the callback function!");
};

// III. create a new <app-header> and add it to the DOM, at the top of the page
const header = document.createElement("app-header");
// set 2 "custom data" HTML attributes
header.dataset.title="Callback Demo";
header.dataset.subtitle="How can components '<i>call back</i>' to main.js?";
// now set 2 object properties
header.specialNumber = 42; 
header.callback = buttonCallback;
// add component to top of document
document.body.insertBefore(header, document.body.firstElementChild);
