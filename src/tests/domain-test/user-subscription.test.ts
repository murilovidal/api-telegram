import "mocha";
import { expect } from "chai";
import { UserDatasource } from "../../data/datasource/user.datasource";
import { User } from "../../data/entity/user.entity";
import { UserSubscription } from "../../domain/user-subscription.use-case";
import { UserUnsubscription } from "../../domain/user-unsubscription.use-case";

describe("Subscribe user", () => {
  let userDatasource: UserDatasource;
  let userSubscription: UserSubscription;
  let userUnsubscription: UserUnsubscription;

  before(() => {
    userDatasource = new UserDatasource();
    userSubscription = new UserSubscription();
    userUnsubscription = new UserUnsubscription();
  });

  it("Should return a true when the user is subscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    expect(await userSubscription.subscribeUser(user)).to.be.true;
  });

  it("Should save user when it subscribes first time", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscription.subscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.telegramId).to.be.eq(user.telegramId);
    expect(saved!.firstName).to.be.eq(user.firstName);
  });

  it("Should save user as active true when subscribing", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscription.subscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.isActive).to.be.true;
  });

  it("Should save user as active false when unsubscribing", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;
    await userSubscription.subscribeUser(user);

    await userUnsubscription.unsubscribeUser(user);
    const saved = await userDatasource.findUserById(user.telegramId);

    expect(saved!.isActive).to.be.false;
  });

  it("Should return 'User already subscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123;
    await userSubscription.subscribeUser(user);

    try {
      await userSubscription.subscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("User already subscribed.");
      return;
    }

    expect.fail("Should have thrown an error");
  });

  it("Should return a true when the user is unsubscribed", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123445;

    await userSubscription.subscribeUser(user);

    expect(await userUnsubscription.unsubscribeUser(user)).to.be.true;
  });

  it("Should return error when unsubscribing the user fails", async () => {
    const user = new User();
    user.firstName = "Rorschasch";
    user.telegramId = 123;

    await userSubscription.subscribeUser(user);

    try {
      return await userUnsubscription.unsubscribeUser(user);
    } catch (error) {
      expect(error.message).to.be.eq("Error: Failed to unsubscribe user.");
    }
  });
});