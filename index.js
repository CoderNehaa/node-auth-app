import path from "path"
import express from "express"
import expressEjsLayouts from "express-ejs-layouts";
import router from "./src/routes/routes.js";

const server = express();

server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), "src", "views"));

server.use(expressEjsLayouts);
server.use(express.json());
server.use(express.urlencoded({extended:true}))

server.use('/', router);

server.listen(3000, () => {
    console.log("server is listening on port 3000");
})

