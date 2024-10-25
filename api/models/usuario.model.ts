export default interface UsuarioModel {
    id: number;
    nome: string;
    senha: string;
    emailPrincipal: string | null;
}