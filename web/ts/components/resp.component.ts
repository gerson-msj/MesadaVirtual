import { headerMenuClick } from "../models/const.model";
import { CardResponseModel } from "../models/response.model";
import TokenService from "../services/token.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class RespViewModel extends ViewModel {

    private cards: HTMLDivElement;
    private cardTemplate: HTMLTemplateElement;
    private menuContainer: HTMLDivElement;
    private menu: HTMLDivElement;
    private menuBackdrop: HTMLDivElement;
    private adicionarDep: HTMLButtonElement;

    public onMenuBackdrop = () => { };
    public onAdicionarDep = () => { };

    constructor() {
        super();
        this.cards = this.getElement("cards");
        this.cardTemplate = this.getElement("cardTemplate");
        this.menuContainer = this.getElement("menuContainer");
        this.menu = this.getElement("menu");
        this.menuBackdrop = this.getElement("menuBackdrop");
        this.adicionarDep = this.getElement("adicionarDep");

        this.menuBackdrop.addEventListener("click", () =>
            this.onMenuBackdrop());

        this.adicionarDep.addEventListener("click", () => 
            this.onAdicionarDep());
    }

    exibirMenu() {
        this.menuContainer.classList.remove("oculto");
    }

    ocultarMenu() {
        this.menuContainer.classList.add("oculto");
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

class RespService extends Service {

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

export default class RespComponent extends Component<RespViewModel, RespService> {

    constructor() {
        super("resp");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(RespViewModel, RespService);

        const tokenSubject = TokenService.obterTokenSubject();
        if (tokenSubject == null) {
            this.dispatchEvent(new Event("sair"));
            return;
        }

        await this.popularDependentes();

        this.addEventListener(headerMenuClick, () =>
            this.viewModel.exibirMenu());

        this.viewModel.onMenuBackdrop = () =>
            this.viewModel.ocultarMenu();

        this;this.viewModel.onAdicionarDep = () =>
            this.dispatchEvent(new Event("adicionarDep"));
    }

    async popularDependentes() {
        const listaDependentes = await this.service.ObterDependentes();
        this.viewModel.apresentarDependentes(listaDependentes);
    }
}

