import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class EMailViewModel extends ViewModel {

    private email: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;

    public onVoltar = () => { };
    public onAvancar = (email: string) => { };

    constructor() {
        super();
        this.email = this.getElement("email");
        this.voltar = this.getElement("voltar");
        this.avancar = this.getElement("avancar");

        this.voltar.addEventListener("click", () => {
            this.email.value = "";
            this.onVoltar();
        });

        this.avancar.addEventListener("click", () => {
            this.onAvancar(this.email.value);
        });
    }

}

class EMailService extends Service {

    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    public async usuarioExistente(email: string): Promise<boolean> {
        const result = await this.apiUsuario.doGet<{ usuarioExistente: boolean }>(new URLSearchParams({ email: email }));
        return result.usuarioExistente;
    }
}

export default class EMailComponent extends Component<EMailViewModel, EMailService> {

    constructor() {
        super("email");
    }

    initialize(): Promise<void> {
        this.initializeResources(EMailViewModel, EMailService);
        
        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (email: string) =>
            await this.avancar(email);

        return Promise.resolve();
    }

    async avancar(email: string): Promise<void> {
        const usuarioExistente = await this.service.usuarioExistente(email);
        const event = usuarioExistente ? "login" : "cadastro-responsavel";
        this.dispatchEvent(new CustomEvent(event, { detail: email }));
    }
}