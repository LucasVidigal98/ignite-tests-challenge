import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe('Testing ShowUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });
  
  it('Should be able to show profile', async () => {
    const user = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(user).toEqual(profile)
  });

  it('Should be not to return a profile if user not exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('000');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})