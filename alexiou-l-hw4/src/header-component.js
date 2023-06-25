const template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="styles/default-styles.css">
    <header class="hero is-small is-info is-bold p-2">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">HW-4 - NY State Park Buddy!</h1>
                <h2 class="subtitle">Your one-stop resource for NYS parks!</h2>
            </div>
        </div>
    </header>
    `;

    class HeaderComponent extends HTMLElement{
        // called when the component is first created, but before it is added to the DOM
        constructor(){
            super();
            // Attach a shadow DOM tree to this instance -- this creates `.shadowRoot` for us
            this.attachShadow({mode: "open"});
            // Clone `template` and append it
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        //we are not observing anything
        //Also no callback
        //Don't need a render method
    }

    customElements.define('header-slot', HeaderComponent);

    export {HeaderComponent};