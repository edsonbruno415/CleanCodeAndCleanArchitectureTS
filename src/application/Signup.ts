
import crypto from "crypto";
import { validate } from "../validateCpf";
import { Account } from "./Account";
import { AccountDAO } from "../resources/accountDAO";

export class Signup {
  account;
  constructor(data: any) {
    const accountId = generateId();
    const { name, email, cpf, carPlate, isPassenger, isDriver } = data;
    this.account = new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
  }

  async execute() {
    const accountDAO = new AccountDAO();
    try {
      const [account] = await accountDAO.findByEmail(this.account.email);

      if (account) throw new Error('Account already exists');
      if (!isValidName(this.account.name)) throw new Error('Invalid name');
      if (!isValidEmail(this.account.email)) throw new Error('Invalid Email');
      if (!validate(this.account.cpf)) throw new Error('Invalid CPF');

      await accountDAO.insertOne(this.account);

      return {
        accountId: this.account.accountId,
      };
    }
    finally {
      await accountDAO.close();
    }
  }
}

const generateId = () => crypto.randomUUID();
const isValidName = (name: string) => name && name.match(/[a-zA-Z] [a-zA-Z]+/);
const isValidEmail = (email: string) => email && email.match(/^(.+)@(.+)$/);
