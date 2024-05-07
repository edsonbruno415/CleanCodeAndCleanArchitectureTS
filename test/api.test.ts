import axios from "axios";
import { AccountDAODatabase } from "../src/resources/accountDAO";

test("should create a passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const expected = {
    accountTd: '7892b2aa-7538-467a-a0f1-6e96a2ca9e8c',
  };

  const response = await axios.post("http://localhost:3005/signup", input);
  console.log('STATUS', response.status);
  console.log('DATA', response.data);
  expect(response.status).toBe(201);
});

test("should be return an error when email already exists", async function () {
  const input = {
    name: "John Doe",
    email: `jaojao001@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };

  const expected = {
    error: 'Account already exists'
  };

  try {
    await axios.post("http://localhost:3005/signup", input);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});

test("should be return an error when send wrong name", async function () {
  const input = {
    name: "12563@",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true
  };
  const expected = {
    error: 'Invalid name'
  };

  try {
    await axios.post("http://localhost:3005/signup", input);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});

test("should be return an error when send wrong email", async function () {
  const input = {
    name: "John Doe",
    email: `AAAAAAAAA`,
    cpf: "87748248800",
    isPassenger: true
  };
  const expected = {
    error: 'Invalid Email'
  };

  try {
    await axios.post("http://localhost:3005/signup", input);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});

test("should be return an error with wrong cpf", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "111",
    isPassenger: true
  };
  const expected = {
    error: 'Invalid CPF'
  };

  try {
    await axios.post("http://localhost:3005/signup", input);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});

test("should be return an error when Driver has wrong carPlate", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isDriver: true,
    carPlate: '@@@@',
  };
  const expected = {
    error: 'Invalid CarPlate'
  };

  try {
    await axios.post("http://localhost:3005/signup", input);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});
test("should be return an existing account", async function () {
  const accountId = '3cd9e044-21da-4251-88b1-61e42b0edd9b';
  const passenger = {
    account_id: '3cd9e044-21da-4251-88b1-61e42b0edd9b',
    name: 'John Doe',
    email: 'john.doe0.22112975014377145@gmail.com',
    cpf: '87748248800',
    car_plate: null,
    is_passenger: true,
    is_driver: false
  }
  const output = await axios.get(`http://localhost:3005/getAccount?id=${accountId}`);

  expect(output.status).toBe(200);
  expect(output.data).toEqual(passenger);
});


test("should be return an error when not found account", async function () {
  const accountId = '8ee10a08-9076-4a51-a531-67e03ef522f2';
  const expected = {
    error: 'Account not found'
  };

  try {
    await axios.get(`http://localhost:3005/getAccount?id=${accountId}`);
  } catch (error: any) {
    const { data, status } = error.response;
    expect(status).toBe(422);
    expect(data).toEqual(expected);
  }
});
