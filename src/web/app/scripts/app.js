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
        shadow;
        constructor(shadow) {
            this.shadow = shadow;
        }
        getElement(name) {
            return this.shadow.querySelector(`#${name}`);
        }
    }
    exports.default = BaseViewModel;
});
define("components/base.component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseComponent extends HTMLElement {
        shadow = this.attachShadow({ mode: "closed" });
        _service = null;
        get service() { return this._service; }
        _viewModel = null;
        get viewModel() { return this._viewModel; }
        modelPath;
        styles;
        constructor(componentName) {
            super();
            this.modelPath = `/components/${componentName}/${componentName}.model.html`;
            this.styles = [
                "/styles/dark.css",
                "/styles/form.css",
                "/styles/main.css",
                `/components/${componentName}/${componentName}.style.css`
            ];
        }
        async connectedCallback() {
            await this.initializeElement();
        }
        async initializeElement() {
            await Promise.all([
                this.initializeStyle(),
                this.initializeModel()
            ]);
            this.initialize();
        }
        async initializeModel() {
            const requestModel = await fetch(this.modelPath);
            const model = await requestModel.text();
            const modelTemplate = document.createElement("div");
            modelTemplate.innerHTML = model;
            const template = modelTemplate.querySelector("template");
            this.shadow.appendChild(template.content.cloneNode(true));
        }
        async initializeStyle() {
            const requestsStyle = this.styles.map(s => fetch(s));
            const resultsStyle = await Promise.all(requestsStyle);
            const requestsText = resultsStyle.map(r => r.text());
            const resultsText = await Promise.all(requestsText);
            const requestsSheet = resultsText.map(t => (new CSSStyleSheet()).replace(t));
            const resultsSheet = await Promise.all(requestsSheet);
            this.shadow.adoptedStyleSheets = resultsSheet;
        }
        getElement(name) {
            return this.shadow.querySelector(`#${name}`);
        }
        initializeService(service) {
            this._service = new service();
        }
        initializeViewModel(viewModel) {
            this._viewModel = new viewModel(this.shadow);
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
        constructor(shadow) {
            super(shadow);
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
        }
    }
    exports.default = EMailComponent;
});
define("app", ["require", "exports", "components/email/email.component"], function (require, exports, email_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
    email_component_1 = __importDefault(email_component_1);
    const mainElement = document.querySelector("main");
    const loadedComponents = [];
    let currentComponent = null;
    function main() {
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