import express from "express";
import { config as dotenvConfig } from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dbConnect from "./db/db.js";
import categoryRouter from "./routes/category.routes.js";
import BrandRouter from "./routes/brand.routes.js";

dotenvConfig();
const port = process.env.PORT;

const app = express();

dbConnect();

app.use(
  cors({
    origin: ["http://localhost:5175"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", BrandRouter);
app.listen(port, () => console.log(`app listening on port ${port}!`));
