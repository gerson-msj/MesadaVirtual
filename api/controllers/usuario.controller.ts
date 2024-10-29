import Controller from "./base/controller.ts";
import Context from "./base/context.ts";
import type { CadastroResponsavelRequestModel } from "../../web/ts/models/request.model.ts";
import { KeyDep, KeyResp, type ResponsavelDbModel } from "../models/db.model.ts";
import type { TokenResponseModel, UsuarioExistenteResponseModel } from "../models/response.model.ts";

class UsuarioService {

    private db: Deno.Kv | undefined;

    init(db: Deno.Kv) {
        this.db = db;
    }

    async usuarioExistente(email: string | null): Promise<UsuarioExistenteResponseModel> {

        const result = await this.db?.getMany([
            [KeyResp, email ?? ""],
            [KeyDep, email ?? ""]
        ]);

        return { usuarioExistente: result?.some(r => r.value != null) ?? false };
    }

    async cadastrarResponsavel(request: CadastroResponsavelRequestModel): Promise<TokenResponseModel> {

        const usuarioExistenteResponse = await this.usuarioExistente(request.email);
        if (usuarioExistenteResponse.usuarioExistente)
            return { token: null, message: "O email informado já está cadastrado." };

        const responsavel: ResponsavelDbModel = {
            usuario: {
                nome: request.nome,
                senha: request.senha
            },
            dependentes: []
        };

        const result = await this.db!.set([KeyResp, request.email], responsavel);
        if (!result.ok)
            return { token: null, message: "Sistema indisponível no momento." };

        return { token: "token", message: "Cadastro Ok." };
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
                const request = context.url.searchParams.get("email");
                const response = await this.service.usuarioExistente(request);
                return context.ok(response);
            }

            case "PUT": {
                const request: CadastroResponsavelRequestModel = await context.request.json();
                const response: TokenResponseModel = await this.service.cadastrarResponsavel(request);
                return context.ok(response);
            }

            default: {
                return context.notAllowed();
            }
        }
    }
}

