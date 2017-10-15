import * as express from 'express';
import {CommandRouter} from "./command-router"
import {RequestRouter} from "./request-router"

const router = express.Router();
const requestRouter = new RequestRouter(router);
const commandRouter = new CommandRouter(router);

/*router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Express'
    });
});*/

//router.use("/", PusheenRouter);

export = router;