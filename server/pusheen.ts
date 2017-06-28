import {Router, Request, Response, NextFunction} from 'express';
import {DataManager} from "./data";
import fs = require("fs");
import {ImageServer} from "./image-server"

export class PusheenRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public handleRequest(req: Request, res: Response, next: NextFunction) {
    imageServer.handleRequest(req, res, next);
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.handleRequest);
    this.router.post('/', this.handleRequest);
  }

}

const imageServer: ImageServer = new ImageServer("pusheen");
const pusheenRoutes = new PusheenRouter();

export default pusheenRoutes.router;
