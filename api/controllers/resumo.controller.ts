import { DependenteDbModel, PerfilDep } from "../models/db.model.ts";
import { PerfilResp, ResponsavelDbModel } from "../models/db.model.ts";
import { ResumoMesadaResponseModel, TokenSubject } from "../models/response.model.ts";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";

class ResumoService {

    private db: Deno.Kv;

    constructor(db: Deno.Kv) {
        this.db = db;
    }

    async obterResumo(tokenSub: TokenSubject): Promise<ResumoMesadaResponseModel[]> {
        
        const depKeys: string[][] = [];
        
        if(tokenSub.perfil == "Resp"){
            const resp = await this.db.get<ResponsavelDbModel>([PerfilResp, tokenSub.email]);
            
            resp.value?.dependentes.forEach(dependente => {
                depKeys.push([PerfilDep, dependente]);
            });
        } else {
            depKeys.push([PerfilDep, tokenSub.email]);
        }

        const dbResults = await this.db.getMany<DependenteDbModel[]>(depKeys);
        
        const resumos = dbResults
            .filter(dbResult => dbResult.value != null)
            .map(dbResult => {
                const acumulado = dbResult.value.mesadas.reduce((total, mesada) => {
                    const de = mesada.de.getTime();
                    const ate = (mesada.ate ?? new Date()).getTime();
                    const dias = (ate - de) / (24 * 60 * 60 * 1000);
                    const valor = mesada.valor / 30.0;
                    return total + (valor * dias);
                }, 0);
                const pago = dbResult.value.pagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);
                const saldo = acumulado - pago;

                const resumo: ResumoMesadaResponseModel = {
                    dep: dbResult.key[1].toString(),
                    nome: dbResult.value.usuario.nome,
                    acumulado: acumulado,
                    pago: pago,
                    saldo: saldo
                };

                return resumo;
        });

        return resumos;
    }
}

class ResumoController extends Controller<ResumoService> {

    public override async handle(context: Context): Promise<Response> {
        
        if (context.url.pathname != "/api/resumo")
            return this.nextHandle(context);

        if (context.tokenSub == null)
            return context.unauthorized();

        if (["GET"].includes(context.request.method)) {
            const db = await context.getDb();
            this.service = new ResumoService(db);
        } else {
            return context.notAllowed();
        }

        switch (context.request.method) {
            case "GET": {
                const result = await this.service.obterResumo(context.tokenSub);
                return context.ok(result);
            }

            default: {
                return context.notAllowed();
            }
        }
    }

}

export default ResumoController;