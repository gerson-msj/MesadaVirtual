export default class HeaderComponent extends HTMLElement {
    
    private titulo: HTMLHeadElement | undefined;

    connectedCallback(){
        const template = document.querySelector(`#headerTemplate`) as HTMLTemplateElement;
        this.appendChild(template.content.cloneNode(true));
        this.titulo = document.querySelector("#titulo") as HTMLElement;
        this.titulo.textContent = "Mesada Virtual";
    }

}