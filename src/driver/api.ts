import express from "express";
const app = express();
app.use(express.json());

import { Signup } from "../application/Signup";
import { GetAccount } from "../application/GetAccount";

const STATUS_CODE = Object.freeze({
  CREATED: 201,
  OK: 200,
  UNPROCESSABLE_ENTITY: 422,
});

app.post("/signup", async (req, res) => {
  try {
    const signup = new Signup(req.body);
    const response = await signup.execute();

    res.status(STATUS_CODE.CREATED).json(response);
  } catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: error.message,
    });
  }
});

app.get("/getAccount", async (req, res) => {
  try {
    const getAccount = new GetAccount(req.query.id);
    const account = await getAccount.execute();

    res.status(STATUS_CODE.OK).json(account);
  } catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: error.message,
    });
  }
});

app.listen(3005);
