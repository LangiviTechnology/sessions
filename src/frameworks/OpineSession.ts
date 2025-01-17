import Session from '../Session.ts'
import {getCookies} from "../../deps.ts";
import {Store} from "../stores/Store.ts";
import {NextFunction, Request, Response, Opine} from "../../deps.ts";
import {OpineRequest} from "../../types.ts"

export default class OpineSession extends Session {
    constructor(opineApp: Opine, options: { secure?: boolean, path?: string } = {}, store: Store) {
        super(store || null)

        opineApp.use(async (req: Request | OpineRequest, res: Response, next: NextFunction) => {
            const {sid} = getCookies(req.headers);

            // if (req.url == '/favicon.ico') {
            //   await next()
            // }

            if (!options.secure) {
                options.secure = req.protocol === "https";
            }
            if (!options.path) {
                options.path = "/";
            }

            if (sid && await this.sessionExists(sid)) {
                (req as OpineRequest).session = this.getSession(sid)
            } else {
                (req as OpineRequest).session = await this.createSession()
                res.cookie('sid', (req as OpineRequest).session.id)
            }

            await next()
        })
    }
}