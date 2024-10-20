var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("components/header/header.component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HeaderComponent extends HTMLElement {
        titulo;
        connectedCallback() {
            const template = document.querySelector(`#headerTemplate`);
            this.appendChild(template.content.cloneNode(true));
            this.titulo = document.querySelector("#titulo");
            this.titulo.textContent = "Mesada Virtual";
        }
    }
    exports.default = HeaderComponent;
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
        getHeaders(bearer) {
            const headers = { "content-type": "application/json; charset=utf-8" };
            if (bearer !== null)
                headers["authorization"] = `Bearer ${bearer}`;
            return headers;
        }
    }
    exports.default = ApiService;
});
define("components/base.service", ["require", "exports", "services/api.service"], function (require, exports, api_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    api_service_1 = __importDefault(api_service_1);
    class BaseService {
        api;
        constructor(baseUrl) {
            this.api = new api_service_1.default(baseUrl);
        }
    }
    exports.default = BaseService;
});
define("components/base.viewmodel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseViewModel {
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
    exports.default = BaseViewModel;
});
define("components/base.component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseComponent extends HTMLElement {
        //private shadow = this.attachShadow({ mode: "closed" });
        _service = null;
        get service() { return this._service; }
        _viewModel = null;
        get viewModel() { return this._viewModel; }
        componentName;
        constructor(componentName) {
            super();
            // this.modelPath = `/components/${componentName}/${componentName}.model.html`;
            // this.styles = [
            //     "/styles/dark.css",
            //     "/styles/form.css",
            //     "/styles/main.css",
            //     `/components/${componentName}/${componentName}.style.css`
            // ];
            this.componentName = componentName;
        }
        async connectedCallback() {
            await this.initializeElement();
        }
        async initializeElement() {
            this.initializeTemplate();
            // await Promise.all([
            //     this.initializeStyle(),
            //     this.initializeModel()
            // ]);
            this.initialize();
        }
        initializeTemplate() {
            const template = document.querySelector(`#${this.componentName}Template`);
            this.appendChild(template.content.cloneNode(true));
        }
        async initializeModel() {
            // const requestModel = await fetch(this.modelPath);
            // const model = await requestModel.text();
            // const modelTemplate = document.createElement("div");
            // modelTemplate.innerHTML = model;
            // const template = modelTemplate.querySelector("template") as HTMLTemplateElement;
            //this.shadow.appendChild(template.content.cloneNode(true));
        }
        // private async initializeStyle() {
        //     const requestsStyle = this.styles.map(s => fetch(s));
        //     const resultsStyle = await Promise.all(requestsStyle);
        //     const requestsText = resultsStyle.map(r => r.text());
        //     const resultsText = await Promise.all(requestsText);
        //     const requestsSheet = resultsText.map(t => (new CSSStyleSheet()).replace(t));
        //     const resultsSheet = await Promise.all(requestsSheet);
        //     //this.shadow.adoptedStyleSheets = resultsSheet;
        // }
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
    }
    exports.default = BaseComponent;
});
define("components/email/email.service", ["require", "exports", "components/base.service"], function (require, exports, base_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_service_1 = __importDefault(base_service_1);
    class EMailService extends base_service_1.default {
        constructor() {
            super("email");
        }
    }
    exports.default = EMailService;
});
define("components/email/email.viewmodel", ["require", "exports", "components/base.viewmodel"], function (require, exports, base_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_viewmodel_1 = __importDefault(base_viewmodel_1);
    class EMailViewModel extends base_viewmodel_1.default {
        // constructor(shadow: ShadowRoot) {
        //     super(shadow);
        // }
        email;
        constructor() {
            super();
            this.email = this.getElement("email");
        }
    }
    exports.default = EMailViewModel;
});
define("components/email/email.component", ["require", "exports", "components/base.component", "components/email/email.service", "components/email/email.viewmodel"], function (require, exports, base_component_1, email_service_1, email_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_component_1 = __importDefault(base_component_1);
    email_service_1 = __importDefault(email_service_1);
    email_viewmodel_1 = __importDefault(email_viewmodel_1);
    class EMailComponent extends base_component_1.default {
        constructor() {
            super("email");
        }
        initialize() {
            this.initializeService(email_service_1.default);
            this.initializeViewModel(email_viewmodel_1.default);
            const titulo = document.querySelector("#titulo");
            console.log(titulo.textContent);
        }
    }
    exports.default = EMailComponent;
});
define("app", ["require", "exports", "components/header/header.component", "components/email/email.component"], function (require, exports, header_component_1, email_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
    header_component_1 = __importDefault(header_component_1);
    email_component_1 = __importDefault(email_component_1);
    const mainElement = document.querySelector("main");
    const loadedComponents = [];
    let currentComponent = null;
    function main() {
        customElements.define("header-component", header_component_1.default);
        nav();
    }
    function nav() {
        loadEMail();
    }
    function loadEMail() {
        const component = loadComponent("email-component", "/", email_component_1.default);
    }
    function loadComponent(name, url, constructor) {
        if (!loadedComponents.includes(name)) {
            customElements.define(name, constructor);
            loadedComponents.push(name);
        }
        currentComponent?.remove();
        currentComponent = document.createElement(name);
        mainElement.appendChild(currentComponent);
        return currentComponent;
    }
});
//# sourceMappingURL=app.js.map