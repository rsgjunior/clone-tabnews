import database from "infra/database";

export default async function status(request, response) {
  const postgresVersion = (await database.query("SHOW server_version")).rows[0]
    .server_version;

  response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: postgresVersion,
      },
    },
  });
}
