
import HeaderComponent from "./components/header.component";
import HomeComponent from "./components/home.component";
import EMailComponent from "./components/email.component";
import CadastroPrincipalComponent from "./components/cadastro-principal.component";


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
    component.addEventListener("avancar", (ev) => {
        const data: { email: string, usuarioExistente: boolean } = (ev as CustomEvent).detail;
        if (data.usuarioExistente)
            console.log(data.email, data.usuarioExistente);
        else
            loadCadastroPrincipal(data.email);
    });
}

function loadHome() {
    const component = loadComponent("home-component", HomeComponent);
    component.addEventListener("entrar", () => loadEMail());
}

function loadCadastroPrincipal(email: string) {
    const component = loadComponent("cadastro-principal-component", CadastroPrincipalComponent);
    component.addEventListener("voltar", () => loadEMail());
    component.addEventListener("avancar", (ev) => {
        const data: { nome: string, email: string, senha: string } = (ev as CustomEvent).detail;
        console.log(data);
    });
    component.addEventListener("initialized", () =>
        component.dispatchEvent(new CustomEvent("initializeData", { detail: { email: email } }))
    );
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
