import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import ValueModel from "../models/value.model.ts";
import type UsuarioModel from "../models/usuario.model.ts";

interface CadastroPrincipalData {
    nome: string,
    email: string,
    senha: string
}

class UsuarioService {

    private db: Deno.Kv | undefined;

    init(db: Deno.Kv) {
        this.db = db;
    }

    async usuarioExistente(email: string | null): Promise<{ usuarioExistente: boolean }> {
        const kv = await this.db!.get<ValueModel>([email ?? ""]);
        const usuarioExistente = kv.value != null;
        return { usuarioExistente: usuarioExistente };
    }

    async cadastrarUsuario(data: CadastroPrincipalData): Promise<string | null> {

        const usuarioExistenteData = await this.usuarioExistente(data.email);
        console.log("Verificação de usuario existente", data.email, usuarioExistenteData);
        if (usuarioExistenteData.usuarioExistente)
            return null;

        const value: ValueModel = {
            usuario: {
                id: 0,
                nome: data.nome,
                senha: data.senha, // bcrypt
                emailPrincipal: null
            },
            mesada: null,
            pagamento: null
        };

        const result = await this.db!.set([data.email], value);
        if(!result.ok)
            return null;

        console.log("Resultado do cadastro", result);
        return "Token"; // jwt
    }




}

export default class UsuarioController extends Controller {

    private service: UsuarioService;

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/usuario")
            return this.nextHandle(context);

        if (["GET", "PUT"].includes(context.request.method)) {            
            const db = await context.getDb();
            this.service.init(db);
        } else {
            return context.notAllowed();
        }

        switch (context.request.method) {
            case "GET": {
                const email = context.url.searchParams.get("email");
                const result = await this.service.usuarioExistente(email);
                return context.ok(result);
            }

            case "PUT": {
                const data: CadastroPrincipalData = await context.request.json();
                const result = await this.service.cadastrarUsuario(data);
                if (result)
                    return context.ok({ token: result });
                else
                    return context.badRequest("Email informado já cadastrado.");
            }

            default: {
                return context.notAllowed();
            }
        }
    }
}

