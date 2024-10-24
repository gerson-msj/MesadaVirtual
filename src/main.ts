import BaseController from "./api/base.controller.ts";
import Context from "./api/context.ts";
import PageController from "./api/controllers/page.controller.ts";

// import CriarController from "./api/controllers/criar.controller.ts";
// import AbrirController from "./api/controllers/abrir.controller.ts";
// import AnotacoesController from "./api/controllers/anotacoes.controller.ts";

const page = BaseController.createInstance(PageController);

// const handler = async (request: Request): Promise<Response> => {
const handler = (request: Request): Promise<Response> => {
    
    const context = new Context(request);
    return page.handle(context);
    
    // if (context.isApiRequest) {

    //     if(!await context.auth())
    //         return context.unauthorized();

    //     await context.openKv();
        
    //     const criar = new CriarController();
    //     const abrir = new AbrirController();
    //     const anotacoes = new AnotacoesController();
    //     const controllers = BaseController.enlistHandlers(
    //         criar, abrir, anotacoes
    //     );

    //     return controllers.handle(context);
    // } else {
    //     return page.handle(context);
    // }
};

Deno.serve(handler);