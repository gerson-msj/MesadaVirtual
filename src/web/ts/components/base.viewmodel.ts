export default abstract class BaseViewModel {

    private shadow: ShadowRoot;
    
    constructor(shadow: ShadowRoot) {
        this.shadow = shadow;
    }

    protected getElement<T>(name: string): T {
        return this.shadow.querySelector(`#${name}`) as T;
    }
}