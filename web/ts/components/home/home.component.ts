import BaseComponent from "../base.component";
import BaseService from "../base.service";
import BaseViewModel from "../base.viewmodel";

class HomeViewModel extends BaseViewModel {

    private entrar: HTMLButtonElement;

    public onEntrar = () => {};

    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
    }
}

class HomeService extends BaseService {
    constructor() {
        super("home");
    }
}


class HomeComponent extends BaseComponent<HomeService, HomeViewModel> {

    constructor() {
        super("home");
    }

    initialize(): void {
        this.initializeViewModel(HomeViewModel);
        this.initializeService(HomeService);
        this.viewModel.onEntrar = () => 
            this.dispatchEvent(new Event("entrar"));
    }

}

export default HomeComponent;