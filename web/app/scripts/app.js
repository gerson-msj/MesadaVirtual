var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("models/const.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenLSKey = exports.headerMenuVisible = exports.headerVoltarClick = exports.headerMenuClick = exports.PerfilDep = exports.PerfilResp = void 0;
    exports.PerfilResp = "Resp";
    exports.PerfilDep = "Dep";
    exports.headerMenuClick = "headerMenuClick";
    exports.headerVoltarClick = "headerVoltarClick";
    exports.headerMenuVisible = "headermenuVisible";
    exports.tokenLSKey = "token";
});
define("models/model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/base/service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Service {
        constructor() { }
    }
    exports.default = Service;
});
define("components/base/viewmodel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ViewModel {
        constructor() { }
        getElement(name) {
            return document.querySelector(`#${name}`);
        }
    }
    exports.default = ViewModel;
});
define("components/base/component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Component extends HTMLElement {
        _service = null;
        get service() { return this._service; }
        _viewModel = null;
        get viewModel() { return this._viewModel; }
        _tokenSubject = null;
        get tokenSubject() { return this._tokenSubject; }
        modelPath;
        constructor(modelName) {
            super();
            this.modelPath = `/models/${modelName}.model.html`;
        }
        async connectedCallback() {
            await this.initializeElement();
        }
        async initializeElement() {
            await this.initializeModel();
            await this.initialize();
            this.dispatchEvent(new Event("initialized"));
        }
        async initializeModel() {
            const requestModel = await fetch(this.modelPath);
            const model = await requestModel.text();
            const modelTemplate = document.createElement("div");
            modelTemplate.innerHTML = model;
            const template = modelTemplate.querySelector("template");
            this.appendChild(template.content.cloneNode(true));
        }
        validarTokenSubject() {
            try {
                const token = localStorage.getItem("token");
                const payload = JSON.parse(atob(token.split(".")[1]));
                this._tokenSubject = payload.sub;
                return true;
            }
            catch (error) {
                return false;
            }
        }
        // protected getElement<T>(name: string): T {
        //     //return this.shadow.querySelector(`#${name}`) as T;
        //     return this.querySelector(`#${name}`) as T;
        // }
        initializeResources(viewModel, service) {
            this._service = new service();
            this._viewModel = new viewModel();
            return Promise.resolve();
        }
        dispatch(event, eventName) {
            event = () => this.dispatchEvent(new Event(eventName));
        }
    }
    exports.default = Component;
});
define("components/header.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_1, component_1, service_1, viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_1 = __importDefault(component_1);
    service_1 = __importDefault(service_1);
    viewmodel_1 = __importDefault(viewmodel_1);
    class HeaderViewModel extends viewmodel_1.default {
        icone;
        titulo;
        menu;
        cssPointer = "pointer";
        cssOculto = "oculto";
        onMenuClick = () => { };
        onVoltarClick = () => { };
        constructor() {
            super();
            this.icone = this.getElement("icone");
            this.titulo = this.getElement("titulo");
            this.menu = this.getElement("menu");
            this.menu.addEventListener("click", () => this.onMenuClick());
            this.icone.addEventListener("click", () => {
                if (this.icone.innerText == "chevron_left")
                    this.onVoltarClick();
            });
        }
        config(headerConfig) {
            this.titulo.innerText = headerConfig.titulo;
            if (headerConfig.exibirVoltar) {
                this.icone.innerText = "chevron_left";
                if (!this.icone.classList.contains(this.cssPointer))
                    this.icone.classList.add(this.cssPointer);
            }
            else {
                this.icone.innerText = "currency_exchange";
                if (this.icone.classList.contains(this.cssPointer))
                    this.icone.classList.remove(this.cssPointer);
            }
            const estaOculto = this.menu.classList.contains(this.cssOculto);
            if (headerConfig.exibirMenu && estaOculto)
                this.menu.classList.remove(this.cssOculto);
            else if (!headerConfig.exibirMenu && !estaOculto)
                this.menu.classList.add(this.cssOculto);
        }
    }
    class HeaderService extends service_1.default {
        constructor() {
            super();
        }
    }
    class HeaderComponent extends component_1.default {
        constructor() {
            super("header");
        }
        async initialize() {
            await this.initializeResources(HeaderViewModel, HeaderService);
            this.viewModel.onMenuClick = () => this.dispatchEvent(new Event(const_model_1.headerMenuClick));
            this.viewModel.onVoltarClick = () => this.dispatchEvent(new Event(const_model_1.headerVoltarClick));
            this.addEventListener("config", (ev) => {
                const headerConfig = ev.detail;
                this.viewModel.config(headerConfig);
            });
        }
    }
    exports.default = HeaderComponent;
});
define("components/index.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_2, service_2, viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_2 = __importDefault(component_2);
    service_2 = __importDefault(service_2);
    viewmodel_2 = __importDefault(viewmodel_2);
    class IndexViewModel extends viewmodel_2.default {
        entrar;
        onEntrar = () => { };
        constructor() {
            super();
            this.entrar = this.getElement("entrar");
            this.entrar.addEventListener("click", () => this.onEntrar());
        }
    }
    class IndexService extends service_2.default {
    }
    class IndexComponent extends component_2.default {
        constructor() {
            super("index");
        }
        async initialize() {
            await this.initializeResources(IndexViewModel, IndexService);
            this.viewModel.onEntrar = () => this.dispatchEvent(new Event("entrar"));
        }
    }
    exports.default = IndexComponent;
});
define("services/api.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ApiService {
        baseUrl;
        constructor(baseUrl) {
            this.baseUrl = `/api/${baseUrl}`;
        }
        async doGet(searchParams, bearer = null) {
            const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;
            const response = await fetch(url, {
                method: "GET",
                headers: this.getHeaders(bearer)
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            else {
                throw new Error(response.statusText);
            }
        }
        async doPost(obj, bearer = null) {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: this.getHeaders(bearer),
                body: JSON.stringify(obj)
            });
            const data = await response.json();
            return data;
        }
        async doPut(obj, bearer = null) {
            const response = await fetch(this.baseUrl, {
                method: "PUT",
                headers: this.getHeaders(bearer),
                body: JSON.stringify(obj)
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            else {
                const error = await response.json();
                console.log("Erro:", error);
                throw new Error(response.statusText);
            }
        }
        getHeaders(bearer) {
            const headers = { "content-type": "application/json; charset=utf-8" };
            if (bearer !== null)
                headers["authorization"] = `Bearer ${bearer}`;
            return headers;
        }
    }
    exports.default = ApiService;
});
define("components/email.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_1, component_3, service_3, viewmodel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_1 = __importDefault(api_service_1);
    component_3 = __importDefault(component_3);
    service_3 = __importDefault(service_3);
    viewmodel_3 = __importDefault(viewmodel_3);
    class EMailViewModel extends viewmodel_3.default {
        email;
        voltar;
        avancar;
        onVoltar = () => { };
        onAvancar = (email) => { };
        constructor() {
            super();
            this.email = this.getElement("email");
            this.voltar = this.getElement("voltar");
            this.avancar = this.getElement("avancar");
            this.voltar.addEventListener("click", () => {
                this.email.value = "";
                this.onVoltar();
            });
            this.avancar.addEventListener("click", () => {
                this.onAvancar(this.email.value);
            });
        }
    }
    class EMailService extends service_3.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_1.default("usuario");
        }
        async usuarioExistente(email) {
            const result = await this.apiUsuario.doGet(new URLSearchParams({ email: email }));
            return result.usuarioExistente;
        }
    }
    class EMailComponent extends component_3.default {
        constructor() {
            super("email");
        }
        initialize() {
            this.initializeResources(EMailViewModel, EMailService);
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (email) => await this.avancar(email);
            return Promise.resolve();
        }
        async avancar(email) {
            const usuarioExistente = await this.service.usuarioExistente(email);
            const event = usuarioExistente ? "login" : "cadastro-responsavel";
            this.dispatchEvent(new CustomEvent(event, { detail: email }));
        }
    }
    exports.default = EMailComponent;
});
define("models/request.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("models/response.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/cadastro-resp.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_2, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_2 = __importDefault(api_service_2);
    component_4 = __importDefault(component_4);
    service_4 = __importDefault(service_4);
    viewmodel_4 = __importDefault(viewmodel_4);
    class CadastroRespViewmodel extends viewmodel_4.default {
        nome;
        _email;
        senha;
        voltar;
        avancar;
        result;
        get email() { return this._email.value; }
        ;
        set email(value) { this._email.value = value; }
        onVoltar = () => { };
        onAvancar = (request) => { };
        constructor() {
            super();
            this.nome = this.getElement("nome");
            this._email = this.getElement("email");
            this.senha = this.getElement("senha");
            this.voltar = this.getElement("voltar");
            this.avancar = this.getElement("avancar");
            this.result = this.getElement("result");
            this.voltar.addEventListener("click", () => this.onVoltar());
            this.avancar.addEventListener("click", () => {
                this.onAvancar({
                    nome: this.nome.value,
                    email: this._email.value,
                    senha: this.senha.value
                });
            });
        }
        ocultarResult() {
            if (!this.result.classList.contains("oculto"))
                this.result.classList.add("ocultar");
        }
        apresentarResult(message) {
            this.result.innerText = message;
            if (this.result.classList.contains("oculto"))
                this.result.classList.remove("oculto");
        }
    }
    class CadastroRespService extends service_4.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_2.default("usuario");
        }
        cadastrarResp(request) {
            return this.apiUsuario.doPut(request);
        }
    }
    class CadastroRespComponent extends component_4.default {
        constructor() {
            super("cadastro-resp");
        }
        async initialize() {
            await this.initializeResources(CadastroRespViewmodel, CadastroRespService);
            this.viewModel.ocultarResult();
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (request) => {
                try {
                    var tokenResp = await this.service.cadastrarResp(request);
                    if (tokenResp.token != null) {
                        localStorage.setItem("token", tokenResp.token);
                        this.dispatchEvent(new Event("avancar"));
                    }
                    else {
                        throw new Error(tokenResp.message ?? "Algo deu errado! (⊙_◎)");
                    }
                }
                catch (error) {
                    console.error("cadastro-resp.component onAvancar ", error);
                    this.viewModel.apresentarResult("Algo deu errado! (⊙_◎)");
                }
            };
            this.addEventListener("initializeData", (ev) => {
                const email = ev.detail;
                this.viewModel.email = email;
            });
        }
        ;
    }
    exports.default = CadastroRespComponent;
});
define("services/token.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TokenService {
        static obterTokenSubject() {
            try {
                const token = localStorage.getItem("token");
                const payload = JSON.parse(atob(token.split(".")[1]));
                return payload.sub;
            }
            catch (error) {
                return null;
            }
        }
    }
    exports.default = TokenService;
});
define("components/resp.component", ["require", "exports", "models/const.model", "services/token.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_2, token_service_1, component_5, service_5, viewmodel_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    token_service_1 = __importDefault(token_service_1);
    component_5 = __importDefault(component_5);
    service_5 = __importDefault(service_5);
    viewmodel_5 = __importDefault(viewmodel_5);
    class RespViewModel extends viewmodel_5.default {
        cards;
        cardTemplate;
        menuContainer;
        menu;
        menuBackdrop;
        adicionarDep;
        onMenuBackdrop = () => { };
        onAdicionarDep = () => { };
        constructor() {
            super();
            this.cards = this.getElement("cards");
            this.cardTemplate = this.getElement("cardTemplate");
            this.menuContainer = this.getElement("menuContainer");
            this.menu = this.getElement("menu");
            this.menuBackdrop = this.getElement("menuBackdrop");
            this.adicionarDep = this.getElement("adicionarDep");
            this.menuBackdrop.addEventListener("click", () => this.onMenuBackdrop());
            this.adicionarDep.addEventListener("click", () => this.onAdicionarDep());
        }
        exibirMenu() {
            this.menuContainer.classList.remove("oculto");
        }
        ocultarMenu() {
            this.menuContainer.classList.add("oculto");
        }
        apresentarDependentes(cards) {
            const card = this.cardTemplate.innerHTML;
            this.cards.innerHTML = cards
                .map(dep => card
                .replace("{nome}", dep.nome)
                .replace("{acumulado}", dep.acumulado.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{pago}", dep.pago.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{saldo}", dep.saldo.toLocaleString('pt-br', { minimumFractionDigits: 2 })))
                .join("");
        }
    }
    class RespService extends service_5.default {
        constructor() {
            super();
        }
        async ObterDependentes() {
            const listaDependentes = [];
            for (let index = 1; index <= 3; index++) {
                listaDependentes.push({ email: `dep${index}@email.com`, nome: `Dep ${index}`, acumulado: 50, pago: 10, saldo: 40 });
            }
            return Promise.resolve(listaDependentes);
        }
    }
    class RespComponent extends component_5.default {
        constructor() {
            super("resp");
        }
        async initialize() {
            this.initializeResources(RespViewModel, RespService);
            const tokenSubject = token_service_1.default.obterTokenSubject();
            if (tokenSubject == null) {
                this.dispatchEvent(new Event("sair"));
                return;
            }
            await this.popularDependentes();
            this.addEventListener(const_model_2.headerMenuClick, () => this.viewModel.exibirMenu());
            this.viewModel.onMenuBackdrop = () => this.viewModel.ocultarMenu();
            this.viewModel.onAdicionarDep = () => this.dispatchEvent(new Event("adicionarDep"));
        }
        async popularDependentes() {
            const listaDependentes = await this.service.ObterDependentes();
            this.viewModel.apresentarDependentes(listaDependentes);
        }
    }
    exports.default = RespComponent;
});
define("components/login.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_3, component_6, service_6, viewmodel_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_3 = __importDefault(api_service_3);
    component_6 = __importDefault(component_6);
    service_6 = __importDefault(service_6);
    viewmodel_6 = __importDefault(viewmodel_6);
    class LoginViewModel extends viewmodel_6.default {
        _email;
        senha;
        voltar;
        avancar;
        result;
        get email() { return this._email.value; }
        ;
        set email(value) { this._email.value = value; }
        onVoltar = () => { };
        onAvancar = (request) => { };
        constructor() {
            super();
            this._email = this.getElement("email");
            this.senha = this.getElement("senha");
            this.voltar = this.getElement("voltar");
            this.avancar = this.getElement("avancar");
            this.result = this.getElement("result");
            this.voltar.addEventListener("click", () => this.onVoltar());
            this.avancar.addEventListener("click", () => {
                this.onAvancar({
                    email: this.email,
                    senha: this.senha.value
                });
            });
        }
        ocultarResult() {
            if (!this.result.classList.contains("oculto"))
                this.result.classList.add("ocultar");
        }
        apresentarResult(message) {
            this.result.innerText = message;
            if (this.result.classList.contains("oculto"))
                this.result.classList.remove("oculto");
        }
    }
    class LoginService extends service_6.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_3.default("usuario");
        }
        login(request) {
            return this.apiUsuario.doPost(request);
        }
    }
    class LoginComponent extends component_6.default {
        constructor() {
            super("login");
        }
        async initialize() {
            await this.initializeResources(LoginViewModel, LoginService);
            this.viewModel.ocultarResult();
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (request) => await this.login(request);
            this.addEventListener("initializeData", (ev) => {
                const email = ev.detail;
                this.viewModel.email = email;
            });
            this.dispatchEvent(new Event("initialized"));
        }
        async login(request) {
            try {
                var tokenResp = await this.service.login(request);
                if (tokenResp.token != null) {
                    localStorage.setItem("token", tokenResp.token);
                    this.dispatchEvent(new Event("avancar"));
                }
                else {
                    throw new Error(tokenResp.message ?? "Algo deu errado! (⊙_◎)");
                }
            }
            catch (error) {
                console.error("login.component onAvancar ", error);
                this.viewModel.apresentarResult("Algo deu errado! (⊙_◎)");
            }
        }
    }
    exports.default = LoginComponent;
});
define("components/cadastro-dep.component", ["require", "exports", "models/const.model", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, const_model_3, component_7, service_7, viewmodel_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_7 = __importDefault(component_7);
    service_7 = __importDefault(service_7);
    viewmodel_7 = __importDefault(viewmodel_7);
    class CadastroDepViewModel extends viewmodel_7.default {
        constructor() {
            super();
        }
    }
    class CadastroDepService extends service_7.default {
        constructor() {
            super();
        }
    }
    class CadastroDepComponent extends component_7.default {
        constructor() {
            super("cadastro-dep");
        }
        async initialize() {
            await this.initializeResources(CadastroDepViewModel, CadastroDepService);
            this.addEventListener(const_model_3.headerVoltarClick, () => this.dispatchEvent(new Event("voltar")));
        }
    }
    exports.default = CadastroDepComponent;
});
define("app", ["require", "exports", "components/header.component", "components/index.component", "components/email.component", "components/cadastro-resp.component", "components/resp.component", "components/login.component", "models/const.model", "services/token.service", "components/cadastro-dep.component"], function (require, exports, header_component_1, index_component_1, email_component_1, cadastro_resp_component_1, resp_component_1, login_component_1, const_model_4, token_service_2, cadastro_dep_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    email_component_1 = __importDefault(email_component_1);
    cadastro_resp_component_1 = __importDefault(cadastro_resp_component_1);
    resp_component_1 = __importDefault(resp_component_1);
    login_component_1 = __importDefault(login_component_1);
    token_service_2 = __importDefault(token_service_2);
    cadastro_dep_component_1 = __importDefault(cadastro_dep_component_1);
    class App {
        mainElement;
        loadedComponents = [];
        headerComponent;
        currentComponent = null;
        constructor() {
            this.mainElement = document.querySelector("main");
            this.headerComponent = this.header();
        }
        header() {
            customElements.define("header-component", header_component_1.default);
            const headerComponent = document.createElement("header-component");
            const headerElement = document.querySelector("header");
            headerElement.appendChild(headerComponent);
            headerComponent.addEventListener(const_model_4.headerMenuClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_4.headerMenuClick)));
            headerComponent.addEventListener(const_model_4.headerVoltarClick, () => this.currentComponent?.dispatchEvent(new Event(const_model_4.headerVoltarClick)));
            headerComponent.addEventListener("initialized", () => {
                this.load();
                this.currentComponent?.addEventListener("initialized", () => {
                    this.footer();
                });
            });
            return headerComponent;
        }
        load() {
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
        loadComponent(name, constructor, titulo = null, exibirVoltar = false, exibirMenu = false) {
            localStorage.setItem("currentComponentName", name);
            const headerConfig = { titulo: titulo ?? "Mesada Virtual", exibirVoltar: exibirVoltar, exibirMenu: exibirMenu };
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
        footer() {
            const div = document.querySelector("#footer");
            div?.classList.remove("oculto");
        }
        index() {
            localStorage.clear();
            const component = this.loadComponent("index-component", index_component_1.default);
            component.addEventListener("entrar", () => this.email());
        }
        email() {
            const component = this.loadComponent("email-component", email_component_1.default);
            component.addEventListener("voltar", () => this.index());
            component.addEventListener("cadastro-responsavel", (ev) => {
                const email = ev.detail;
                this.cadastroResp(email);
            });
            component.addEventListener("login", (ev) => {
                const email = ev.detail;
                this.login(email);
            });
        }
        cadastroResp(email) {
            const component = this.loadComponent("cadastro-resp-component", cadastro_resp_component_1.default);
            component.addEventListener("voltar", () => this.email());
            component.addEventListener("avancar", () => this.respOrDep());
            component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: email })));
        }
        login(email) {
            const component = this.loadComponent("login-component", login_component_1.default);
            component.addEventListener("voltar", () => this.email());
            component.addEventListener("avancar", () => this.respOrDep());
            component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: email })));
        }
        respOrDep() {
            const tokenSubject = token_service_2.default.obterTokenSubject();
            if (tokenSubject?.perfil == "Resp")
                this.resp();
            else if (tokenSubject?.perfil == "Dep")
                this.index();
            else
                this.index();
        }
        resp() {
            const component = this.loadComponent("resp-component", resp_component_1.default, null, false, true);
            component.addEventListener("adicionarDep", () => this.cadastroDep());
            component.addEventListener("sair", () => this.index());
        }
        cadastroDep() {
            const component = this.loadComponent("cadastro-dep-component", cadastro_dep_component_1.default, "Adicionar Dependente", true, false);
            component.addEventListener("voltar", () => this.resp());
        }
    }
    const main = () => new App();
    exports.default = main;
});
//# sourceMappingURL=app.js.map