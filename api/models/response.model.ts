import { Perfil } from "./db.model.ts";

export interface TokenSubject {
    email: string;
    perfil: Perfil;
}

export interface TokenResponseModel {
    token: string | null;
    message: string | null;
}

export interface UsuarioExistenteResponseModel {
    usuarioExistente: boolean;
}