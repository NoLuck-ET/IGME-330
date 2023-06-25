const template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="styles/default-styles.css">
    <div class="footer has-background-info has-text-centered has-text-light p-1">&copy; 2023 Liam Alexiou</div>
    `;

    class FooterComponent extends HTMLElement{
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

    customElements.define('footer-slot', FooterComponent);

    export {FooterComponent};