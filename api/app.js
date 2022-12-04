import { serve } from "https://deno.land/std@0.160.0/http/server.ts";
import postgres from "https://deno.land/x/postgresjs@v3.3.2/mod.js";

const PGPASS = Deno.env.get("PGPASS").trim();
const PGPASS_PARTS = PGPASS.split(":");

const host = PGPASS_PARTS[0];
const port = PGPASS_PARTS[1];
const database = PGPASS_PARTS[2];
const username = PGPASS_PARTS[3];
const password = PGPASS_PARTS[4];

const sql = postgres({
  host, port, database, username, password
});

const server = `Server: ${Math.floor(10000 * Math.random())}`;

const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (url.pathname == "/add") {
    const rnd = `Name: ${Math.floor(Math.random() * 10000)}`;
    await sql`INSERT INTO names (name) VALUES(${rnd})`;
  }


  const data = {
    names: await sql`SELECT * FROM names`,
    server: server,
    path: url.pathname,
  };

  return new Response(JSON.stringify(data));
};

await serve(handleRequest, { port: 7777 });
