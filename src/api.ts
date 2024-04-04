import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

const isValidName = name => name && name.match(/[a-zA-Z] [a-zA-Z]+/);

const isValidEmail = email => email && email.match(/^(.+)@(.+)$/);

const isValidCarPlate = carPlate => carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/);

class Database {
  private INSERT_COMMAND = "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)";
  private FIND_BY_EMAIL = "select * from cccat16.account where email = $1";

  constructor(readonly connectionString) {
    this.connectionString = pgp()(connectionString);
  }

  async insertOne({ id, name, email, cpf, carPlate, isPassenger, isDriver }) {
    return await this.connectionString.query(this.INSERT_COMMAND, [id, name, email, cpf, carPlate, isPassenger, isDriver]);
  }

  async findByEmail({ email }) {
    return await this.connectionString.query(this.FIND_BY_EMAIL, [email]);
  }

  async close(){
    return await this.connectionString.$pool.end();
  }
}

const POSTGRES_CONNECTION = "postgres://postgres:123456@localhost:5432/app";

app.post("/signup", async function (req, res) {
  let result;
  const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;

  const database = new Database(POSTGRES_CONNECTION);
  try {
    const id = crypto.randomUUID();

    const [acc] = await database.findByEmail({ email });

    if (acc) throw new Error('Account already exists');
    if (!isValidName(req.body.name)) throw new Error('Invalid name');
    if (!isValidEmail(req.body.email)) throw new Error('Invalid Email');
    if (!validate(req.body.cpf)) throw new Error('Invalid CPF');

    if (req.body.isDriver) {
      if (!isValidCarPlate(req.body.carPlate)) throw new Error('Invalid CarPlate');
      await database.insertOne({ id, name, email, cpf, carPlate, isPassenger: !!isPassenger, isDriver: !!isDriver });

      const obj = {
        accountId: id
      };
      result = obj;

    }
    if (req.body.isPassenger) {
      await database.insertOne({ id, name, email, cpf, carPlate, isPassenger: !!isPassenger, isDriver: !!isDriver });

      const obj = {
        accountId: id
      };
      result = obj;
    }

    res.json(result);
  }
  catch (error) {
    res.send(error.message);
  }
  finally {
    await database.close();
  }
});

app.listen(3005);
