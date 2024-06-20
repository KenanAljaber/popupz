import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { databaseMiddleware } from "../middlewares/databaseMiddleware";
import PopupService from "../services/popup/pupupSerivce";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(databaseMiddleware);

const routes = express.Router();

require("./popup").default(routes);
require("./files").default(routes);

app.use("/api", routes);

export default app;
