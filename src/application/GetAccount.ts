import { AccountDAO } from "../resources/accountDAO";

export class GetAccount {
  constructor(readonly accountId: any) {
    this.accountId = accountId;
  }

  async execute(){
    const accountDAO = new AccountDAO();
  
    try {
      const [account] = await accountDAO.findByAccountId(this.accountId);
      if (!account) throw new Error('Account not found');

      return account;
    }
    finally {
      await accountDAO.close();
    }
  }
}