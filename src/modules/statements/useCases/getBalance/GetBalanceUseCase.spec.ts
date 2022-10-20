import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe('Testing GetBalanceUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it('Should be able to get balance', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string});

    expect(balance.balance).toBe(0);
  });

  it('Should not be able to get balance if user not exists', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'invalid'});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});