import * as main from "./main.js";
export {preloadImage, images};
let images = [];

window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	images.push(preloadImage("./images/moon.png"));
	images.push(preloadImage("./images/sun.png"));
	images.push(preloadImage("./images/tower.png"));
	
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

