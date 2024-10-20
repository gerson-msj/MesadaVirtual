import BaseViewModel from "../base.viewmodel";

export default class EMailViewModel extends BaseViewModel {

    // constructor(shadow: ShadowRoot) {
    //     super(shadow);
    // }

    private email: HTMLInputElement;

    constructor() {
        super();
        this.email = this.getElement("email");
    }
    
}