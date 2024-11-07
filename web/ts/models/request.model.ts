export interface CadastroRespRequestModel {
    nome: string,
    email: string,
    senha: string
}

export interface LoginRequestModel {
    email: string,
    senha: string
}

export interface CadastroDepModel {
    nome: string,
    email: string,
    senha: string,
    mesada: number
}