const request = require("supertest");
const app = require("../app");

it("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "ThomasTest",
      email: "thomas@gmail.com",
      password: "Thomas123.",
    })
    .expect(201);
});
