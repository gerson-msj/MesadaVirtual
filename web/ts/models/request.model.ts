export interface CadastroRespRequestModel {
    nome: string,
    email: string,
    senha: string
}

export interface LoginRequestModel {
    email: string,
    senha: string
}