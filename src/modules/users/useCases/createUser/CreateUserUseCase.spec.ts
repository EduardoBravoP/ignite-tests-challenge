import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUser: CreateUserUseCase

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(usersRepository)
  })

  it("Should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "Example Name",
      email: "example@test.com",
      password: "1234"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create a new user with an existing email", async () => {
    await createUser.execute({
      name: "Example Name",
      email: "same@email.com",
      password: "1234"
    })

    expect(async () => {
      await createUser.execute({
        name: "Example Name",
        email: "same@email.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
