import BaseComponent from "../base.component";
import BaseService from "../base.service";
import BaseViewModel from "../base.viewmodel";

class HomeViewModel extends BaseViewModel {

    constructor() {
        super();
    }

}

class HomeService extends BaseService {
    constructor() {
        super("home");
    }
}


class HomeComponent extends BaseComponent<HomeService, HomeViewModel> {

    constructor() {
        super("home");
    }

    initialize(): void {
        this.initializeViewModel(HomeViewModel);
        this.initializeService(HomeService);
    }

}

export default HomeComponent;