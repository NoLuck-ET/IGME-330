import { MyBookmark } from "./myBookmark.js";
import { Favorite } from "./favorite.js";

let favorites = [];
let favorite = new Favorite(crypto.randomUUID(), "RIT", "hhtps://www.rit.edu", "A private university located near Rochester, NY.");
console.log(favorite);
favorites.push(favorite);

const submitClicked = (evt) => {
  console.log("submitClicked");
  
  
  evt.preventDefault();
  return false;
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
  console.log("help");
};

const loadFavoritesFromStorage = () => {
  for(let f of favorites){
    createBookmarkComponent(f);
    console.log(f);
  }
};

const clearFormFields = (evt) => {
  console.log("clearFormFields");
  document.querySelector("#favorite-text").value = "";
  document.querySelector("#favorite-url").value = "";
  document.querySelector("#favorite-comments").value = "";
  
  evt.preventDefault();
  return false;
};

const init = () => {
  document.querySelector("#favorite-submit-button").onclick = submitClicked;
  document.querySelector("#favorite-cancel-button").onclick = clearFormFields;

  //createBookmarkComponent("58dfh18929", "pain", "https://.pain.com", "Terrible website");
  loadFavoritesFromStorage();
  //let bookmarkHTML = document.querySelector("#bookmarks");
//     for(let b of bookmarks){
//         let book = new MyBookmark;
//         book._text = b.text;
//         book._url = b.url;
//         book._comments = b.comments;
//         book.render();
//         bookmarkHTML.innerHTML += `<li><my-bookmark data-text="${book._text}" data-url="${book._url}" data-comments="${book._comments}">${book.innerHTML}</my-bookmark></li>`;
//         //bookmarkHTML.innerHTML += `<li><my-bookmark>${book.innerHTML}</my-bookmark></li>`;
//     }
};

init();

// const bookmarks = [
//     {
//       text: "Bing",
//       url: "https://www.bing.com",
//       comments: "Bing is a web search engine owned and operated by Microsoft."
//     },
//     {
//       text: "Google",
//       url: "https://www.google.com",
//       comments: "Google Search is a search engine provided and operated by Google."
//     },
//     {
//       text: "DuckDuckGo",
//       url: "https://duckduckgo.com/",
//       comments: "DuckDuckGo (DDG) is an internet search engine that emphasizes protecting searchers' privacy."
//     }
// ];

// window.onload = () => {
//     // // Create a MyBookmark and add it to the list
//     // const bing = document.createElement("my-bookmark");

//     // // ANOTHER way to set custom attributes, the .dataset property
//     // // note that these 2 lines of code will also trigger attributeChangedCallback()
//     // bing.dataset.text = "Bing";
//     // bing.dataset.url = "https://www.bing.com/";

//     // const newLI = document.createElement("li");
//     // newLI.appendChild(bing);
//     // document.querySelector("#bookmarks").appendChild(newLI);

//     let bookmarkHTML = document.querySelector("#bookmarks");
//     for(let b of bookmarks){
//         let book = new MyBookmark;
//         book._text = b.text;
//         book._url = b.url;
//         book._comments = b.comments;
//         book.render();
//         bookmarkHTML.innerHTML += `<li><my-bookmark data-text="${book._text}" data-url="${book._url}" data-comments="${book._comments}">${book.innerHTML}</my-bookmark></li>`;
//         //bookmarkHTML.innerHTML += `<li><my-bookmark>${book.innerHTML}</my-bookmark></li>`;
//     }
// };