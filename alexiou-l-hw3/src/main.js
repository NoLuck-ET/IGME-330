import { MyBookmark } from "./myBookmark.js";
import { Favorite } from "./favorite.js";

let favorites = [];
let favorite = new Favorite("d2e7e357-1b1f-4eea-b8f9-25af8aa17138", "RIT", "https://www.rit.edu", "A private university located near Rochester, NY.");
console.log(favorite);
favorites.push(favorite);

const submitClicked = (evt) => {
  console.log("submitClicked");
  let text = document.querySelector("#favorite-text").value.trim();
  let url = document.querySelector("#favorite-url").value.trim();
  let comment = document.querySelector("#favorite-comments").value.trim();
  if(text.length > 0 && url.length > 0 && comment.length > 0){
    let submission = new Favorite(crypto.randomUUID(), text, url, comment);
    favorites.push(submission);
    createBookmarkComponent(submission);
  }else{
    //Website seems to automatically produce an error message on-screen, so I'll just make a console one
    console.log("ERROR: Missing fields");
    evt.preventDefault();
    return false;
  }
  

  evt.preventDefault();
  return false;
};

/*
const clearFormFields = (evt) => {
  console.log("clearFormFields");
  document.querySelector("#favorite-text").value = "";
  document.querySelector("#favorite-url").value = "";
  document.querySelector("#favorite-comments").value = "";

  evt.preventDefault();
  return false;
};*/

const clearFormFields = (evt) => {
  console.log("clearFormFields");
  document.querySelector("#favorite-text").value = "";
  document.querySelector("#favorite-url").value = "";
  document.querySelector("#faovrite-comments").value = "";
  
  evt.preventDefault();
  return false;
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

createBookmarkComponent(new Favorite("58dfh18929", "pain", "https://.pain.com", "Terrible website"));



window.onload = () => {
  loadFavoritesFromStorage();
};