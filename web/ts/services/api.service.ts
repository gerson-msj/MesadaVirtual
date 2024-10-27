export default class ApiService {
    private baseUrl: string;

    /**
     *
     */
    constructor(baseUrl: string) {
        this.baseUrl = `/api/${baseUrl}`;
    }

    public async doGet<TResult>(searchParams: URLSearchParams | null, bearer: string | null = null): Promise<TResult> {

        const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;

        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(bearer)
        });

        if(response.ok){
            const data: TResult = await response.json();
            return data;
        } else {
            throw new Error(response.statusText);
        }
    }

    public async doPost<TResult>(obj: object, bearer: string | null = null): Promise<TResult> {

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: this.getHeaders(bearer),
            body: JSON.stringify(obj)
        });

        const data: TResult = await response.json();
        return data;
    }

    public async doPut<TResult>(obj: object, bearer: string | null = null): Promise<TResult> {

        const response = await fetch(this.baseUrl, {
            method: "PUT",
            headers: this.getHeaders(bearer),
            body: JSON.stringify(obj)
        });

        if(response.ok){
            const data: TResult = await response.json();
            return data;
        } else {
            const error: TResult = await response.json();
            console.log("Erro:", error);
            throw new Error(response.statusText);
        }
    }

    private getHeaders(bearer: string | null): Record<string, string> {

        const headers: Record<string, string> = { "content-type": "application/json; charset=utf-8" };

        if (bearer !== null)
            headers["authorization"] = `Bearer ${bearer}`;

        return headers;
    }
}