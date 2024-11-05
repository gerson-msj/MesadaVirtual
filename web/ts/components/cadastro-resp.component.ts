import { CadastroRespRequestModel } from "../models/request.model";
import { TokenResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class CadastroRespViewmodel extends ViewModel {

    private nome: HTMLInputElement;
    private _email: HTMLInputElement;
    private senha: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;
    private result: HTMLElement;

    public get email() { return this._email.value; };
    public set email(value: string) { this._email.value = value; }

    public onVoltar = () => { };
    public onAvancar = (request: CadastroRespRequestModel) => { };

    constructor() {
        super();

        this.nome = this.getElement("nome");
        this._email = this.getElement("email");
        this.senha = this.getElement("senha");
        this.voltar = this.getElement("voltar");
        this.avancar = this.getElement("avancar");
        this.result = this.getElement("result");

        this.voltar.addEventListener("click", () => this.onVoltar());

        this.avancar.addEventListener("click", () => {
            this.onAvancar({
                nome: this.nome.value,
                email: this._email.value,
                senha: this.senha.value
            });
        });
    }

    ocultarResult() {
        if(!this.result.classList.contains("oculto"))
            this.result.classList.add("ocultar");
    }

    apresentarResult(message: string) {
        this.result.innerText = message;
        if(this.result.classList.contains("oculto"))
            this.result.classList.remove("oculto");
    }
}

class CadastroRespService extends Service {

    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    cadastrarResp(request: CadastroRespRequestModel): Promise<TokenResponseModel> {
        return this.apiUsuario.doPut<TokenResponseModel>(request);
    }
}

export default class CadastroRespComponent extends Component<CadastroRespViewmodel, CadastroRespService> {

    constructor() {
        super("cadastro-resp");

    }

    async initialize(): Promise<void> {
        await this.initializeResources(CadastroRespViewmodel, CadastroRespService);

        this.viewModel.ocultarResult();

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (request) => {
            try {
                var tokenResp = await this.service.cadastrarResp(request);
                if(tokenResp.token != null){
                    localStorage.setItem("token", tokenResp.token);
                    this.dispatchEvent(new Event("avancar"));
                } else {
                    throw new Error(tokenResp.message ?? "Algo deu errado! (⊙_◎)");
                }
            } catch (error) {
                console.error("cadastro-resp.component onAvancar ", error);
                this.viewModel.apresentarResult("Algo deu errado! (⊙_◎)");
            }
        }

        this.addEventListener("initializeData", (ev) => {
            const email: string = (ev as CustomEvent).detail;
            this.viewModel.email = email;
        });

        this.dispatchEvent(new Event("initialized"));
    };


}