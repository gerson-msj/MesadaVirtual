import ApiService from "../services/api.service";

export default abstract class BaseService {
    
    protected api: ApiService;
    
    constructor(baseUrl: string) {
        this.api  = new ApiService(baseUrl);
    }
}