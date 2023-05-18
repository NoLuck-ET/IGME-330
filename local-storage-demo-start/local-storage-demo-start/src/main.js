import * as storage from "./storage.js"
let items = ["???!!!"];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ul>
const showItems=()=>{
    // items.forEach(element => {
    //     let li = document.createElement("li");
    //     li.innerText = element;
    //     document.querySelector("#display-list").appendChild(li);
    // });
    
  let itemsDisplay = item => `<li>${item}</li>`
  let itemsHTML = items.map(itemsDisplay).join("");
  document.querySelector("#display-list").innerHTML = itemsHTML;
}

// II. declare and implement addItem(str)
// - this will add str to the items array (so long as str is length 0 or greater)
const addItem=(str)=>{
  items.push(str);
  showItems();

}
// III. declare and implement loadItemsFromLocalStorage()
// - this will load in the favorites array from storage.js
const loadItemsFromLocalStorage=()=>{
  let loaded = [];

  (storage.getFavorites()).forEach(e => {
      loaded.push(e);
  });
  /*for(let e of storage.getFavorites()){
    loaded.push(e);
  }*/
  console.log(loaded);
  loaded.forEach(element => {
    addItem(element);  
  });
}

// Also:
// - be sure to update the <ul> as appropriate
// - be sure to update .localStorage by saving items to .localStorage when appropriate (look in storage.js to see where/how to do this)

showItems();
loadItemsFromLocalStorage();

document.querySelector("#btn-add").onclick=()=>{
  let newItem= document.querySelector("#thing-text").value;
  addItem(newItem);
}