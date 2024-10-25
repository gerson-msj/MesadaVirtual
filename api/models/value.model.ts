import type MesadaModel from "./mesada.model.ts";
import type PagamentoModel from "./pagamento.model.ts";
import type UsuarioModel from "./usuario.model.ts";

export default interface ValueModel {
    usuario: UsuarioModel;
    mesada: MesadaModel;
    pagamento: PagamentoModel;
}