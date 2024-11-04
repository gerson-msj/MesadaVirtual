
export interface TokenResponseModel {
    token: string | null;
    message: string | null;
}

export interface UsuarioExistenteResponseModel {
    usuarioExistente: boolean;
}

export interface CardResponseModel {
    email: string | null;
    nome: string;
    acumulado: number;
    pago: number;
    saldo: number;
}