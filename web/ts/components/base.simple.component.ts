export default abstract class BaseSimpleComponent extends HTMLElement {

    private modelPath: string;

    abstract initialize(): void;

    constructor(modelName: string) {
        super();
        this.modelPath = `/models/${modelName}.model.html`;
    }

    async connectedCallback() {
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

    protected getElement<T>(name: string): T {
        return document.querySelector(`#${name}`) as T;
    }
}