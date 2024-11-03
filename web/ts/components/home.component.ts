import { CardResponseModel } from "../models/response.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HomeViewModel extends ViewModel {
    private cards: HTMLDivElement;
    private cardTemplate: HTMLTemplateElement;

    constructor() {
        super();
        this.cards = this.getElement("cards");
        this.cardTemplate = this.getElement("cardTemplate");
    }

    apresentarDependentes(cards: CardResponseModel[]) {
        
        const card = this.cardTemplate.innerHTML;
        this.cards.innerHTML = cards
            .map(dep => card
                .replace("{nome}", dep.nome)
                .replace("{acumulado}", dep.acumulado.toLocaleString('pt-br', {minimumFractionDigits: 2}))
                .replace("{pago}", dep.pago.toLocaleString('pt-br', {minimumFractionDigits: 2}))
                .replace("{saldo}", dep.saldo.toLocaleString('pt-br', {minimumFractionDigits: 2})))
            .join("");
    }
}

class HomeService extends Service {

    constructor() {
        super();
    }

    async ObterDependentes(): Promise<CardResponseModel[]> {
        const listaDependentes: CardResponseModel[] = [];
        for (let index = 1; index <= 50; index++) {
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
        await this.popularDependentes();
    }

    async popularDependentes() {
        const listaDependentes = await this.service.ObterDependentes();
        this.viewModel.apresentarDependentes(listaDependentes);
    }

}

