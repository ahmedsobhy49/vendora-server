import express from "express";
import { config as dotenvConfig } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dbConnect from "./db/db.js";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import BrandRouter from "./routes/brand.routes.js";
import productRouter from "./routes/product.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import AddressRouter from "./routes/address.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";

dotenvConfig();
const port = process.env.PORT;

const app = express();

dbConnect();

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
  })
);
app.use(bodyParser.json()); // To parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); //
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", BrandRouter);
app.use("/api", productRouter);
app.use("/api", sellerRouter);
app.use("/api", AddressRouter);
app.use("/api", userRouter);
app.use("/api", orderRouter);

app.listen(port, () => console.log(`app listening on port ${port}!`));
