import { headerMenuClick, headerMenuVisible } from "../models/event.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";


class HeaderViewModel extends ViewModel {

    private menu: HTMLSpanElement;

    public onMenuClick = () => { };

    constructor() {
        super();
        this.menu = this.getElement("menu");
        this.menu.addEventListener("click", () => this.onMenuClick());

        document.addEventListener(headerMenuVisible, (ev) => {
            const visible = (ev as CustomEvent).detail as boolean;

        })
    }

    menuVisivel(visivel: boolean) {
        const oculto = this.menu.classList.contains("oculto"); 
        if(visivel && oculto)
            this.menu.classList.remove("oculto");
        else if (!visivel && !oculto)
            this.menu.classList.add("oculto");
    }


}

class HeaderService extends Service {

    constructor() {
        super();
    }

}

export default class HeaderComponent extends Component<HeaderViewModel, HeaderService> {

    constructor() {
        super("header");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HeaderViewModel, HeaderService);

        this.viewModel.onMenuClick = () =>
            document.dispatchEvent(new Event(headerMenuClick));

        document.addEventListener(headerMenuVisible, (ev) => {
            const visible = (ev as CustomEvent).detail as boolean;
            this.viewModel.menuVisivel(visible);
        });
    }
}