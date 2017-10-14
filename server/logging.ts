import * as log4js from "log4js";

export class Log {
    public static logger;

    public static trace(log:String) {
        Log.logger.trace(log);
        console.log(log);
    }
}

console.log("Log >> run");

if (Log.logger == null) {
    console.log("Log >> setup");
    Log.logger = log4js.getLogger("file");
    Log.logger.level = "all";
}

export default Log;