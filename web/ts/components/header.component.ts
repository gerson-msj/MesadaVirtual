import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";


class HeaderViewModel extends ViewModel {

    constructor() {
        super();
    }
}

class HeaderService extends Service {
    
    constructor() {
        super("header");
    }

}

export default class HeaderComponent extends Component<HeaderService, HeaderViewModel> {
    
    constructor() {
        super("header");
    }

    initialize(): void {
        this.initializeService(HeaderService);
        this.initializeViewModel(HeaderViewModel);
    }
}