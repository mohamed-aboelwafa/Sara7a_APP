
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";

const _dirname = path.resolve();

export function attachRouterLogger(app, wanted_router_path, wanted_router, logFileName){

    // create new file
    const wanted_stream = fs.createWriteStream(
        path.resolve(_dirname, "./src/loggers", logFileName),
        {flag: "a"}, // append // add new data on old content
    );

    // execute morgan
    app.use(wanted_router_path, morgan("combined", {stream: wanted_stream}), wanted_router);
    app.use(wanted_router_path, morgan("dev"), wanted_router);
}