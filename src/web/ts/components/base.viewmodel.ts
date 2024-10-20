export default abstract class BaseViewModel {

    // private shadow: ShadowRoot;
    
    constructor() {}

    // constructor(shadow: ShadowRoot) {
    //     this.shadow = shadow;
    // }

    // protected getElement<T>(name: string): T {
    //     return this.shadow.querySelector(`#${name}`) as T;
    // }

    protected getElement<T>(name: string): T {
        return document.querySelector(`#${name}`) as T;
    }
}