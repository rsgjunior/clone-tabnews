import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const commonConfigs = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...commonConfigs,
      dryRun: false,
    });

    await dbClient.end();

    return response
      .status(migratedMigrations.length ? 201 : 200)
      .json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...commonConfigs,
      dryRun: true,
    });

    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  response.status(405).end();
}
