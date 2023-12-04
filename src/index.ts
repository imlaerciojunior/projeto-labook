import express from "express";
import cors from "cors";
import { postRouter } from "./router/postRouter";
import dotenv from "dotenv";
import { userRouter } from "./router/useRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
});

app.use("/users", userRouter);

app.use("/posts", postRouter);