import BaseComponent from "../base.component";
import HeaderService from "./header.service";
import HeaderViewModel from "./header.viewmodel";

export default class HeaderComponent extends BaseComponent<HeaderService, HeaderViewModel> {
    
    constructor() {
        super("header");
    }

    initialize(): void {
        this.initializeService(HeaderService);
        this.initializeViewModel(HeaderViewModel);
    }
}