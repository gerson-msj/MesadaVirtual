import BaseComponent from "../base.component";
import EMailService from "./email.service";
import EMailViewModel from "./email.viewmodel";

export default class EMailComponent extends BaseComponent<EMailService, EMailViewModel> {
    
    constructor() {
        super("email");
    }

    initialize(): void {
        this.initializeService(EMailService);
        this.initializeViewModel(EMailViewModel);

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));
    }
}