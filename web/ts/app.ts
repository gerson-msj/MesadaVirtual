
import HeaderComponent from "./components/header.component";
import IndexComponent from "./components/index.component";
import EMailComponent from "./components/email.component";
import CadastroResponsavelComponent from "./components/cadastro-responsavel.component";
import HomeComponent from "./components/home.component";


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
            loadEMail();
            break;
        default:
            loadIndex();
            break;
    }
}

function loadEMail() {
    const component = loadComponent("email-component", EMailComponent);
    component.addEventListener("voltar", () => loadIndex());
    component.addEventListener("avancar", (ev) => {
        const data: { email: string, usuarioExistente: boolean } = (ev as CustomEvent).detail;
        if (data.usuarioExistente)
            console.log(data.email, data.usuarioExistente);
        else
            loadCadastroResponsavel(data.email);
    });
}

function loadIndex() {
    const component = loadComponent("index-component", IndexComponent);
    component.addEventListener("entrar", () => loadEMail());
}

function loadCadastroResponsavel(email: string) {
    const component = loadComponent("cadastro-responsavel-component", CadastroResponsavelComponent);
    component.addEventListener("voltar", () => loadEMail());
    component.addEventListener("avancar", () => LoadHome());
    
    component.addEventListener("initialized", () =>
        component.dispatchEvent(new CustomEvent("initializeData", { detail: { email: email } }))
    );
}

function LoadHome() {
    const component = loadComponent("home-component", HomeComponent);
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
