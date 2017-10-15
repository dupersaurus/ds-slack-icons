import * as express from 'express';
import {DataManager} from "./data";
import {ImageServer} from "./image-server"
import fs = require("fs");

import {Log} from "./logging";

export class RequestRouter {
    private static _imageSets:Object = {};
    private _token: string = null;

    constructor(private _router:express.Router) {
        var config = JSON.parse(fs.readFileSync(`data/config.json`, 'utf8'));
        
        if (config.apptoken == null || config.apptoken == "") {
            Log.logger.error("App verification token must be set in config file");
            return;
        }

        this._token = config.apptoken;

        _router.use("/request", (req: express.Request, res: express.Response, next: express.NextFunction) => this.handleRequest(req, res, next));
    }

    get router(): express.Router {
        return this._router;
    }

    handleRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        Log.logger.info(`request-router body >> ${req.body}`);
        
        if (req.body && req.body.token != this._token) {
            res.sendStatus(401);
            return;
        }

        if (req.body.command) {
            
        } else {
            res.sendStatus(404);
        }
    }
}