import * as main from "./main.js";
export {preloadImage, images};
let images = [];
//let transfer = [];

window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do 
	//images
	images.push(preloadImage("./images/moon.png"));
	images.push(preloadImage("./images/sun.png"));
	images.push(preloadImage("./images/tower.png"));
	images.push(preloadImage("./images/sunset.png"));
	images.push(preloadImage("./images/fire.png"));

	// preload here - images, additional sounds, etc...
	loadJsonXHR();
	// 2 - start up app
	main.init();
}

const preloadImage = (url) => {
	let img = new Image();
	
	img.onload = () => {
	  console.log(`Image at url "${url}" successfully loaded.`);
	};

	img.onerror = () => {
	  console.log(`Image at url "${url}" wouldn't load! Check your URL!`);
	};

	// start downloading the image (it is located on an RIT server)
  img.src = url;

  return img;
};

//loads and evaluates JSON, applies changes to the HTML according to data in JSON
function loadJsonXHR(){
	const url = "./data/av-data.json";
	const xhr = new XMLHttpRequest();
	xhr.onload = (e) => {
		//preload
		console.log(`In onload - HTTP Status Code = ${e.target.status}`);
		const string = e.target.responseText;

		let json;
		try{
			json = JSON.parse(string);
		}catch(err){
			console.log(`Error: ${err}`);
			document.querySelector("#track-select").innerHTML = "JSON ERROR";
			return;
		}

		
		//set up songs list
		const songs = json.songs;
		let songHtml;

		songHtml += `<option value="media/${songs[0].fileName}">${songs[0].name}</option> `;
		for(let i = 1; i < songs.length; i++){
			songHtml += `<option value="media/${songs[i].fileName}">${songs[i].name}</option> `;
		}
		document.querySelector("#track-select").innerHTML = songHtml;
		//establish title 
		document.querySelector("h1").innerHTML = json.appTitle || "Not Working"; // The "||" means that the default will only become real if a falsey value is the primary


		//handling the images - DOESN'T WORK, loads out of order. I can't find a way to fix it online without
		//					    causing errors in canvas.js because it ends up either loading out of order or
		//						starting the drawing process before loading. No idea why.
		/*const imageData = json.images;
		for(let i = 0; i < imageData.length; i++){
			images.push(preloadImage(`./images/${imageData[i].fileName}`));
			console.log(`${imageData[i].fileName}`);
			setTimeout(2); // so there is enough time to load - REQUIRED, otherwise files loaded out of order.
		}*/

		//let instHTML = `<ol>${intructions.map(w => `<li>${w}</li>`).join("")}</ol>`;
		let instHTML = `<ul>`
		for(let i of json.instructions){
			instHTML += `<li>${i}</li>`;
		}
		instHTML += "</ul>";
		document.querySelector("#instructions").innerHTML = instHTML;
	};
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();
}

