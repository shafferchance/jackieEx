export default class Menu extends HTMLElement {
    constructor () {
        super ();
        this.mode = "main";
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.append(this.init());
        this.append(this.main());
    }

    init () {
        const frag = document.createDocumentFragment(); // Creates an empty container
        const mainSlot = document.createElement("slot");
        mainSlot.name = "main-slot";
        
        frag.append(mainSlot);
        return frag;
    }

    // Outputs light DOM to be formatted by encapsulated Shadow DOM
    main () {
        // If you would rather work with raw HTML there are two ways to do that too
        const frag = document.createElement("div");
        const logo = document.createElement("h1"); // Can be any ele this is just my placeholder
        const local = document.createElement("button");
        const network = document.createElement("button");

        frag.slot = "main-slot";
        logo.textContent = "Mini Card";
        local.textContent = "Start new local Game";
        network.textContent = "Start new online Game";

        frag.append(logo); frag.append(local); frag.append(network);
        return frag;
    }

    // Below uses an html file. This is to show two of the several ways to import/create elements
    setup () {
        return fetch("../html/new.html") // Since this is an async call all invocations of this function must be async
            .then(data => data.text()) // Translate the binary stream to a String primitive
            .then(result => {
                const parser = new DOMParser(); // Able to parse data into DOM Nodes
                return document.importNode( // This return will make the resultion of the promise the node
                    parser.parseFromString(result, "text/html")
                );
            });
    }

    startLocal () {
        this.setup()
            .then(node => {
                // The below will find based on HTML attribute slot and then replace to minialmize repaints and reflows on the page
                document.querySelector('[slot="main-slot"]').replaceWith(node);
                document.getElementById("create").addEventListener("submit" , e => {
                    e.preventDefault(); // Will prevent page refresh and stop bubbling on DOM tree
                    // TODO: add player push to server
                });
                document.getElementById("start", e => {
                    e.preventDefault();
                    // TODO: implement shift to board
                });
            });
    }

    startOnline () {
        this.setup()
            .then(node => {
                // The below will find based on HTML attribute slot and then replace to minialmize repaints and reflows on the page
                document.querySelector('[slot="main-slot"]').replaceWith(node);
                document.getElementById("create").addEventListener("submit" , e => {
                    e.preventDefault(); // Will prevent page refresh and stop bubbling on DOM tree
                    // TODO: add player push to server
                });
                document.getElementById("start", e => {
                    e.preventDefault();
                    // TODO: implement shift to board
                });
            });
    }
}

customElements.define("menu-element", Menu);
