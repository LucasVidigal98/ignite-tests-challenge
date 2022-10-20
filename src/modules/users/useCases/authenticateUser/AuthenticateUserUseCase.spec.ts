import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

import * as dotenv from 'dotenv';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

dotenv.config();

describe('Testtin AuthenticateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('Should be able to authenticate a user', async () => {
    const userCeated = await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });

    const { token, user } = await authenticateUserUseCase.execute({ email: userCeated.email, password: 'Teste' });

    expect(token).toBeDefined();
    expect(user.id).toEqual(userCeated.id);
  });

  it('Should to not authenticate a user with wrong email', () => {
    expect(async () => {
      await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });
      await authenticateUserUseCase.execute({ email: 'Teste@erro.com', password: 'Teste' });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('Should to not authenticate a user with wrong password', () => {
    expect(async () => {
      await createUserUseCase.execute({ name: 'Teste', email: 'Teste@teste.com', password: 'Teste' });
      await authenticateUserUseCase.execute({ email: 'Teste@teste.com', password: 'erro' });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})