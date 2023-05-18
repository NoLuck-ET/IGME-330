const template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
    <header class="hero is-small is-primary is-bold p-2">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">HW-3 - Link Buddy!</h1>
                <h2 class="subtitle">Save your links for later!</h2>
            </div>
        </div>
    </header>
    `;

    class Component extends HTMLElement{
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

    customElements.define('header-slot', Component);

    export {Component};