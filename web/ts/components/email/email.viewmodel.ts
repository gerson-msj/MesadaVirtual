import BaseViewModel from "../base.viewmodel";

export default class EMailViewModel extends BaseViewModel {

    private email: HTMLInputElement;
    private voltar: HTMLButtonElement;

    public onVoltar = () => {};

    constructor() {
        super();
        this.email = this.getElement("email");
        this.voltar = this.getElement("voltar");
        this.voltar.addEventListener("click", () => {
            this.email.value = "";
            this.onVoltar();
        });
    }
    
}