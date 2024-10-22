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
    }
    exports.default = BaseComponent;
});
define("components/header/header.service", ["require", "exports", "components/base.service"], function (require, exports, base_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_service_1 = __importDefault(base_service_1);
    class HeaderService extends base_service_1.default {
        constructor() {
            super("header");
        }
    }
    exports.default = HeaderService;
});
define("components/header/header.viewmodel", ["require", "exports", "components/base.viewmodel"], function (require, exports, base_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_viewmodel_1 = __importDefault(base_viewmodel_1);
    class HeaderViewModel extends base_viewmodel_1.default {
        constructor() {
            super();
        }
    }
    exports.default = HeaderViewModel;
});
define("components/header/header.component", ["require", "exports", "components/base.component", "components/header/header.service", "components/header/header.viewmodel"], function (require, exports, base_component_1, header_service_1, header_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_component_1 = __importDefault(base_component_1);
    header_service_1 = __importDefault(header_service_1);
    header_viewmodel_1 = __importDefault(header_viewmodel_1);
    class HeaderComponent extends base_component_1.default {
        constructor() {
            super("header");
        }
        initialize() {
            this.initializeService(header_service_1.default);
            this.initializeViewModel(header_viewmodel_1.default);
        }
    }
    exports.default = HeaderComponent;
});
define("components/home/home.component", ["require", "exports", "components/base.component", "components/base.service", "components/base.viewmodel"], function (require, exports, base_component_2, base_service_2, base_viewmodel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_component_2 = __importDefault(base_component_2);
    base_service_2 = __importDefault(base_service_2);
    base_viewmodel_2 = __importDefault(base_viewmodel_2);
    class HomeViewModel extends base_viewmodel_2.default {
        constructor() {
            super();
        }
    }
    class HomeService extends base_service_2.default {
        constructor() {
            super("home");
        }
    }
    class HomeComponent extends base_component_2.default {
        constructor() {
            super("home");
        }
        initialize() {
            this.initializeViewModel(HomeViewModel);
            this.initializeService(HomeService);
        }
    }
    exports.default = HomeComponent;
});
define("components/email/email.service", ["require", "exports", "components/base.service"], function (require, exports, base_service_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_service_3 = __importDefault(base_service_3);
    class EMailService extends base_service_3.default {
        constructor() {
            super("email");
        }
    }
    exports.default = EMailService;
});
define("components/email/email.viewmodel", ["require", "exports", "components/base.viewmodel"], function (require, exports, base_viewmodel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_viewmodel_3 = __importDefault(base_viewmodel_3);
    class EMailViewModel extends base_viewmodel_3.default {
        email;
        constructor() {
            super();
            this.email = this.getElement("email");
        }
    }
    exports.default = EMailViewModel;
});
define("components/email/email.component", ["require", "exports", "components/base.component", "components/email/email.service", "components/email/email.viewmodel"], function (require, exports, base_component_3, email_service_1, email_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_component_3 = __importDefault(base_component_3);
    email_service_1 = __importDefault(email_service_1);
    email_viewmodel_1 = __importDefault(email_viewmodel_1);
    class EMailComponent extends base_component_3.default {
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
define("app", ["require", "exports", "components/header/header.component", "components/home/home.component", "components/email/email.component"], function (require, exports, header_component_1, home_component_1, email_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
    header_component_1 = __importDefault(header_component_1);
    home_component_1 = __importDefault(home_component_1);
    email_component_1 = __importDefault(email_component_1);
    const mainElement = document.querySelector("main");
    const loadedComponents = [];
    let currentComponent = null;
    function main() {
        customElements.define("header-component", header_component_1.default);
        nav();
    }
    function nav() {
        loadHome();
    }
    function loadEMail() {
        const component = loadComponent("email-component", "/", email_component_1.default);
    }
    function loadHome() {
        const component = loadComponent("home-component", "/", home_component_1.default);
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