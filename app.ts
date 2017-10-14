import * as express from 'express';
import * as path from 'path';
import * as requestLogger from 'morgan';
import * as bodyParser from 'body-parser';
import * as fs from "fs";
import * as log4js from "log4js";

import * as root from 'app-root-path';
import * as cookieParser from 'cookie-parser';
import * as routes from './server/routes';
import {Log} from "./server/logging";

log4js.configure(
    {
        appenders: {
            file: {
                type: 'file',
                filename: 'important-things.log',
                maxLogSize: 10 * 1024 * 1024, // = 10Mb
                numBackups: 5, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: 0o0640,
                flags: 'w+'
            }
        },
        categories: {
            default: { appenders: ['file'], level: 'all' }
        }
    }
);

const app = express();
//const logger = log4js.getLogger("default");
//logger.level = "trace";

Log.trace("Starting up");

// view engine setup
app.set('views', `${root}/server/views/`);
app.set('view engine', 'ejs');

app.use(requestLogger("dev", {stream: fs.createWriteStream("requests.log", {flags: "w"})}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    let err: any = new Error('Not Found');
    err.status = 404;
    Log.logger.error(`404 >> ${req.url}`);
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        Log.logger.error(`500 >> ${err.message}`);
    });
}

app.use(function(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    Log.logger.error(`500 >> ${err.message}`);
});

export = app;