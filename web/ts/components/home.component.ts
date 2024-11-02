import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HomeViewModel extends ViewModel {

}

class HomeService extends Service {
    
}

export default class HomeComponent extends Component<HomeViewModel, HomeService> {
    
    constructor() {
        super("home");
        
    }

    initialize(): void {
        this.initializeResources(HomeViewModel, HomeService);
    }

}

