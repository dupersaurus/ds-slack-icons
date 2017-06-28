import * as express from 'express';
import {DataManager} from "./data";
import {ImageServer} from "./image-server"

export class CommandRouter {
    private static _imageSets:Object = {};

    constructor(private _router:express.Router) {
        var data = new DataManager();
        var sets = data.getSets();

        for (var set in sets) {
            CommandRouter._imageSets[`/${set}`] = new ImageServer(set);
        }

        _router.use("/", (req: express.Request, res: express.Response, next: express.NextFunction) => this.handleRequest(req, res, next));
    }

    get router(): express.Router {
        return this._router;
    }

    handleRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body.command) {
            var server = this.matchCommand(req.body.command);

            if (server) {
                server.handleRequest(req, res, next);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    }

    private matchCommand(command: string): ImageServer {
        if (CommandRouter._imageSets[command]) {
            return CommandRouter._imageSets[command];
        } else {
            return null;
        }
    }
}