
import HeaderComponent from "./components/header.component";
import IndexComponent from "./components/index.component";
import EMailComponent from "./components/email.component";
import CadastroResponsavelComponent from "./components/cadastro-responsavel.component";
import HomeComponent from "./components/home.component";
import LoginComponent from "./components/login.component";


const mainElement = document.querySelector("main") as HTMLElement;
const loadedComponents: string[] = [];

let currentComponent: HTMLElement | null = null;

export default function main() {
    customElements.define("header-component", HeaderComponent);
    load();
}

function load() {
    const currentComponentName = localStorage.getItem("currentComponentName");
    switch (currentComponentName) {
        case "email-component":
        case "cadastro-responsavel-component":
        case "login-component":
            loadEMail();
            break;
        case "home-component":
            LoadHome();
            break;
        default:
            loadIndex();
            break;
    }
}

function loadEMail() {
    const component = loadComponent("email-component", EMailComponent);
    component.addEventListener("voltar", () => loadIndex());
    component.addEventListener("cadastro-responsavel", (ev) => {
        const email: string = (ev as CustomEvent).detail;
        loadCadastroResponsavel(email);
    });
    component.addEventListener("login", (ev) => {
        const email: string = (ev as CustomEvent).detail;
        loadLogin(email);
    });
}

function loadIndex() {
    localStorage.clear();
    const component = loadComponent("index-component", IndexComponent);
    component.addEventListener("entrar", () => loadEMail());
}

function loadCadastroResponsavel(email: string) {
    const component = loadComponent("cadastro-responsavel-component", CadastroResponsavelComponent);
    component.addEventListener("voltar", () => loadEMail());
    component.addEventListener("avancar", () => LoadHome());

    component.addEventListener("initialized", () =>
        component.dispatchEvent(new CustomEvent("initializeData", { detail: email }))
    );
}

function loadLogin(email: string) {
    const component = loadComponent("login-component", LoginComponent);
    component.addEventListener("voltar", () => loadEMail());
    component.addEventListener("avancar", () => LoadHome());

    component.addEventListener("initialized", () =>
        component.dispatchEvent(new CustomEvent("initializeData", { detail: email }))
    );
}

function LoadHome() {
    const component = loadComponent("home-component", HomeComponent);

    component.addEventListener("sair", () => 
        loadIndex());
}

function loadComponent(name: string, constructor: CustomElementConstructor): HTMLElement {

    if (!loadedComponents.includes(name)) {
        customElements.define(name, constructor);
        loadedComponents.push(name);
    }

    currentComponent?.remove();
    currentComponent = document.createElement(name);
    localStorage.setItem("currentComponentName", name);
    mainElement.appendChild(currentComponent);
    return currentComponent;
}
