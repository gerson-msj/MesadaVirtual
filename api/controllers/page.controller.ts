import { serveFile } from "@std/http/file-server";
import { join } from "@std/path/join";
import BaseController from "../base.controller.ts";
import Context from "../context.ts";

export default class PageController extends BaseController {
    
    private basePath:string | undefined;

    constructor(basePath: string | undefined = undefined) {
        super();
        this.basePath = basePath;
    }

    public async handle(context: Context): Promise<Response> {
        if(context.isApiRequest)
            return super.nextHandle(context);

        const pageDir = join(Deno.cwd(), this.basePath ?? "web", "app");
        let filePath = context.url.pathname.includes(".") ? join(pageDir, context.url.pathname) : pageDir;
        
        try {
            if(Deno.statSync(filePath).isDirectory)
                filePath = join(filePath, "index.html");

            const response = await serveFile(context.request, filePath);
            return response;
            
        } catch (error) {
            console.error(error);
            return new Response("¯\_(ツ)_/¯", {status: 404, headers: {"content-type": "text/plain; charset=utf-8"}});
        }
    }

}