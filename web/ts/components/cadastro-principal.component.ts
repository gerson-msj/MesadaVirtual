import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

interface CadastroPrincipalData {
    nome: string,
    email: string,
    senha: string
}

class CadastroPrincipalViewmodel extends ViewModel {

    private nome: HTMLInputElement;
    private email: HTMLInputElement;
    private senha: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;

    public onVoltar = () => { };
    public onAvancar = (data: CadastroPrincipalData) => { };

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

class CadastroPrincipalService extends Service {

    constructor() {
        super("usuario");
    }

    concluirCadastro(data: CadastroPrincipalData): Promise<{ token: string }> {
        return this.api.doPut<{ token: string }>(data);
    }
}

export default class CadastroPrincipalComponent extends Component<CadastroPrincipalService, CadastroPrincipalViewmodel> {

    constructor() {
        super("cadastro-principal");

    }

    initialize(): void {

        this.initializeService(CadastroPrincipalService);
        this.initializeViewModel(CadastroPrincipalViewmodel);

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (data) => {
            try {
                var result = await this.service.concluirCadastro(data);
                console.log("Avançar ok", result);
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