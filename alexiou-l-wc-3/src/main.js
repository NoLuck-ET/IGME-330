import { MyBookmark } from "./myBookmark.js";

const bookmarks = [
    {
      text: "Bing",
      url: "https://www.bing.com",
      comments: "Bing is a web search engine owned and operated by Microsoft."
    },
    {
      text: "Google",
      url: "https://www.google.com",
      comments: "Google Search is a search engine provided and operated by Google."
    },
    {
      text: "DuckDuckGo",
      url: "https://duckduckgo.com/",
      comments: "DuckDuckGo (DDG) is an internet search engine that emphasizes protecting searchers' privacy."
    }
];

window.onload = () => {
    // // Create a MyBookmark and add it to the list
    // const bing = document.createElement("my-bookmark");

    // // ANOTHER way to set custom attributes, the .dataset property
    // // note that these 2 lines of code will also trigger attributeChangedCallback()
    // bing.dataset.text = "Bing";
    // bing.dataset.url = "https://www.bing.com/";

    // const newLI = document.createElement("li");
    // newLI.appendChild(bing);
    // document.querySelector("#bookmarks").appendChild(newLI);

    let bookmarkHTML = document.querySelector("#bookmarks");
    for(let b of bookmarks){
        let book = new MyBookmark;
        book._text = b.text;
        book._url = b.url;
        book._comments = b.comments;
        book.render();
        bookmarkHTML.innerHTML += `<li><my-bookmark data-text="${book._text}" data-url="${book._url}" data-comments="${book._comments}">${book.innerHTML}</my-bookmark></li>`;
        //bookmarkHTML.innerHTML += `<li><my-bookmark>${book.innerHTML}</my-bookmark></li>`;
    }
};