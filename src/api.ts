import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

const isValidName = name => name && name.match(/[a-zA-Z] [a-zA-Z]+/);

const isValidEmail = email => email && email.match(/^(.+)@(.+)$/);

const isValidCarPlate = carPlate => carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/);

const generateId = () => crypto.randomUUID();

class Database {
  private INSERT_ONE = "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)";
  private FIND_BY_EMAIL = "select * from cccat16.account where email = $1";
  private FIND_BY_ACCOUNT_ID = "select * from cccat16.account where account_id = $1";
  connectionString;

  constructor(connectionString) {
    this.connectionString = pgp()(connectionString);
  }

  async insertOne({ id, name, email, cpf, carPlate, isPassenger, isDriver }) {
    await this.connectionString.query(this.INSERT_ONE, [id, name, email, cpf, carPlate, isPassenger, isDriver]);
  }

  async findByEmail({ email }) {
    const account = await this.connectionString.query(this.FIND_BY_EMAIL, [email]);
    return account;
  }

  async findByAccountId({ id }) {
    const account = await this.connectionString.query(this.FIND_BY_ACCOUNT_ID, [id]);
    return account;
  }

  async close() {
    await this.connectionString.$pool.end();
  }
}

const POSTGRES_CONNECTION = "postgres://postgres:123456@localhost:5432/app";

app.post("/signup", async function (req, res) {
  const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;
  const database = new Database(POSTGRES_CONNECTION);
  try {
    const id = generateId();

    const [acc] = await database.findByEmail({ email });

    if (acc) throw new Error('Account already exists');
    if (!isValidName(name)) throw new Error('Invalid name');
    if (!isValidEmail(email)) throw new Error('Invalid Email');
    if (!validate(cpf)) throw new Error('Invalid CPF');

    if (req.body.isDriver) {
      if (!isValidCarPlate(carPlate)) throw new Error('Invalid CarPlate');
      await database.insertOne({ id, name, email, cpf, carPlate, isPassenger: !!isPassenger, isDriver: !!isDriver });
    }
    if (req.body.isPassenger) {
      await database.insertOne({ id, name, email, cpf, carPlate, isPassenger: !!isPassenger, isDriver: !!isDriver });
    }

    res.status(201).json({
      accountId: id,
    });
  }
  catch (error) {
    res.status(422).json({ error: error.message });
  }
  finally {
    await database.close();
  }
});

app.get("/getAccount", async function (req, res) {
  const { id } = req.query;
  const database = new Database(POSTGRES_CONNECTION);

  try {
    const [account] = await database.findByAccountId({ id });
    if (!account) throw new Error('Account not found');

    res.status(200).json(account);
  } catch (error) {
    res.status(422).json({
      error: error.message,
    });
  }
  finally {
    await database.close();
  }
});

app.listen(3005);
