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

  public listIcons(req: Request, res: Response, next: NextFunction) {
    var output: string[] = [];

    for (var key in PusheenRouter._icons) {
        output.push(key);
    }

    //res.send("All yer items are belong to us");
    res.render('list', {
        list: output.join("\n")
    });
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

    this.router.get('/', this.listIcons);
    this.router.post('/', this.listIcons);
  }

}

const pusheenRoutes = new PusheenRouter();
pusheenRoutes.init();

export default pusheenRoutes.router;
