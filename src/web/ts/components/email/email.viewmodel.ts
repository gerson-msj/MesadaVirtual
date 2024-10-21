import BaseViewModel from "../base.viewmodel";

export default class EMailViewModel extends BaseViewModel {

    private email: HTMLInputElement;

    constructor() {
        super();
        this.email = this.getElement("email");
    }
    
}