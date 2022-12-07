import { serve } from "./deps.js";

const sockets = new Map();

const createWebSocketConnection = (request, userId) => {
  const { socket, response } = Deno.upgradeWebSocket(request);
  const id = self.crypto.randomUUID();
  socket.onopen = () => socket.send(JSON.stringify({"id": id}))
  socket.onmessage = (e) => console.log(`Received a message: ${e.data}`);
  
  socket.onclose = (code, reason) => {
    if(sockets.get(id)) {
      console.log("WS closed code: ", code);
      console.log("WS closed reason: ", reason);
      sockets.delete(id);
    }
  };

  socket.onerror = (e) => console.error("WS error:", e);

  sockets.set(id, socket);

  return response;
};

const handleRequest = async (request) => {
  const {pathname, search } = new URL(request.url);
  const queries = search.substring(1).split('&');

  if (pathname === "/connect") {
    return createWebSocketConnection(request, queries[0]);
  }
  
  if (request.method === 'POST') {
    const body = await request.json();
    sockets.forEach((socket, key) => socket.send(
      JSON.stringify({ key, ...body})
    ))
  } 

  return new Response(200);
};

serve(handleRequest, { port: 7779 });
