class myFooter extends HTMLElement{
    constructor(){
      super();
      this.name = "Ace Coder";
      this.year = "1812";
    }
    
    //tell the component what attributes to "watch"
    static get observedAttributes(){
      return ["data-name", "data-year"]; // data-name is a custom attribute
    }

    // ** lifecycle events **

    //called when the component is inserted into the DOM
    connectedCallback(){
      this.render();
    }

    //this method is invoked each time one of the componet's "watched" attributes changes
    attributeChangedCallback(attributeName, oldValue, newValue){
      console.log(attributeName, oldValue, newValue);
      if(oldValue === newValue) return;
      if(attributeName == "data-name"){
        this.name = newValue;
      }
      if(attributeName == "data-year"){
        this.year = newValue;
      }
      this.render();
    }

    //helper method
    render(){
      this.innerHTML = `&copy; ${this.year} ${this.name}!`;
    }
  }

  customElements.define('my-footer', myFooter);