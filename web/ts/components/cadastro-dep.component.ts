import { headerVoltarClick } from "../models/const.model";
import { CadastroDepModel } from "../models/request.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class CadastroDepViewModel extends ViewModel {
    private nome: HTMLInputElement = this.getElement("nome");
    private email: HTMLInputElement = this.getElement("email");
    private senha: HTMLInputElement = this.getElement("senha");
    private mesada: HTMLInputElement = this.getElement("mesada");

    private adicionar: HTMLButtonElement = this.getElement("adicionar");
    private result: HTMLElement = this.getElement("result");

    public onAdicionar = (cadastroDep: CadastroDepModel) => { };

    constructor() {
        super();

        this.adicionar.addEventListener("click", () => this.onAdicionar({
            nome: this.nome.value,
            email: this.email.value,
            senha: this.senha.value,
            mesada: Number(this.mesada.value)
        }));
    }
}

class CadastroDepService extends Service {
    
    private apiDep: ApiService = new ApiService("dep");
    
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