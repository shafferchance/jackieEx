import { PSEvent, Action, Subscriber } from '../lib/pubsubStructs.js';
import { UserManager } from '../lib/publishers.js';
import { translate } from '../lib/workerCopy.js';

export default class Menu extends HTMLElement {
    constructor (pubsub) {
        super ();
        this.mode = "main";
        this.pubsub = pubsub;
        this.shadow = this.attachShadow({mode: 'open'});
        this.init().then(node => this.shadow.append(node));
        this.append(this.main());
    }

    connectedCallback () {
        console.log("connected");
        if (!this.isConnected) return;
        this.pubsub.onmessage = this.playerAdded;
    }

    disconnectedCallback () {
        console.log("disconnected");
        this.pubsub.onmessage = undefined;
    }

    init () {
        const frag = document.createDocumentFragment();
        const container = document.createElement("div");
        const style = document.createElement("style");
        const mainSlot = document.createElement("slot");
        const settingSlot = document.createElement("slot");
        const liveInfoSlot = document.createElement("slot");

        return fetch('../lib/shadow-menu.css')
            .then(raw => raw.text())
            .then(txt => {
                style.textContent = txt;
                container.classList.add("root");
                mainSlot.name = "main-slot";
                settingSlot.name = "setting-slot";
                liveInfoSlot.name = "live-info-slot";
                
                frag.append(style);
                frag.append(container);
                container.append(mainSlot);
                container.append(liveInfoSlot);
                container.append(settingSlot);
                return frag;
            });
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
        local.addEventListener("click", () => {
            this.startLocal();
        });
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
                return parser.parseFromString(result, "text/html")
                             .head
                             .childNodes[0].content;
            });
    }

    startLocal () {
        this.setup()
            .then(node => {
                // The below will find based on HTML attribute slot and then replace to minialmize repaints and reflows on the page
                document.querySelector('[slot="main-slot"]').replaceWith(node);
                document.getElementById("create").addEventListener("submit" , e => {
                    e.preventDefault(); // Will prevent page refresh and stop bubbling on DOM tree
                    const usr = new Usr();
                    for (let ele of e.target) {
                        if (ele.type === "text") {
                            usr.name = ele.value;
                        }
                        if (ele.type === "color") {
                            usr.color = ele.value;
                        }
                    }
                    console.log(this.pubsub);
                    this.pubsub.postMessage(
                        new Action(
                            "userManager",
                            "addPlayer",
                            usr
                        )
                    );
                });
                document.getElementById("start", e => {
                    e.preventDefault();
                    // TODO: implement shift to board
                });

                // Adding user manager to pub sub system
                this.pubsub.postMessage(
                    new Action(
                        "","",
                        translate(UserManager),
                        "appendPublisher"
                    )
                );

                this.pubsub.postMessage(
                    new Action(
                        "userManager",
                        "addPlayer",
                        this.querySelector('[slot=live-info-slot]').classList.item(0),
                        "subscribe"
                    )
                );
            });
    }

    startOnline () {
        this.setup()
            .then(node => {
                // The below will find based on HTML attribute slot and then replace to minialmize repaints and reflows on the page
                document.querySelector('[slot="main-slot"]').replaceWith(node);
                document.getElementById("create").addEventListener("submit" , e => {
                    e.preventDefault(); // Will prevent page refresh and stop bubbling on DOM tree
                    
                });
                document.getElementById("start").addEventListener("click", e => {
                    e.preventDefault();
                    // TODO: implement shift to board
                });
                
            });
    }

    playerAdded (wrkrMsg) {
        function userElement (usr) {
            const parent = document.createElement('div');
            const h3 = document.createElement('h3');
            const color = document.createElement('div');
    
            h3.textContent = usr.name;
            color.classList.add("player-card-color");
            color.style = `background-color: ${usr.color}`;
    
            parent.append(h3);
            parent.append(color);
            parent.classList.add("player-card");
    
            return parent;
        }
        console.log(wrkrMsg);
        switch(wrkrMsg.data.action) {
            case 'playersChanged':
                const div = document.querySelector('[slot=live-info-slot]');
                const container = document.createElement('div');
                for(const usr in wrkrMsg.data.players) {
                    container.append(userElement(wrkrMsg.data.players[usr]));
                }
                if (div.childNodes.length > 0) {
                    div.replaceChild(container, div.childNodes[0]);
                    break;
                }
                div.appendChild(container);
                break;
            default:
                console.log("Not supported in menu");
                break;
        }
    }
}

customElements.define("menu-element", Menu);

function Usr (name, color) {
    this.name = name;
    this.color = color;
}

function Usrs (args) {
    this.users = [];
}

Usrs.prototype.appendUser = user => {
    this.users.append(user);
}