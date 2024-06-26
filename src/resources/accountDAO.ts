import pgp from "pg-promise";

const POSTGRES_CONNECTION = "postgres://postgres:123456@localhost:5432/app";
export interface AccountDAO {
  insertOne(account: any): Promise<void>;
  findByEmail(email: string): Promise<any[]>;
  findByAccountId(id: string): Promise<any[]>;
  close(): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {
  private INSERT_ONE = "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)";
  private FIND_BY_EMAIL = "select * from cccat16.account where email = $1";
  private FIND_BY_ACCOUNT_ID = "select * from cccat16.account where account_id = $1";
  connectionString;

  constructor() {
    this.connectionString = pgp()(POSTGRES_CONNECTION);
  }

  async insertOne(account: any): Promise<void> {
    await this.connectionString.query(this.INSERT_ONE, [account.accountId, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver]);
  }

  async findByEmail(email: string): Promise<any[]> {
    return await this.connectionString.query(this.FIND_BY_EMAIL, [email]);
  }

  async findByAccountId(id: string): Promise<any[]> {
    return await this.connectionString.query(this.FIND_BY_ACCOUNT_ID, [id]);
  }

  async close(): Promise<void> {
    await this.connectionString.$pool.end();
  }
}

