import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Routes from "./routes/v1/index.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/api/v1`, v1Routes);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Http server running on ${PORT}`));
