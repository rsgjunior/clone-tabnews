test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  // updated at assertions
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  // dependencies assertions
  expect(responseBody.dependencies).toBeDefined();

  // database assertions
  expect(responseBody.dependencies.database).toBeDefined();
  expect(responseBody.dependencies.database.version).toEqual("16.0");
});
