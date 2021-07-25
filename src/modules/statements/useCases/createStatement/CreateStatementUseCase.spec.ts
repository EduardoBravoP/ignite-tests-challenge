import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatement: CreateStatementUseCase
let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository

describe("Create statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    createStatement = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    )
  })

  it("Should be able to create a new statement", async () => {
    const user = await usersRepository.create({
      name: "Test",
      email: "example@test.com",
      password: "1234"
    })

    const operation = await createStatement.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Example description"
    })

    expect(operation).toHaveProperty("id")
  })

  it("Should not be able to withdraw if the user does not have enough money", async () => {
    const user = await usersRepository.create({
      name: "Test",
      email: "example@test.com",
      password: "1234"
    })

    expect(async () => {
      await createStatement.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "Example description"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
