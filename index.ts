import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authenticateUser } from "./middleware/authMiddleware";

const app = express();
const port = 3000;

app.use(authenticateUser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

import expressRouter from "./router/express-router";

app.use("/", expressRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
