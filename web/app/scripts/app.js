var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
define("components/base/service", ["require", "exports", "services/api.service"], function (require, exports, api_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_1 = __importDefault(api_service_1);
    class Service {
        api;
        constructor(baseUrl) {
            this.api = new api_service_1.default(baseUrl);
        }
    }
    exports.default = Service;
});
define("components/base/viewmodel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ViewModel {
        // private shadow: ShadowRoot;
        constructor() { }
        // constructor(shadow: ShadowRoot) {
        //     this.shadow = shadow;
        // }
        // protected getElement<T>(name: string): T {
        //     return this.shadow.querySelector(`#${name}`) as T;
        // }
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
            this.initialize();
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
        initializeService(service) {
            this._service = new service();
        }
        // protected initializeViewModel(viewModel: new(shadow: ShadowRoot) => TViewModel) {
        //     this._viewModel = new viewModel(this.shadow);
        // }
        initializeViewModel(viewModel) {
            this._viewModel = new viewModel();
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
            super("header");
        }
    }
    class HeaderComponent extends component_1.default {
        constructor() {
            super("header");
        }
        initialize() {
            this.initializeService(HeaderService);
            this.initializeViewModel(HeaderViewModel);
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
        constructor() {
            super("index");
        }
    }
    class IndexComponent extends component_2.default {
        constructor() {
            super("index");
        }
        initialize() {
            this.initializeViewModel(IndexViewModel);
            this.initializeService(IndexService);
            this.viewModel.onEntrar = () => this.dispatchEvent(new Event("entrar"));
        }
    }
    exports.default = IndexComponent;
});
define("components/email.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_3, service_3, viewmodel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        constructor() {
            super("usuario");
        }
        async usuarioExistente(email) {
            const result = await this.api.doGet(new URLSearchParams({ email: email }));
            return result.usuarioExistente;
        }
    }
    class EMailComponent extends component_3.default {
        constructor() {
            super("email");
        }
        initialize() {
            this.initializeService(EMailService);
            this.initializeViewModel(EMailViewModel);
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (email) => await this.avancar(email);
        }
        async avancar(email) {
            const usuarioExistente = await this.service.usuarioExistente(email);
            this.dispatchEvent(new CustomEvent("avancar", { detail: {
                    email: email,
                    usuarioExistente: usuarioExistente
                }
            }));
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
define("components/cadastro-responsavel.component", ["require", "exports", "components/base/component", "components/base/service", "components/base/viewmodel"], function (require, exports, component_4, service_4, viewmodel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    component_4 = __importDefault(component_4);
    service_4 = __importDefault(service_4);
    viewmodel_4 = __importDefault(viewmodel_4);
    class CadastroResponsavelViewmodel extends viewmodel_4.default {
        nome;
        email;
        senha;
        voltar;
        avancar;
        onVoltar = () => { };
        onAvancar = (request) => { };
        constructor() {
            super();
            this.nome = this.getElement("nome");
            this.email = this.getElement("email");
            this.senha = this.getElement("senha");
            this.voltar = this.getElement("voltar");
            this.avancar = this.getElement("avancar");
            this.voltar.addEventListener("click", () => this.onVoltar());
            this.avancar.addEventListener("click", () => {
                this.onAvancar({
                    nome: this.nome.value,
                    email: this.email.value,
                    senha: this.senha.value
                });
            });
        }
        setEmail(email) {
            this.email.value = email;
        }
    }
    class CadastroResponsavelService extends service_4.default {
        constructor() {
            super("usuario");
        }
        cadastrarResponsavel(request) {
            return this.api.doPut(request);
        }
    }
    class CadastroResponsavelComponent extends component_4.default {
        constructor() {
            super("cadastro-responsavel");
        }
        initialize() {
            this.initializeService(CadastroResponsavelService);
            this.initializeViewModel(CadastroResponsavelViewmodel);
            this.viewModel.onVoltar = () => this.dispatchEvent(new Event("voltar"));
            this.viewModel.onAvancar = async (request) => {
                try {
                    var result = await this.service.cadastrarResponsavel(request);
                    console.log("Cadastrar Responsavel result:", result);
                    // Obter o token, armazenar e avançar.
                }
                catch (error) {
                    console.log("Erro ao avançar", error);
                    // apresentar o erro.
                }
            };
            this.addEventListener("initializeData", (ev) => {
                const data = ev.detail;
                this.viewModel.setEmail(data.email);
            });
            this.dispatchEvent(new Event("initialized"));
        }
        ;
    }
    exports.default = CadastroResponsavelComponent;
});
define("app", ["require", "exports", "components/header.component", "components/index.component", "components/email.component", "components/cadastro-responsavel.component"], function (require, exports, header_component_1, index_component_1, email_component_1, cadastro_responsavel_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
    header_component_1 = __importDefault(header_component_1);
    index_component_1 = __importDefault(index_component_1);
    email_component_1 = __importDefault(email_component_1);
    cadastro_responsavel_component_1 = __importDefault(cadastro_responsavel_component_1);
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
                loadEMail();
                break;
            default:
                loadIndex();
                break;
        }
    }
    function loadEMail() {
        const component = loadComponent("email-component", email_component_1.default);
        component.addEventListener("voltar", () => loadIndex());
        component.addEventListener("avancar", (ev) => {
            const data = ev.detail;
            if (data.usuarioExistente)
                console.log(data.email, data.usuarioExistente);
            else
                loadCadastroResponsavel(data.email);
        });
    }
    function loadIndex() {
        const component = loadComponent("index-component", index_component_1.default);
        component.addEventListener("entrar", () => loadEMail());
    }
    function loadCadastroResponsavel(email) {
        const component = loadComponent("cadastro-responsavel-component", cadastro_responsavel_component_1.default);
        component.addEventListener("voltar", () => loadEMail());
        component.addEventListener("avancar", (ev) => {
            const data = ev.detail;
            console.log(data);
        });
        component.addEventListener("initialized", () => component.dispatchEvent(new CustomEvent("initializeData", { detail: { email: email } })));
    }
    function loadComponent(name, constructor) {
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
});
//# sourceMappingURL=app.js.map