const request = require("supertest");
const app = require("../app");
const Task = require("../models/task_model");

const {
  taskOne,
  taskThree,
  userOneId,
  userOne,
  userTwo,
  setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

describe("Tasks route, add, delete,patch, get", () => {
  it("Should get all tasks from user authenticated", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    const taskOne = await Task.findById(response.body[0]._id);
    const taskTwo = await Task.findById(response.body[1]._id);
    expect(response.body.length).toBeGreaterThan(0);
    expect(taskOne && taskTwo).not.toBeNull();
    expect(taskOne.completed).toEqual(false);
    expect(taskTwo.completed).toEqual(true);
  });
  it("Should create task for user", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .send({ description: "From my test" })
      .expect(201);

    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();
    expect(task.completed).toBeFalsy();
  });

  it("Should delete all tasks for user", async () => {
    const response = await request(app)
      .delete("/tasks")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)

      .expect(200);

    expect(response.body.length).toBeFalsy();
    expect(response.body).toEqual({});

    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
  });

  it("Should not delete tasks for unauthenticated user", async () => {
    await request(app).delete("/tasks").expect(401);
  });

  it("Should get one task for user", async () => {
    const response = await request(app)
      .get(`/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task).toMatchObject({
      description: "First Task test",
      owner: userOne._id,
    });
  });

  it("Should not get task for unauthenticated user", async () => {
    await request(app).get(`/tasks/${taskOne._id}`).expect(401);
  });

  it("Should delete task for user", async () => {
    await request(app).delete(`/tasks/${taskThree._id}`).expect(401);
  });
  it("Should not delete task for another user", async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
      .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  });
});
