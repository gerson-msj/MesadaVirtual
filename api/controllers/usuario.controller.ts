import BaseController from "../base.controller.ts";
import Context from "../context.ts";
import ValueModel from "../models/value.model.ts";

export default class UsuarioController extends BaseController {

    public override handle(context: Context): Promise<Response> {

        if (context.url.pathname == "/api/usuario" && context.request.method == "GET") {
            return this.usuarioExistente(context);
        }

        return this.nextHandle(context);
    }

    private async usuarioExistente(context: Context): Promise<Response> {

        const kv = await Deno.openKv();

        const email = context.url.searchParams.get("email");
        if (typeof email == 'string') {
            const data = kv.get<ValueModel>([email])
            console.log(data);
        }

        const result: { usuarioExistente: boolean } = { usuarioExistente: false };
        return context.ok(result);

    }

}