import {Router, Request, Response, NextFunction} from 'express';
import fs = require("fs");
import {DataManager} from "./data";

export class ImageServer {
    private _icons: Object = null;
    
    constructor(private _set:string) {
        this._icons = new Object();

        var file = new DataManager().getSetDefinition(_set);
        var data = JSON.parse(fs.readFileSync(`data/${file}`, 'utf8'));

        for (var icon in data.icons) {
            this._icons[icon] = data.icons[icon];
            console.log(`${_set} has icon >> ${icon} at ${data.icons[icon]}`);
        }
    }

    public handleRequest(req: Request, res: Response, next: NextFunction) {
        if (req.body.text == "") {
            this.sendIconList(req, res);
        } else {
            this.sendIcon(req, res);
        }
    }

    private sendIconList(req: Request, res: Response) {
        var output: string[] = [];

        for (var key in this._icons) {
            output.push(key);
        }

        res.contentType("application/json");
        res.send(`{"text": "All icon names: ${output.join('\\n')}"}`);
    }

    private sendIcon(req: Request, res: Response) {
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