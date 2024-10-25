
import HeaderComponent from "./components/header/header.component";
import HomeComponent from "./components/home/home.component";
import EMailComponent from "./components/email/email.component";


const mainElement = document.querySelector("main") as HTMLElement;
const loadedComponents: string[] = [];

let currentComponent: HTMLElement | null = null;

export default function main() {
    customElements.define("header-component", HeaderComponent);
    load();
}

function load(){
    const currentComponentName = localStorage.getItem("currentComponentName");
    switch (currentComponentName) {
        case "email-component":
            loadEMail();
            break;
        default:
            loadHome();
            break;
    }
}

function loadEMail() {
    const component = loadComponent("email-component", EMailComponent);
    component.addEventListener("voltar", () => loadHome());
}

function loadHome() {
    const component = loadComponent("home-component", HomeComponent);
    component.addEventListener("entrar", () => loadEMail());
}

function loadComponent(name: string, constructor: CustomElementConstructor): HTMLElement {
    
    if (!loadedComponents.includes(name)) {
        customElements.define(name, constructor);
        loadedComponents.push(name);
    }

    currentComponent?.remove();
    currentComponent = document.createElement(name);
    mainElement.appendChild(currentComponent);

    localStorage.setItem("currentComponentName", name);

    return currentComponent;
}
