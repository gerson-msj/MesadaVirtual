import BaseService from "./base.service";
import BaseViewModel from "./base.viewmodel";

export default abstract class BaseComponent<TService extends BaseService, TViewModel extends BaseViewModel> extends HTMLElement {

    //private shadow = this.attachShadow({ mode: "closed" });

    

    private _service: TService | null = null;
    protected get service() { return this._service! }

    private _viewModel: TViewModel | null = null;
    protected get viewModel() { return this._viewModel!; }
    
    private componentName: string;
    // private modelPath: string;
    // private styles: string[];

    abstract initialize(): void;

    constructor(componentName: string) {
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

    private async initializeElement() {
        this.initializeTemplate();
        // await Promise.all([
        //     this.initializeStyle(),
        //     this.initializeModel()
        // ]);

        this.initialize();
    }

    private initializeTemplate() {
        const template = document.querySelector(`#${this.componentName}Template`) as HTMLTemplateElement;
        this.appendChild(template.content.cloneNode(true));
    }

    private async initializeModel() {
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

    protected initializeService(service: new() => TService) {
        this._service = new service();
    }

    // protected initializeViewModel(viewModel: new(shadow: ShadowRoot) => TViewModel) {
    //     this._viewModel = new viewModel(this.shadow);
    // }
    protected initializeViewModel(viewModel: new() => TViewModel) {
        this._viewModel = new viewModel();
    }
}