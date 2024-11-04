import { tokenLSKey } from "../models/const.model";
import { LoginRequestModel } from "../models/request.model";
import { TokenResponseModel } from "../models/response.model";
import ApiService from "../services/api.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class LoginViewModel extends ViewModel {

    private _email: HTMLInputElement;
    private senha: HTMLInputElement;
    private voltar: HTMLButtonElement;
    private avancar: HTMLButtonElement;
    private result: HTMLElement;

    public get email() { return this._email.value; };
    public set email(value: string) { this._email.value = value; }

    public onVoltar = () => { };
    public onAvancar = (request: LoginRequestModel) => { };

    constructor() {
        super();

        this._email = this.getElement("email");
        this.senha = this.getElement("senha");
        this.voltar = this.getElement("voltar");
        this.avancar = this.getElement("avancar");
        this.result = this.getElement("result");

        this.voltar.addEventListener("click", () => this.onVoltar());

        this.avancar.addEventListener("click", () => {
            this.onAvancar({
                email: this.email,
                senha: this.senha.value
            });
        });
    }

    ocultarResult() {
        if (!this.result.classList.contains("oculto"))
            this.result.classList.add("ocultar");
    }

    apresentarResult(message: string) {
        this.result.innerText = message;
        if (this.result.classList.contains("oculto"))
            this.result.classList.remove("oculto");
    }
}

class LoginService extends Service {

    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    login(request: LoginRequestModel): Promise<TokenResponseModel> {
        return this.apiUsuario.doPost<TokenResponseModel>(request);
    }
}

class LoginComponent extends Component<LoginViewModel, LoginService> {

    constructor() {
        super("login");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(LoginViewModel, LoginService);

        this.viewModel.ocultarResult();

        this.viewModel.onVoltar = () =>
            this.dispatchEvent(new Event("voltar"));

        this.viewModel.onAvancar = async (request) =>
            await this.login(request);

        this.addEventListener("initializeData", (ev) => {
            const email: string = (ev as CustomEvent).detail;
            this.viewModel.email = email;
        });

        this.dispatchEvent(new Event("initialized"));
    }

    private async login(request: LoginRequestModel): Promise<void> {
        try {
            var tokenResp = await this.service.login(request);
            if (tokenResp.token != null) {
                localStorage.setItem("token", tokenResp.token);
                this.dispatchEvent(new Event("avancar"));
            } else {
                throw new Error(tokenResp.message ?? "Algo deu errado! (⊙_◎)");
            }
        } catch (error) {
            console.error("login.component onAvancar ", error);
            this.viewModel.apresentarResult("Algo deu errado! (⊙_◎)");
        }
    }

}

export default LoginComponent;