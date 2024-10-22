import Context from "./context.ts";
import IController from "./icontroller.ts";

export default abstract class BaseController  {
  
    private next: IController | null = null;

    public abstract handle(context: Context): Promise<Response>;

    public setNext(handler: IController): IController {
        this.next = handler;
        return handler;
    }

    protected async nextHandle(context: Context): Promise<Response> {
        return await this.next?.handle(context) ?? context.badRequest("Request inválido!");
    }

    public static createInstance(handlerType: new() => IController): IController {
        return new handlerType;
    }
    
    public static enlistHandlers(...controllers: (new() => IController)[] | IController[]): IController {
        
        let currentController: IController | null = null;
        let firstController: IController | null = null;
        
        controllers.forEach(controller => {
            const controllerInstance = typeof controller === 'function' ? new controller : controller;
            if(firstController === null)
                firstController = controllerInstance;
            currentController = currentController === null ? controllerInstance : currentController.setNext(controllerInstance);
        });

        return firstController!;
    }
    
}