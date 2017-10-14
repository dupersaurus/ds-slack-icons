import {Router, Request, Response, NextFunction} from 'express';
import fs = require("fs");
import {DataManager} from "./data";

import {Log} from "./logging";

export class ImageServer {
    private _icons: Object = null;
    private _iconKeys: string[] = [];
    
    constructor(private _set:string) {
        this._icons = new Object();

        var file = new DataManager().getSetDefinition(_set);
        var data = JSON.parse(fs.readFileSync(`data/${file}`, 'utf8'));

        for (var icon in data.icons) {
            this._icons[icon] = data.icons[icon];
            this._iconKeys.push(icon);
            Log.logger.trace(`${_set} has icon >> ${icon} at ${data.icons[icon]}`);
        }

        this._iconKeys.sort();
    }

    public handleRequest(req: Request, res: Response, next: NextFunction) {
        Log.logger.trace(`ImageServer >> request (${this._set}) >> '${req.body.text}'`);
        if (req.body.text == "") {
            this.sendIconList(req, res);
        } else {
            if (req.body.text == "selector") {
                this.sendIconSelector(req, res);
            } else {
                this.sendIcon(req, res);
            }
        }
    }

    private sendIconList(req: Request, res: Response) {
        Log.logger.trace(`ImageServer >> (${this._set}) >> send icon list`);
        var output: string[] = this._iconKeys;

        res.contentType("application/json");
        res.send(`{"text": "All icon names: ${output.join('\\n')}"}`);
    }

    private sendIconSelector(req: Request, res: Response) {
        Log.logger.trace(`ImageServer >> (${this._set}) >> send icon list`);
        var output: string[] = [];

        for (var key of this._iconKeys) {
            output.push(`{"text": "${key}", "value": "${key}"}`);
        }

        res.contentType("application/json");
        res.send(`{
                    "text": "Choose your sticker",
                    "response_type": "in_channel",
                    "attachments": [{
                        "text": "Select a sticker", 
                        "attachment_type": "default",
                        "callback_id": "${this._set}", 
                        "actions": [{
                            "name": "image_types",
                            "text": "Select an image",
                            "type": "select",
                            "options": [ ${output.join(',')} ]
                        }]
                    }]
                }`);
    }

    private sendIcon(req: Request, res: Response) {
        Log.logger.trace(`ImageServer >> (${this._set}) >> send icon ${req.body.text}`);
        res.contentType("application/json");

        var icon = this.getIcon(req.body.text);

        if (icon == null) {
            this.sendIconList(req, res);
        } else {
            res.send(`{"response_type": "in_channel", "text": "${req.body.text}", "attachments": [{"image_url": "${icon}"}]}`);
        }
    }

    private getIcon(name:string): string {
        return this._icons[name];
    }
}

export default ImageServer;