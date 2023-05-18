import { MyBookmark } from "./myBookmark.js";
import { Favorite } from "./favorite.js";

let favorites = [];
let favorite = new Favorite("123", "RIT", "https://www.rit.edu", "A private university located near Rochester, NY."); //d2e7e357-1b1f-4eea-b8f9-25af8aa17138
console.log(favorite);
favorites.push(favorite);

//  submitClicked
//  Submits the information in user-input into a favorites tab
const submitClicked = (evt) => {
  console.log("submitClicked");
  let text = document.querySelector("#favorite-text").value.trim();
  let url = document.querySelector("#favorite-url").value.trim();
  let comment = document.querySelector("#favorite-comments").value.trim();
  //see if user-input is valid
  if(text.length > 0 && url.length > 0 && comment.length > 0){
    let submission = new Favorite(crypto.randomUUID(), text, url, comment);
    favorites.push(submission);
    createBookmarkComponent(submission);
  }else{
    //Print out an error message
    console.log("ERROR: Missing fields");
    evt.preventDefault();
    return false;
  }
  updateCount();

  //stops page from re-loading every time
  evt.preventDefault();
  return false;
};

//  clearFormFields
//  Resets user-input fields
const clearFormFields = (evt) => {
  console.log("clearFormFields");
  document.querySelector("#favorite-text").value = "";
  document.querySelector("#favorite-url").value = "";
  document.querySelector("#favorite-comments").value = "";
  
  //stops page from re-loading every time
  evt.preventDefault();
  return false;
};

//  deleteFavorite
//  Finds the fid of the bookmark that is being deleted, and removes it from the favorites list.
const deleteFavorite = (fid) => {
  let index;
  //loops through favorites to find matching index
  for(let i = 0; i < favorites.length; i++){
    if(favorites[i].fid == fid){
      index = i;
      //ends once it finds the match
      break;
    }
  }
  //used this method before: https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-specific-item-in-js/#:~:text=You%20can%20remove%20the%20last,looks%20like%20arr.pop()%20.&text=The%20pop%20method%20is%20used,also%20returns%20the%20removed%20element.
  let old = favorites.splice(index, 1); // removes the specified bookmark
  console.log(old);
  updateCount();
  //document.querySelector("#update").innerHTML = `Number of Favorites: ${favorites.length}`;
};

//  updateCount
//  updates the number of favorites value
const updateCount = () => {
  document.querySelector("#update").innerHTML = `Number of Favorites: ${favorites.length}`;
};

document.querySelector("#favorite-submit-button").onclick = (evt) => {
  submitClicked(evt);
};

document.querySelector("#favorite-cancel-button").onclick = (evt) => {
  clearFormFields(evt);
};


const createBookmarkComponent = (sample) => { //fid, text, url, comments
  let bookmark = document.createElement("my-bookmark");
  bookmark.dataset.fid = sample._fid;
  bookmark.dataset.text = sample._text;
  bookmark.dataset.url = sample._url;
  bookmark.dataset.comments = sample._comments;
  //set the callback
  bookmark.callback = deleteFavorite;

  const newLI = document.createElement("li");
  newLI.appendChild(bookmark);
  document.querySelector("#bookmarks").appendChild(newLI);
  //console.log("help");
};

const loadFavoritesFromStorage = () => {
  for(let f of favorites){
    createBookmarkComponent(f);
    console.log(f);
  }
};

//createBookmarkComponent(new Favorite("58dfh18929", "pain", "https://pain.com", "Terrible website"));


deleteFavorite("123");
console.log(favorites.length);

window.onload = () => {
  loadFavoritesFromStorage();
  
};