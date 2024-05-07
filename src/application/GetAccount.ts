import { AccountDAO } from "../resources/accountDAO";
export class GetAccount {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: any){
    try {
      const [account] = await this.accountDAO.findByAccountId(input.id);
      if (!account) throw new Error('Account not found');

      return account;
    }
    finally {
      await this.accountDAO.close();
    }
  }
}