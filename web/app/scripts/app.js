var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
        }
        async initializeModel() {
            const requestModel = await fetch(this.modelPath);
            const model = await requestModel.text();
            const modelTemplate = document.createElement("div");
            modelTemplate.innerHTML = model;
            const template = modelTemplate.querySelector("template");
            this.appendChild(template.content.cloneNode(true));
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
define("components/header.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_1, service_1, viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_1 = __importDefault(component_1);
    service_1 = __importDefault(service_1);
    viewmodel_1 = __importDefault(viewmodel_1);
    class HeaderViewModel extends viewmodel_1.default {
        constructor() {
            super();
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
        /**
         *
         */
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
define("components/cadastro-responsavel.component", ["require", "exports", "services/api.service", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, api_service_2, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_2 = __importDefault(api_service_2);
    component_4 = __importDefault(component_4);
    service_4 = __importDefault(service_4);
    viewmodel_4 = __importDefault(viewmodel_4);
    class CadastroResponsavelViewmodel extends viewmodel_4.default {
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
    class CadastroResponsavelService extends service_4.default {
        apiUsuario;
        constructor() {
            super();
            this.apiUsuario = new api_service_2.default("usuario");
        }
        cadastrarResponsavel(request) {
            return this.apiUsuario.doPut(request);
        }
    }
    class CadastroResponsavelComponent extends component_4.default {
        constructor() {
            super("cadastro-responsavel");
        }
        async initialize() {
            await this.initializeResources(CadastroResponsavelViewmodel, CadastroResponsavelService);
            this.viewModel.ocultarResult();
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (request) => {
                try {
                    var tokenResp = await this.service.cadastrarResponsavel(request);
                    if (tokenResp.token != null) {
                        localStorage.setItem("token", tokenResp.token);
                        this.dispatchEvent(new Event("avancar"));
                    }
                    else {
                        throw new Error(tokenResp.message ?? "Algo deu errado! (⊙_◎)");
                    }
                }
                catch (error) {
                    console.error("cadastro-responsavel.component onAvancar ", error);
                    this.viewModel.apresentarResult("Algo deu errado! (⊙_◎)");
                }
            };
            this.addEventListener("initializeData", (ev) => {
                const email = ev.detail;
                this.viewModel.email = email;
            });
            this.dispatchEvent(new Event("initialized"));
        }
        ;
    }
    exports.default = CadastroResponsavelComponent;
});
define("components/home.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_5, service_5, viewmodel_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_5 = __importDefault(component_5);
    service_5 = __importDefault(service_5);
    viewmodel_5 = __importDefault(viewmodel_5);
    class HomeViewModel extends viewmodel_5.default {
        deps;
        depTemplate;
        constructor() {
            super();
            this.deps = this.getElement("deps");
            this.depTemplate = this.getElement("depTemplate");
        }
        apresentarDependentes(listaDependentes) {
            const template = this.depTemplate.innerHTML;
            this.deps.innerHTML = listaDependentes
                .map(dep => template
                .replace("{nome}", dep.nome)
                .replace("{acumulado}", dep.acumulado.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{pago}", dep.pago.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{saldo}", dep.saldo.toLocaleString('pt-br', { minimumFractionDigits: 2 })))
                .join("");
        }
    }
    class HomeService extends service_5.default {
        constructor() {
            super();
        }
        async ObterDependentes() {
            const listaDependentes = [];
            for (let index = 1; index <= 50; index++) {
                listaDependentes.push({ email: `dep${index}@email.com`, nome: `Dep ${index}`, acumulado: 50, pago: 10, saldo: 40 });
            }
            return Promise.resolve(listaDependentes);
        }
    }
    class HomeComponent extends component_5.default {
        constructor() {
            super("home");
        }
        async initialize() {
            await this.initializeResources(HomeViewModel, HomeService);
            await this.popularDependentes();
        }
        async popularDependentes() {
            const listaDependentes = await this.service.ObterDependentes();
            this.viewModel.apresentarDependentes(listaDependentes);
        }
    }
    exports.default = HomeComponent;
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
define("app", ["require", "exports", "components/header.component", "components/index.component", "components/email.component", "components/cadastro-responsavel.component", "components/home.component", "components/login.component"], function (require, exports, header_component_1, index_component_1, email_component_1, cadastro_responsavel_component_1, home_component_1, login_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    email_component_1 = __importDefault(email_component_1);
    cadastro_responsavel_component_1 = __importDefault(cadastro_responsavel_component_1);
    home_component_1 = __importDefault(home_component_1);
    login_component_1 = __importDefault(login_component_1);
    const mainElement = document.querySelector("main");
    const loadedComponents = [];
    let currentComponent = null;
    function main() {
        customElements.define("header-component", header_component_1.default);
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
        const component = loadComponent("email-component", email_component_1.default);
        component.addEventListener("voltar", () => loadIndex());
        component.addEventListener("cadastro-responsavel", (ev) => {
            const email = ev.detail;
            loadCadastroResponsavel(email);
        });
        component.addEventListener("login", (ev) => {
            const email = ev.detail;
            loadLogin(email);
        });
    }
    function loadIndex() {
        const component = loadComponent("index-component", index_component_1.default);
        component.addEventListener("entrar", () => loadEMail());
    }
    function loadCadastroResponsavel(email) {
        const component = loadComponent("cadastro-responsavel-component", cadastro_responsavel_component_1.default);
        component.addEventListener("voltar", () => loadEMail());
        component.addEventListener("avancar", () => LoadHome());
        component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: email })));
    }
    function loadLogin(email) {
        const component = loadComponent("login-component", login_component_1.default);
        component.addEventListener("voltar", () => loadEMail());
        component.addEventListener("avancar", () => LoadHome());
        component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: email })));
    }
    function LoadHome() {
        const component = loadComponent("home-component", home_component_1.default);
    }
    function loadComponent(name, constructor) {
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
});
//# sourceMappingURL=app.js.map