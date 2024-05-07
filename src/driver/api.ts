import express from "express";
const app = express();
app.use(express.json());

import { Signup } from "../application/Signup";
import { GetAccount } from "../application/GetAccount";
import { AccountDAODatabase } from "../resources/accountDAO";

const STATUS_CODE = Object.freeze({
  CREATED: 201,
  OK: 200,
  UNPROCESSABLE_ENTITY: 422,
});

app.post("/signup", async (req, res) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const response = await signup.execute(req.body);

    res.status(STATUS_CODE.CREATED).json(response);
  } catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: error.message,
    });
  }
});

app.get("/getAccount", async (req, res) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const account = await getAccount.execute(req.query);

    res.status(STATUS_CODE.OK).json(account);
  } catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: error.message,
    });
  }
});

app.listen(3005);
