



import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/auth";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(404).send("no link matched!");
});

export default app;




