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
    
}


class IndexComponent extends Component<IndexViewModel, IndexService> {

    constructor() {
        super("index");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IndexViewModel, IndexService);
        this.viewModel.onEntrar = () => 
            this.dispatchEvent(new Event("entrar"));
    }

}

export default IndexComponent;