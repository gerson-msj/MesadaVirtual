import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class LoginViewModel extends ViewModel {

}

class LoginService extends Service {

}

class LoginComponent extends Component<LoginViewModel, LoginService>{
    
    initialize(): void {
        this.initializeResources(LoginViewModel, LoginService);
    }

}

export default LoginComponent;