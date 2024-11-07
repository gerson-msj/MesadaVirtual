export interface CadastroRespRequestModel {
    nome: string,
    email: string,
    senha: string
}

export interface LoginRequestModel {
    email: string,
    senha: string
}

export interface CadastroDepRequestModel {
    nome: string,
    email: string,
    senha: string,
    mesada: number
}