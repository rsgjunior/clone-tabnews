import database from "infra/database";

export default async function status(request, response) {
  const postgresVersion = (await database.query("SHOW server_version;")).rows[0]
    .server_version;

  const maxConnections = (await database.query("SHOW max_connections;")).rows[0]
    .max_connections;

  const openedConnections = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';"
  );

  response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections.rows[0].count,
      },
    },
  });
}
