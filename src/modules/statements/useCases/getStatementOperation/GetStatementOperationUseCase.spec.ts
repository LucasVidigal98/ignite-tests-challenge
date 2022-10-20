import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe('Testing GetStatementOperationUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it('Should be able to get a statement operation', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    const statement = await createStatementUseCase.execute({
      type: OperationType.DEPOSIT,
      amount: 60,
      description: 'Teste',
      user_id: user.id as string
    });

    const operation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string
    });

    expect(operation.id).toBe(statement.id);
    expect(operation.type).toBe(OperationType.DEPOSIT);
  });

  it('Should not be able to get operation if user not exists', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

      const statement = await createStatementUseCase.execute({
        type: OperationType.DEPOSIT,
        amount: 60,
        description: 'Teste',
        user_id: user.id as string
      });

      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: 'invalid'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('Should not be able to get operation if statement not exists', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

      await getStatementOperationUseCase.execute({
        statement_id: 'invalid',
        user_id: user.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
});