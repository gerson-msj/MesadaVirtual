import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IndexViewModel extends ViewModel {

    private entrar: HTMLButtonElement;

    public onEntrar = () => {};

    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
    }
}

class IndexService extends Service {
    constructor() {
        super("index");
    }
}


class IndexComponent extends Component<IndexService, IndexViewModel> {

    constructor() {
        super("index");
    }

    initialize(): void {
        this.initializeViewModel(IndexViewModel);
        this.initializeService(IndexService);
        this.viewModel.onEntrar = () => 
            this.dispatchEvent(new Event("entrar"));
    }

}

export default IndexComponent;