import { getQuote, quotes } from "./utils.js";

let quoteIndex = 0;

const displayQuote = (index) => {
    document.querySelector("#lbl-output").innerHTML = getQuote(index);
};

const displayPagination = (index) => {
    document.querySelector("#lbl-pagination").innerHTML = `${index+1} of ${quotes.length}`;
};

const nextQuote = () => {
    quoteIndex += 1;
    if (quoteIndex >= quotes.length){
        quoteIndex = 0;
    }
    displayQuote(quoteIndex);
    displayPagination(quoteIndex);
};

const prevQuote = () => {
    quoteIndex -= 1;
    if (quoteIndex < 0){
        quoteIndex = quotes.length - 1;
    }
    displayQuote(quoteIndex);
    displayPagination(quoteIndex);
};

const init = () => {
    displayQuote(quoteIndex);
    displayPagination(quoteIndex);
    document.querySelector("#btn-prev").onclick = prevQuote;
    document.querySelector("#btn-next").onclick = nextQuote;
};


window.onload = init;