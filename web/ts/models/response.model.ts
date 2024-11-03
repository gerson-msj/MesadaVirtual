export interface TokenResponseModel {
    token: string | null;
    message: string | null;
}

export interface UsuarioExistenteResponseModel {
    usuarioExistente: boolean;
}

export interface DependenteResponseModel {
    email: string;
    nome: string;
    acumulado: number;
    pago: number;
    saldo: number;
}