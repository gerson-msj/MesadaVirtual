import BaseComponent from "../base.component";
import BaseService from "../base.service";
import BaseViewModel from "../base.viewmodel";

class EMailViewModel extends BaseViewModel {

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

class EMailService extends BaseService {

    constructor() {
        super("usuario");
    }

    public async usuarioExistente(email: string): Promise<boolean> {
        const result = await this.api.doGet<{ usuarioExistente: boolean }>(new URLSearchParams({ email: email }));
        return result.usuarioExistente;
    }
}

export default class EMailComponent extends BaseComponent<EMailService, EMailViewModel> {

    constructor() {
        super("email");
    }

    initialize(): void {
        this.initializeService(EMailService);
        this.initializeViewModel(EMailViewModel);

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (email: string) =>
            await this.avancar(email);
    }

    async avancar(email: string): Promise<void> {
        const usuarioExistente = await this.service.usuarioExistente(email);
        this.dispatchEvent(new CustomEvent("avancar", { detail: { 
            email: email, 
            usuarioExistente: usuarioExistente } 
        }));
    }
}