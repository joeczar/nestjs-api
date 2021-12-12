import {
  getConnectionOptions,
  getConnection,
  Connection,
  ConnectionOptions,
} from 'TypeORM';
export const getDbConnectionOptions = async (
  connectionName = 'default',
): Promise<ConnectionOptions> => {
  const options = await getConnectionOptions(
    process.env.NODE_ENV || 'development',
  );
  return {
    ...options,
    name: connectionName,
  };
};

export const getDbConnection = async (
  connectionName = 'default',
): Promise<Connection> => {
  return await getConnection(connectionName);
};
export const runDbMigrations = async (
  connectionName = 'default',
): Promise<void> => {
  const conn = await getDbConnection(connectionName);
  await conn.runMigrations();
};
