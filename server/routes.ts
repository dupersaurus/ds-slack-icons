import * as express from 'express';
import PusheenRouter from "./pusheen";

const router = express.Router();

/*router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('index', {
        title: 'Express'
    });
});*/

router.use("/", PusheenRouter);

export = router;