import {
  getRepository,
  InsertResult,
  getConnection,
  UpdateResult,
} from "typeorm";
import { User } from "../entity/user.entity";

export class UserDatasource {
  public async setUser(user: User): Promise<InsertResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return await repository
      .createQueryBuilder()
      .insert()
      .values([{ telegramId: user.telegramId, firstName: user.firstName }])
      .execute();
  }

  public async activateUser(user: User): Promise<UpdateResult> {
    const connection = getConnection();
    const repository = connection.getRepository(User);

    return repository.update(user.telegramId, { isActive: true });
  }

  public async findUserById(telegramId: number): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne(telegramId);

    if (!user) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  public async findUserByName(firstName: string): Promise<User> {
    const connection = getConnection();
    const repository = connection.getRepository(User);
    const user = await repository.findOne({ where: { firstName: firstName } });

    if (!user) {
      throw new Error("User not found.");
    } else {
      return user;
    }
  }

  public async getAll(): Promise<User[]> {
    const repository = getRepository(User);

    let users = await repository.find({ where: { isActive: true } });
    if (!users) {
      throw new Error("No user found.");
    } else {
      return users;
    }
  }

  public async deleteUser(user: User): Promise<UpdateResult> {
    const repository = getRepository(User);

    return await repository.update(user.telegramId, { isActive: false });
  }
}
