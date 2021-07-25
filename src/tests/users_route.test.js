const request = require("supertest");
const app = require("../app");
const User = require("../models/user_model");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

it("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "ThomasTest",
      email: "thomas@gmail.com",
      password: "Thomas123.",
    })
    .expect(201);

  //* Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //* Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "ThomasTest",
      email: "thomas@gmail.com",
    },
    token: user.tokens[0].token,
  });

  expect(response.body.user.password && user.password).not.toBe("Thomas123.");
});

it("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: "Test123." })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

it("Should not login wrong email / password", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "idont@exist.com", password: "TestOKOK123." })
    .expect(401);

  await request(app)
    .post("/users/login")
    .send({ email: userOne.email, password: "TestOKOK123." })
    .expect(401);
});

it("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

it("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

it("should delete user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  //* Asserts user is correctly deleted from database
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

it("should not delete unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

it("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "src/tests/fixtures/assets/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

it("Should update valid user fields", async () => {
  const newName = "Jason";
  const user = await User.findById(userOneId);
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: newName })
    .expect(200);

  const newUser = await User.findById(response.body._id);
  expect(newUser).not.toBeNull();
  expect(newUser.name).not.toBeNull();
  expect(newUser.name).not.toBe(user.name);
});

it("Should not update invalid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Stockholm" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body).not.toMatchObject({
    location: "Stockholm",
  });

  expect(user).not.toMatchObject({
    location: "Stockholm",
  });
});
