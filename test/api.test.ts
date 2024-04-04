import axios from "axios";

/* axios.defaults.validateStatus = function () {
	return true;
} */

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const expected = {
    output: {
      status: 200,
      data: {
        accountTd: '7892b2aa-7538-467a-a0f1-6e96a2ca9e8c',
      },
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  expect(output.status).toBe(expected.output.status);
	console.log('STATUS', output.status);
  console.log('DATA:', output.data);
});

test("should be return an error when email already exists", async function () {
	const input = {
		name: "John Doe",
    email: `jaojao001@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const expected = {
    output: {
      status: 422,
      data: 'Account already exists',
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toBe(expected.output.data);
});

test("should be return an error when send wrong name", async function () {
	const input = {
		name: "12563@",
    email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
  const expected = {
    output: {
      status: 422,
      data: 'Invalid name',
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toBe(expected.output.data);
});

test("should be return an error when send wrong email", async function () {
	const input = {
		name: "John Doe",
    email: `AAAAAAAAA`,
		cpf: "87748248800",
		isPassenger: true
	};
  const expected = {
    output: {
      status: 422,
      data: 'Invalid Email',
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toBe(expected.output.data);
});

test("should be return an error with wrong cpf", async function () {
	const input = {
		name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
		cpf: "111",
		isPassenger: true
	};
  const expected = {
    output: {
      status: 422,
      data: 'Invalid CPF',
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toBe(expected.output.data);
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
    output: {
      status: 422,
      data: 'Invalid CarPlate',
    },
  };

	const output = await axios.post("http://localhost:3005/signup", input);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toBe(expected.output.data);
});

test("should be return an existing account", async function () {
  const accountId = 'b65f54f6-798d-4aa9-bfce-cb906f8aac49';
  const passenger = {
    account_id: 'b65f54f6-798d-4aa9-bfce-cb906f8aac49',
    name: 'John Doe',
    email: 'john.doe0.2722987238191166@gmail.com',
    cpf: '87748248800',
    car_plate: null,
    is_passenger: true,
    is_driver: false
  }
	const output = await axios.get(`http://localhost:3005/getAccount?id=${accountId}`);

  console.log('STATUS', output.status);
  console.log('DATA', output.data);
  // expect(output.status).toBe(expected.output.status);
  expect(output.data).toEqual(passenger);
});
