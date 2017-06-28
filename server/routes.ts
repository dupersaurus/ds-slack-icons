import * as express from 'express';
import PusheenRouter from "./pusheen";
import {CommandRouter} from "./command-router"

const router = express.Router();
const commandRouter = new CommandRouter(router);

/*router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Express'
    });
});*/

//router.use("/", PusheenRouter);

export = router;