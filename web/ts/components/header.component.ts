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
        super();
    }

}

export default class HeaderComponent extends Component<HeaderViewModel, HeaderService> {
    
    constructor() {
        super("header");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HeaderViewModel, HeaderService);
    }
}