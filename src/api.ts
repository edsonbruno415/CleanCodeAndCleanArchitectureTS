import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

const isValidName = (name: string) => name && name.match(/[a-zA-Z] [a-zA-Z]+/);

const isValidEmail = (email: string) => email && email.match(/^(.+)@(.+)$/);

const isValidCarPlate = (carPlate: string) => carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/);

const generateId = () => crypto.randomUUID();

class Database {
  private INSERT_ONE = "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)";
  private FIND_BY_EMAIL = "select * from cccat16.account where email = $1";
  private FIND_BY_ACCOUNT_ID = "select * from cccat16.account where account_id = $1";

  constructor(readonly connectionString: any) {
    this.connectionString = pgp()(connectionString);
  }

  async insertOne(user: User): Promise<void> {
    await this.connectionString.query(this.INSERT_ONE, [user.accountId, user.name, user.email, user.cpf, user.carPlate, user.isPassenger, user.isDriver]);
  }

  async findByEmail(email: string): Promise<User[]> {
    const account = await this.connectionString.query(this.FIND_BY_EMAIL, [email]);
    return account;
  }

  async findByAccountId(id: any): Promise<User[]> {
    const account = await this.connectionString.query(this.FIND_BY_ACCOUNT_ID, [id]);
    return account;
  }

  async close(): Promise<void> {
    await this.connectionString.$pool.end();
  }
}

class User {
  constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly carPlate: string,
    readonly isPassenger: boolean = false,
    readonly isDriver: boolean = false
  ) {
    if (isDriver && !isValidCarPlate(carPlate)) {
      throw new Error('Invalid CarPlate');
    }
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.carPlate = carPlate;
    this.isPassenger = isPassenger;
    this.isDriver = isDriver;
  }
}

const POSTGRES_CONNECTION = "postgres://postgres:123456@localhost:5432/app";

const STATUS_CODE = Object.freeze({
  CREATED: 201,
  OK: 200,
  UNPROCESSABLE_ENTITY: 422,
});

app.post("/signup", async function (req, res) {
  const { name, email, cpf, carPlate, isPassenger, isDriver } = req.body;
  const database = new Database(POSTGRES_CONNECTION);
  try {
    const accountId = generateId();

    const [account] = await database.findByEmail(email);

    if (account) throw new Error('Account already exists');
    if (!isValidName(name)) throw new Error('Invalid name');
    if (!isValidEmail(email)) throw new Error('Invalid Email');
    if (!validate(cpf)) throw new Error('Invalid CPF');

    const user = new User(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    await database.insertOne(user);

    res.status(STATUS_CODE.CREATED).json({
      accountId,
    });
  }
  catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({ error: error.message });
  }
  finally {
    await database.close();
  }
});

app.get("/getAccount", async function (req, res) {
  const { id } = req.query;
  const database = new Database(POSTGRES_CONNECTION);

  try {
    const [account] = await database.findByAccountId(id);
    if (!account) throw new Error('Account not found');

    res.status(STATUS_CODE.OK).json(account);
  } catch (error: any) {
    res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json({
      error: error.message,
    });
  }
  finally {
    await database.close();
  }
});

app.listen(3005);
