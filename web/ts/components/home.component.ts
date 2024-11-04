import { headerMenuClick, headerMenuVisible, Perfil, tokenLSKey } from "../models/const.model";
import { CardResponseModel } from "../models/response.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HomeViewModel extends ViewModel {

    private cards: HTMLDivElement;
    private cardTemplate: HTMLTemplateElement;
    private headerMenuResp: HTMLDivElement;
    private headerMenuDep: HTMLDivElement;
    private headerMenuBackdrop: HTMLDivElement;

    public onHeaderMenuBackdropClick = () => { };

    constructor() {
        super();
        this.cards = this.getElement("cards");
        this.cardTemplate = this.getElement("cardTemplate");
        this.headerMenuResp = this.getElement("headerMenuResp");
        this.headerMenuDep = this.getElement("headerMenuDep");
        this.headerMenuBackdrop = this.getElement("headerMenuBackdrop");

        this.headerMenuBackdrop.addEventListener("click", () =>
            this.onHeaderMenuBackdropClick());
    }

    exibirHeaderMenu(perfil: Perfil) {
        if (perfil == "Resp")
            this.headerMenuResp.classList.remove("oculto");
        else
            this.headerMenuDep.classList.remove("oculto");

        this.headerMenuBackdrop.classList.remove("oculto");
    }

    ocutarHeaderMenu(perfil: Perfil) {
        if (perfil == "Resp")
            this.headerMenuResp.classList.add("oculto");
        else
            this.headerMenuDep.classList.add("oculto");

        this.headerMenuBackdrop.classList.add("oculto");
    }

    apresentarDependentes(cards: CardResponseModel[]) {

        const card = this.cardTemplate.innerHTML;
        this.cards.innerHTML = cards
            .map(dep => card
                .replace("{nome}", dep.nome)
                .replace("{acumulado}", dep.acumulado.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{pago}", dep.pago.toLocaleString('pt-br', { minimumFractionDigits: 2 }))
                .replace("{saldo}", dep.saldo.toLocaleString('pt-br', { minimumFractionDigits: 2 })))
            .join("");
    }
}

class HomeService extends Service {

    constructor() {
        super();
    }

    async ObterDependentes(): Promise<CardResponseModel[]> {
        const listaDependentes: CardResponseModel[] = [];
        for (let index = 1; index <= 3; index++) {
            listaDependentes.push({ email: `dep${index}@email.com`, nome: `Dep ${index}`, acumulado: 50, pago: 10, saldo: 40 });
        }
        return Promise.resolve(listaDependentes);
    }
}

export default class HomeComponent extends Component<HomeViewModel, HomeService> {



    constructor() {
        super("home");

    }

    async initialize(): Promise<void> {
        await this.initializeResources(HomeViewModel, HomeService);

        if (!this.validarTokenSubject() || this.tokenSubject == null) {
            this.dispatchEvent(new Event("sair"));
            return;
        }

        await this.popularDependentes();

        document.dispatchEvent(new CustomEvent(headerMenuVisible, { detail: true }));

        this.viewModel.exibirHeaderMenu(this.tokenSubject!.perfil);

        document.addEventListener(headerMenuClick, () =>
            this.viewModel.exibirHeaderMenu(this.tokenSubject!.perfil));

        this.viewModel.onHeaderMenuBackdropClick = () => 
            this.viewModel.ocutarHeaderMenu(this.tokenSubject!.perfil);
    }

    async popularDependentes() {
        const listaDependentes = await this.service.ObterDependentes();
        this.viewModel.apresentarDependentes(listaDependentes);
    }
}

