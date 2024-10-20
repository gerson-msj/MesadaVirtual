
import HeaderComponent from "./components/header/header.component";
import EMailComponent from "./components/email/email.component";


const mainElement = document.querySelector("main") as HTMLElement;
const loadedComponents: string[] = [];

let currentComponent: HTMLElement | null = null;

export default function main() {
    customElements.define("header-component", HeaderComponent);
    nav();
}

function nav() {
    loadEMail();
}

function loadEMail() {
    const component = loadComponent("email-component", "/", EMailComponent);
}

function loadComponent(name: string, url: string, constructor: CustomElementConstructor): HTMLElement {

    if (!loadedComponents.includes(name)) {
        customElements.define(name, constructor);
        loadedComponents.push(name);
    }

    currentComponent?.remove();
    currentComponent = document.createElement(name);
    mainElement.appendChild(currentComponent);

    return currentComponent;
}
