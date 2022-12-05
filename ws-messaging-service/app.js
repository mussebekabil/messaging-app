import { serve } from "./deps.js";

const sockets = new Map();

const createWebSocketConnection = (request, userId) => {
  const { socket, response } = Deno.upgradeWebSocket(request);
  
  socket.onopen = () => socket.send(JSON.stringify({"id": userId}))
  socket.onmessage = (e) => console.log(`Received a message: ${e.data}`);

  socket.onclose = (code, reason) => {
    if(sockets.get(userId)) {
      console.log("WS closed code: ", code);
      console.log("WS closed reason: ", reason);
      sockets.delete(userId);
    }
  };

  socket.onerror = (e) => console.error("WS error:", e);

  sockets.set(userId, socket);

  return response;
};

const handleRequest = async (request) => {
  const {pathname, search } = new URL(request.url);
  const queries = search.substring(1).split('&');
  const userId = queries[0];
  if (pathname === "/grade" && Object.keys(sockets).includes(userId)) {
    sockets[userId].send(JSON.stringify({ 
      userId,
      exerciseId: queries[1],
      result: queries[2]
    }))
  } else if (pathname === "/connect") {

    return createWebSocketConnection(request, queries[0]);
  }

  return new Response(200);
};

serve(handleRequest, { port: 7779 });
