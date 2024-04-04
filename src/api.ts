import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

const isValidName = name => name.match(/[a-zA-Z] [a-zA-Z]+/);

const isValidEmail = email => email.match(/^(.+)@(.+)$/);

const isValidCarPlate = carPlate => carPlate.match(/[A-Z]{3}[0-9]{4}/);

app.post("/signup", async function (req, res) {
  let result;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();

    const [acc] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
    console.log('ACC', acc);
    if (acc) throw new Error('Account already exists');
    if (!isValidName(req.body.name)) throw new Error('Invalid name');
    if (!isValidEmail(req.body.email)) throw new Error('Invalid Email');
    if (!validate(req.body.cpf)) throw new Error('Invalid CPF');

    if (req.body.isDriver) {
      if (!isValidCarPlate(req.body.carPlate)) throw new Error('Invalid CarPlate');
      await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);

      const obj = {
        accountId: id
      };
      result = obj;

    } else {
      await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);

      const obj = {
        accountId: id
      };
      result = obj;
    }
    if (typeof result === "number") {
      console.log('ERROR ' + result)
      res.status(422).send(result + "");
    }
    res.json(result);
  }
  catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
  finally {
    await connection.$pool.end();
  }
});

app.listen(3005);
