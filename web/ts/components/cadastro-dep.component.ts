import { headerVoltarClick } from "../models/const.model";
import { CadastroDepRequestModel } from "../models/request.model";
import ApiService from "../services/api.service";
import TokenService from "../services/token.service";
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

    public onAdicionar = (cadastroDep: CadastroDepRequestModel) => { };

    constructor() {
        super();

        this.adicionar.addEventListener("click", () => this.onAdicionar({
            nome: this.nome.value,
            email: this.email.value,
            senha: this.senha.value,
            mesada: Number(this.mesada.value)
        }));
    }

    public ApresentarErro(error: any){
        this.result.innerText = error.message ?? "Algo deu errado! (⊙_◎)";
        this.result.classList.remove("oculto");
    }
}

class CadastroDepService extends Service {
    
    private api: ApiService = new ApiService("dep");
    
    cadastrar(cadastroDep: CadastroDepRequestModel): Promise<void> {
        return this.api.doPut<void>(cadastroDep)
    }
    
}

export default class CadastroDepComponent extends Component<CadastroDepViewModel, CadastroDepService> {

    constructor() {
        super("cadastro-dep");
    }

    async initialize(): Promise<void> {
        
        if(!TokenService.VerificarToken("Resp"))
            return;

        await this.initializeResources(CadastroDepViewModel, CadastroDepService);

        this.addEventListener(headerVoltarClick, () =>
            this.dispatchEvent(new Event("voltar")));

        this.viewModel.onAdicionar = async (cadastroDep) => {
            try {
                await this.service.cadastrar(cadastroDep);
            } catch (error) {
                console.log("Erro onAdicionar:", error);
                this.viewModel.ApresentarErro(error);
            }
        };
    }
}