import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe('Testting CreateStatementUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });
  
  it('Should be able to create a statement', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    const statement = await createStatementUseCase.execute({ 
      type: OperationType.DEPOSIT, 
      amount: 60, 
      description: 'Teste', 
      user_id: user.id as string  
    });

    expect(statement.amount).toBe(60);
    expect(statement.user_id).toBe(user.id);
  });

  it('Should not be able to withdraw with balance < amount', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    await createStatementUseCase.execute({ 
      type: OperationType.DEPOSIT, 
      amount: 60, 
      description: 'Teste', 
      user_id: user.id as string  
    });

    expect(async() => {
      createStatementUseCase.execute({ 
        type: OperationType.WITHDRAW, 
        amount: 80, 
        description: 'Teste', 
        user_id: user.id as string  
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it('Should not be able to create a statement if user not exists', async () => {
    expect(async () => {
      await createStatementUseCase.execute({ 
        type: OperationType.DEPOSIT, 
        amount: 60, 
        description: 'Teste', 
        user_id: 'invalid' 
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});