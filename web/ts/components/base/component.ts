import Service from "./service";
import ViewModel from "./viewmodel";

export default abstract class Component<TService extends Service, TViewModel extends ViewModel> extends HTMLElement {

    private _service: TService | null = null;
    protected get service() { return this._service! }

    private _viewModel: TViewModel | null = null;
    protected get viewModel() { return this._viewModel!; }
    
    private modelPath: string;

    abstract initialize(): void;

    constructor(modelName: string) {
        super();
        this.modelPath = `/models/${modelName}.model.html`;
    }

    async connectedCallback() {
        await this.initializeElement();
    }

    private async initializeElement() {
        await this.initializeModel();
        this.initialize();
    }

    private async initializeModel() {
        const requestModel = await fetch(this.modelPath);
        const model = await requestModel.text();
        const modelTemplate = document.createElement("div");
        modelTemplate.innerHTML = model;
        const template = modelTemplate.querySelector("template") as HTMLTemplateElement;
        this.appendChild(template.content.cloneNode(true));
    }

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

    protected dispatch(event: () => void, eventName: string){
        event = () => this.dispatchEvent(new Event(eventName));
    }
}