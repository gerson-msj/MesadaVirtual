import { headerVoltarClick } from "../models/const.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class CadastroDepViewModel extends ViewModel {
    constructor() {
        super();
    }
}

class CadastroDepService extends Service {
    constructor() {
        super();
    }
}

export default class CadastroDepComponent extends Component<CadastroDepViewModel, CadastroDepService> {

    constructor() {
        super("cadastro-dep");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(CadastroDepViewModel, CadastroDepService);

        this.addEventListener(headerVoltarClick, () => 
            this.dispatchEvent(new Event("voltar")));
    }
}