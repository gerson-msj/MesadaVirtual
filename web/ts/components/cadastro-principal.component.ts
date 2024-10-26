import BaseComponent from "./base.component";
import BaseService from "./base.service";
import BaseViewModel from "./base.viewmodel";

class CadastroPrincipalViewmodel extends BaseViewModel {

    private nome: HTMLInputElement;
    private email: HTMLInputElement;
    private senha: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;

    public onVoltar = () => { };
    public onAvancar = (data: {
        nome: string,
        email: string,
        senha: string
    }) => { };

    constructor() {
        super();

        this.nome = this.getElement("nome");
        this.email = this.getElement("email");
        this.senha = this.getElement("senha");
        this.voltar = this.getElement("voltar");
        this.avancar = this.getElement("avancar");

        this.voltar.addEventListener("click", () => this.onVoltar());

        this.avancar.addEventListener("click", () => {
            const data = {
                nome: this.nome.value,
                email: this.email.value,
                senha: this.senha.value
            };

            this.onAvancar(data);
        });
    }

    public setEmail(email: string) {
        this.email.value = email;
    }
}

class CadastroPrincipalService extends BaseService {

    constructor() {
        super("usuario");

    }
}

export default class CadastroPrincipalComponent extends BaseComponent<CadastroPrincipalService, CadastroPrincipalViewmodel> {

    constructor() {
        super("cadastro-principal");

    }

    initialize(): void {

        this.initializeService(CadastroPrincipalService);
        this.initializeViewModel(CadastroPrincipalViewmodel);

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = (data) =>
            this.dispatchEvent(new CustomEvent("avancar", { detail: { data: data } }));

        this.addEventListener("initializeData", (ev) => {
            const data: {email: string} = (ev as CustomEvent).detail;
            this.viewModel.setEmail(data.email);
        });

        this.dispatchEvent(new Event("initialized"));
    };
}