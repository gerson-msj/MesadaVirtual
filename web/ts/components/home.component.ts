import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HomeViewModel extends ViewModel {

    private entrar: HTMLButtonElement;

    public onEntrar = () => {};

    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
    }
}

class HomeService extends Service {
    constructor() {
        super("home");
    }
}


class HomeComponent extends Component<HomeService, HomeViewModel> {

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