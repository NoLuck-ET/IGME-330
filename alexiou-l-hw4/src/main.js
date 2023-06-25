import { FooterComponent } from "./footer-component.js"
import { HeaderComponent } from "./header-component.js"
import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = [];
let geojson;
let currentParkId;
let storeName = "lca9201-hw4-data";


// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	};

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	};

	refreshFavorites();
}

//	showFeatureDetails
//	Implements the detauls from the clicked feature into the HTML
const showFeatureDetails = (id) => {
	let favoriteStatus;
	let disabledStatus;

	// identifies the feature corresponding to the clicked icon
	const feature = getFeatureById(id);
	//checks if it is already favorited and sets two variables
	for(let f of favoriteIds){
		if(feature.id == f){
			favoriteStatus = "disabled"
			disabledStatus = "";
			break;
		}else{
			favoriteStatus = ""
			disabledStatus = "disabled";
		}
	}
	console.log(feature.id);
	// adds the feature information to the 3 respective information areas.
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	// Sets up HTML for page, as well as determines if a buttons is functional
	document.querySelector("#details-2").innerHTML = `<b>Address:</b> ${feature.properties.address}
		<br><b>Phone:</b> <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a>
		<br><b>Website:</b> <a href="${feature.properties.url}"> ${feature.properties.url}</a>
		<div class="field is-grouped">
          <div class="control">
            <button id="favorite-submit-button" class="button is-success" ${favoriteStatus}>Favorite</button>
          </div>
          <div class="control">
            <button id="favorite-cancel-button" class="button is-warning" ${disabledStatus}>Delete</button>
          </div>
        </div>
		`;
	//Sets the HTML for the page
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
	// Gives the button functionality a purpose
	document.querySelector(".control #favorite-submit-button").onclick = () => {
		addToFavorites(feature.id);
	};
	document.querySelector("#favorite-cancel-button").onclick = () => {
		deleteFavorite(feature.id);
	};
};

//	getFeatureByID
//	loops through features array until it finds the feature with the matching id, then returns it
const getFeatureById = (id) => {
	//return geojson.features[find(id)];
	for(let feature of geojson.features){
		if(feature.id == id){
			currentParkId = id;
			return feature;
		}
	}
};

//	refreshFavorites
//	will delete favorites on page, and re-apply them based on favorites array
const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	//load from storage
	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
	writeLocalStorage(favoriteIds);
	//localStorage.setItem(storeName, JSON.stringify(favoriteIds));
};

//	createFavoriteElement
//	Will create a "favorite" html element for the given id.
const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	//zooms camera to the clicked favorite
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	//updates HTML
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
};

//	addToFavorites
//	Pushes the given id to favoriteIds. Prevents multiple favorites of the same id
const addToFavorites = (id) => {
	let index = null;
	for(let i = 0; i < favoriteIds.length; i++){
		if(favoriteIds[i] == id){
			index = i;
			break;
		}
	}
	//	index must be null, otherwise said id is already in favorites, and as such will not be pushed
	if(index == null){
		favoriteIds.push(id);
	}
	
	//	refresh the favorites and writes the change to storage
	refreshFavorites();
	writeLocalStorage(favoriteIds);
};

//	deleteFavorite
//	Removes the given id (if it exists) from favorites array and rewrites storage.
const deleteFavorite = (id) => {
	let index = null;
  	//loops through favorites to find matching index
  	for(let i = 0; i < favoriteIds.length; i++){
		if(favoriteIds[i] == id){
			index = i;
			//ends once it finds the match
			break;
		}
	}
	if(index != null){ //	Forces the need for a result, that way it doesn't delete any old thing.
		let old = favoriteIds.splice(index, 1); // removes the specified bookmark
	}
	// refresh the favorites list and writes the change to storage
	refreshFavorites();
	writeLocalStorage(favoriteIds);
};

//	writeLocalStorage
//	It writes the value to local storage under the key of whatever "storeName" is
const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
};

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("./data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		//console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});

	//	loads the favorites from storage on init
	favoriteIds = null;
    try{
      favoriteIds = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }catch(err){
      console.log(`Problem with JSON.parse() and ${storeName} !`);
      throw err;
    }	
	/*
	document.querySelector("#map").onclick = () => {
		currentParkId = null;
		console.log(currentParkId);
	};*/
};

init();

export {currentParkId};