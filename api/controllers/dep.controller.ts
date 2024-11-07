import { CadastroDepRequestModel } from "../models/request.model.ts";
import ServerCrypt from "../services/server.crypt.ts";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";

class DepService {

    private db: Deno.Kv;
    private crypt: ServerCrypt;

    constructor(db: Deno.Kv) {
        this.db = db;
        this.crypt = new ServerCrypt();
    }

    cadastrarDep(request: CadastroDepRequestModel): Promise<string | null> {
        return Promise.resolve("Não pode!");
    }
}

export default class DepController extends Controller<DepService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/dep")
            return this.nextHandle(context);

        if (context.tokenSub?.perfil != "Resp")
            return context.unauthorized();

        if (["PUT"].includes(context.request.method)) {
            const db = await context.getDb();
            this.service = new DepService(db);
        } else {
            return context.notAllowed();
        }

        switch (context.request.method) {
            case "PUT": {
                const request: CadastroDepRequestModel = await context.request.json();
                const message = await this.service.cadastrarDep(request);
                return message == null ? context.ok({}) : context.badRequest(message);
            }

            default: {
                return context.notAllowed();
            }
        }


    }

}