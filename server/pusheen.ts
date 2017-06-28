import {Router, Request, Response, NextFunction} from 'express';
import {DataManager} from "./data";
import fs = require("fs");

export class PusheenRouter {
  router: Router

  private static _icons: Object = null;

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public handleRequest(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);

    if (req.body.text == "") {
      PusheenRouter.sendIconList(req, res);
    } else {
      PusheenRouter.sendIcon(req, res);
    }
  }

  private static sendIconList(req: Request, res: Response) {
    var output: string[] = [];

    for (var key in PusheenRouter._icons) {
        output.push(key);
    }

    res.contentType("application/json");
    res.send(`{"text": "All icon names: ${output.join('\\n')}"}`);
    
    /*res.render('list', {
        list: output.join("\n")
    });*/
  }

  private static sendIcon(req: Request, res: Response) {
    res.contentType("application/json");

    var icon = PusheenRouter.getIcon(req.body.text);

    if (icon == null) {
      this.sendIconList(req, res);
    } else {
      res.send(`{"response_type": "in_channel", "text": "${req.body.text}", "attachments": [{"image-url": "${icon}"}]}`);
    }
  }

  private static getIcon(name: string): string {
    return PusheenRouter._icons[name];
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {

    // take into account file being updated at runtime
    if (PusheenRouter._icons == null) {
        PusheenRouter._icons = new Map<string, string>();
        
        var file = new DataManager().getSetDefinition("pusheen");
        var data = JSON.parse(fs.readFileSync(`data/${file}`, 'utf8'));

        for (var icon of data.icons) {
            PusheenRouter._icons[icon.name] = icon.url;
            console.log(`pusheen has icon >> ${icon.name} at ${icon.url}`);
        }
    }

    this.router.get('/', this.handleRequest);
    this.router.post('/', this.handleRequest);
  }

}

const pusheenRoutes = new PusheenRouter();
pusheenRoutes.init();

export default pusheenRoutes.router;
