export class Account {
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

const isValidCarPlate = (carPlate: string) => carPlate && carPlate.match(/[A-Z]{3}[0-9]{4}/);