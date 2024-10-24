
import HeaderComponent from "./components/header/header.component";
import HomeComponent from "./components/home/home.component";
import EMailComponent from "./components/email/email.component";


const mainElement = document.querySelector("main") as HTMLElement;
const loadedComponents: string[] = [];

let currentComponent: HTMLElement | null = null;

export default function main() {
    customElements.define("header-component", HeaderComponent);
    nav();
}

function nav() {
    loadHome();
}

function loadEMail() {
    const component = loadComponent("email-component", EMailComponent);
}

function loadHome() {
    const component = loadComponent("home-component", HomeComponent)
}

function loadComponent(name: string, constructor: CustomElementConstructor): HTMLElement {

    if (!loadedComponents.includes(name)) {
        customElements.define(name, constructor);
        loadedComponents.push(name);
    }

    currentComponent?.remove();
    currentComponent = document.createElement(name);
    mainElement.appendChild(currentComponent);

    return currentComponent;
}
