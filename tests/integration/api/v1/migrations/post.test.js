import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  for (const index in Array.from({ length: 2 })) {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });
    const isFirstRequest = index == 0;

    expect(response.status).toBe(isFirstRequest ? 201 : 200);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);

    if (index == 0) {
      expect(responseBody.length).toBeGreaterThan(0);
    } else {
      expect(responseBody.length).toBe(0);
    }
  }
});
