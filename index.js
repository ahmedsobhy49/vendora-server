import express from "express";
import { config } from "dotenv";
import authRouter from "./routes/auth.routes.js";
config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use("/api", authRouter);
app.listen(port, () => console.log(`app listening on port ${port}!`));
