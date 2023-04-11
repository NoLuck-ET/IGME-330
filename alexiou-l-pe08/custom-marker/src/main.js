const init = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoibm8tbHVjayIsImEiOiJjbGdhMmF6ZWUwa3h1M3VwY3hkZ3NnYjg1In0.lnNacBxllCuK5iKPUdGZrg';

    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-96, 37.8],
    zoom: 3
    });

    // code from the next step will go here!
    const geojson = {
    type: 'FeatureCollection',
    features: [
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
        },
        properties: {
            title: 'Washington, D.C.',
            description: 'Capital of the U.S.'
        }
        },
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-122.414, 37.776]
        },
        properties: {
            title: 'San Francisco, California',
            description: 'Not sure what goes on here'
        }
        },
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-77.630560, 43.088377]
        },
        properties: {
            title: 'Mc Donald\'s',
            description: 'Closest one to RIT!'
        }
        },
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-154.827631, 34.828239]
        },
        properties: {
            title: 'Woah, what\'s over here?',
            description: 'Maybe a fish?'
        }
        }
    ]
    };
    // add markers to map
    for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        )
    )
    .addTo(map);
    }
};

export {init};