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
