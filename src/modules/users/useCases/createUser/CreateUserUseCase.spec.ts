import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe('Testing CreateUserUseCase', () => {

  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('Should be able to create a user', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    expect(user.name).toBe('Teste');
    expect(user.email).toBe('Teste@teste.com');
  })
});