import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const CONCURRENT_CONNECTIONS = 2;

const getPoolParams = () => {
  let PGPASS = Deno.env.get("PGPASS");
  if(PGPASS) {
    const PGPASS_PARTS = PGPASS.trim().split(":");
    const hostname = PGPASS_PARTS[0];
    const port = PGPASS_PARTS[1];
    const database = PGPASS_PARTS[2];
    const user = PGPASS_PARTS[3];
    const password = PGPASS_PARTS[4];

    return { hostname, user, password, database, port}
  } 

  return {}
}

const connectionPool = new Pool(getPoolParams(), CONCURRENT_CONNECTIONS);
const executeQuery = async (query, params) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, params);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};

export { executeQuery };
