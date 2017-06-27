import {Router, Request, Response, NextFunction} from 'express';

export class PusheenRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public listIcons(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);

    //res.send("All yer items are belong to us");
    res.render('list', {
        list: 'A list of all your pusheens'
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.listIcons);
  }

}

const pusheenRoutes = new PusheenRouter();
pusheenRoutes.init();

export default pusheenRoutes.router;
