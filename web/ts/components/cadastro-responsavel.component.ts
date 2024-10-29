import { CadastroResponsavelRequestModel } from "../models/request.model";
import { TokenResponseModel } from "../models/response.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class CadastroResponsavelViewmodel extends ViewModel {

    private nome: HTMLInputElement;
    private email: HTMLInputElement;
    private senha: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;

    public onVoltar = () => { };
    public onAvancar = (request: CadastroResponsavelRequestModel) => { };

    constructor() {
        super();

        this.nome = this.getElement("nome");
        this.email = this.getElement("email");
        this.senha = this.getElement("senha");
        this.voltar = this.getElement("voltar");
        this.avancar = this.getElement("avancar");

        this.voltar.addEventListener("click", () => this.onVoltar());

        this.avancar.addEventListener("click", () => {
            this.onAvancar({
                nome: this.nome.value,
                email: this.email.value,
                senha: this.senha.value
            });
        });
    }

    public setEmail(email: string) {
        this.email.value = email;
    }
}

class CadastroResponsavelService extends Service {

    constructor() {
        super("usuario");
    }

    cadastrarResponsavel(request: CadastroResponsavelRequestModel): Promise<TokenResponseModel> {
        return this.api.doPut<TokenResponseModel>(request);
    }
}

export default class CadastroResponsavelComponent extends Component<CadastroResponsavelService, CadastroResponsavelViewmodel> {

    constructor() {
        super("cadastro-responsavel");

    }

    initialize(): void {

        this.initializeService(CadastroResponsavelService);
        this.initializeViewModel(CadastroResponsavelViewmodel);

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (request) => {
            try {
                var result = await this.service.cadastrarResponsavel(request);
                console.log("Cadastrar Responsavel result:", result);
                // Obter o token, armazenar e avançar.
            } catch (error) {
                console.log("Erro ao avançar", error);
                // apresentar o erro.
            }
        }

        this.addEventListener("initializeData", (ev) => {
            const data: { email: string } = (ev as CustomEvent).detail;
            this.viewModel.setEmail(data.email);
        });

        this.dispatchEvent(new Event("initialized"));
    };


}