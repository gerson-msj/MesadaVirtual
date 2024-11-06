import HeaderComponent, { HeaderConfig } from "./components/header.component";
import IndexComponent from "./components/index.component";
import EMailComponent from "./components/email.component";
import CadastroRespComponent from "./components/cadastro-resp.component";
import RespComponent from "./components/resp.component";
import LoginComponent from "./components/login.component";
import { headerMenuClick, headerVoltarClick } from "./models/const.model";
import TokenService from "./services/token.service";
import CadastroDepComponent from "./components/cadastro-dep.component";

class App {
    private mainElement: HTMLElement;
    private loadedComponents: string[] = [];
    private headerComponent: HTMLElement;
    private currentComponent: HTMLElement | null = null;

    constructor() {
        this.mainElement = document.querySelector("main") as HTMLElement;
        this.headerComponent = this.header();
    }

    private header(): HTMLElement {
        customElements.define("header-component", HeaderComponent);
        const headerComponent = document.createElement("header-component");
        const headerElement = document.querySelector("header") as HTMLElement;
        headerElement.appendChild(headerComponent);

        headerComponent.addEventListener(headerMenuClick, () =>
            this.currentComponent?.dispatchEvent(new Event(headerMenuClick)));

        headerComponent.addEventListener(headerVoltarClick, () =>
            this.currentComponent?.dispatchEvent(new Event(headerVoltarClick)));

        headerComponent.addEventListener("initialized", () => {
            this.load();
        });

        return headerComponent;
    }

    private load() {
        const currentComponentName = localStorage.getItem("currentComponentName");
        switch (currentComponentName) {
            case "email-component":
            case "cadastro-resp-component":
            case "login-component":
                this.email();
                break;
            case "resp-component":
                this.resp();
                break;
            case "cadastro-dep-component":
                this.cadastroDep();
                break;
            default:
                this.index();
                break;
        }
    }

    private loadComponent(
        name: string,
        constructor: CustomElementConstructor,
        titulo: string | null = null,
        exibirVoltar: boolean = false,
        exibirMenu: boolean = false): HTMLElement {

        localStorage.setItem("currentComponentName", name);
        const headerConfig: HeaderConfig = { titulo: titulo ?? "Mesada Virtual", exibirVoltar: exibirVoltar, exibirMenu: exibirMenu };
        this.headerComponent.dispatchEvent(new CustomEvent("config", { detail: headerConfig }));

        if (!this.loadedComponents.includes(name)) {
            customElements.define(name, constructor);
            this.loadedComponents.push(name);
        }

        this.currentComponent?.remove();
        this.currentComponent = document.createElement(name);
        this.mainElement.appendChild(this.currentComponent);
        return this.currentComponent;

    }

    private index() {
        localStorage.clear();
        const component = this.loadComponent("index-component", IndexComponent);
        component.addEventListener("entrar", () => this.email());
    }

    private email() {
        const component = this.loadComponent("email-component", EMailComponent);
        component.addEventListener("voltar", () => this.index());
        component.addEventListener("cadastro-responsavel", (ev) => {
            const email: string = (ev as CustomEvent).detail;
            this.cadastroResp(email);
        });
        component.addEventListener("login", (ev) => {
            const email: string = (ev as CustomEvent).detail;
            this.login(email);
        });
    }

    private cadastroResp(email: string) {
        const component = this.loadComponent("cadastro-resp-component", CadastroRespComponent);
        component.addEventListener("voltar", () => this.email());
        component.addEventListener("avancar", () => this.respOrDep());

        component.addEventListener("initialized", () =>
            component.dispatchEvent(new CustomEvent("initializeData", { detail: email }))
        );
    }

    private login(email: string) {
        const component = this.loadComponent("login-component", LoginComponent);
        component.addEventListener("voltar", () => this.email());
        component.addEventListener("avancar", () => this.respOrDep());

        component.addEventListener("initialized", () =>
            component.dispatchEvent(new CustomEvent("initializeData", { detail: email }))
        );
    }

    private respOrDep() {
        const tokenSubject = TokenService.obterTokenSubject();
        if (tokenSubject?.perfil == "Resp")
            this.resp();
        else if (tokenSubject?.perfil == "Dep")
            this.index();
        else
            this.index();
    }

    private resp() {
        const component = this.loadComponent("resp-component", RespComponent, null, false, true);

        component.addEventListener("adicionarDep", () => 
            this.cadastroDep());

        component.addEventListener("sair", () =>
            this.index());
    }

    private cadastroDep() {
        const component = this.loadComponent("cadastro-dep-component", CadastroDepComponent, "Adicionar Dependente", true, false);

        component.addEventListener("voltar", () => 
            this.resp());
    }
}

const main = () => new App();

export default main;

