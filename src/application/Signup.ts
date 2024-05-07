import crypto from "crypto";
import { validate } from "./validateCpf";
import { AccountDAO } from "../resources/accountDAO";
export class Signup {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: any) {
    try {
      const account = input;
      account.accountId = generateId();
      const [existingAccount] = await this.accountDAO.findByEmail(account.email);

      if (existingAccount) throw new Error('Account already exists');
      if (!isValidName(account.name)) throw new Error('Invalid name');
      if (!isValidEmail(account.email)) throw new Error('Invalid Email');
      if (!validate(account.cpf)) throw new Error('Invalid CPF');
      if (account.isDriver && !isValidCarPlate(account.carPlate)) throw new Error('Invalid CarPlate');
      await this.accountDAO.insertOne(account);

      return {
        accountId: account.accountId,
      };
    }
    finally {
      await this.accountDAO.close();
    }
  }
}

const generateId = () => crypto.randomUUID();
const isValidName = (name: string) => name && name.match(/[a-zA-Z] [a-zA-Z]+/);
const isValidEmail = (email: string) => email && email.match(/^(.+)@(.+)$/);
const isValidCarPlate = (carPlate: string) => carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/);
