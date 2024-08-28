import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

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

      return response
        .status(migratedMigrations.length ? 201 : 200)
        .json(migratedMigrations);
    }

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...commonConfigs,
        dryRun: true,
      });

      return response.status(200).json(pendingMigrations);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send();
  } finally {
    await dbClient.end();
  }
}
