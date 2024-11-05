import { TokenSubjectModel } from "../models/model";

export default class TokenService {

    static obterTokenSubject(): TokenSubjectModel | null {
        try {
            const token = localStorage.getItem("token");
            const payload: { sub: TokenSubjectModel, exp: number } = JSON.parse(atob(token!.split(".")[1]));
            return payload.sub;
        } catch (error) {
            return null;
        }
    }

}